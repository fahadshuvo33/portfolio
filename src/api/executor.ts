/**
 * Query Executor and Interface
 */

import { dataService } from './dataService'
import type { DataCategory, QueryResult } from './types'

export async function execute(query: string): Promise<QueryResult> {
  if (!query?.trim()) {
    return {
      __error: {
        message: 'Query cannot be empty',
        type: 'error',
      },
    }
  }

  // Remove 'query' keyword if present
  query = query.replace(/^query\s*/, '').trim()

  // Check if it's a freestyle query (no category, just fields)
  const freestyleMatch = query.match(/^\{\s*([^{}]+)\s*\}$/)
  if (freestyleMatch) {
    // Freestyle mode: { field1 field2 field3 }
    const fieldsStr = freestyleMatch[1]
    const fields = fieldsStr.trim().split(/\s+/).filter(Boolean)

    console.log('Freestyle query detected, fields:', fields)

    try {
      const result = await dataService.getFieldsFreestyle(fields)
      // Return both data and metadata for analytics
      return {
        ...result.data,
        __metadata: result.metadata
      }
    } catch (error) {
      // For errors, return a structured error object that will be styled differently
      return {
        __error: {
          message: error instanceof Error ? error.message : 'Failed to execute freestyle query',
          type: 'error',
        },
      }
    }
  }

  // Parse regular GraphQL-style query with categories
  const match = query.match(/\{\s*(\w+)\s*\{([^}]*)\}/)
  if (!match) {
    return {
      __error: {
        message:
          'Invalid query format. Use: { category { field1 field2 } } or { field1 field2 field3 }',
        type: 'error',
      },
    }
  }

  const [, category, fieldsStr] = match
  if (!category) {
    return {
      __error: {
        message: 'Category is required',
        type: 'error',
      },
    }
  }

  // Extract fields and clean them up
  const fields = fieldsStr.trim().split(/\s+/).filter(Boolean)

  // Define valid data categories
  const validCategories: DataCategory[] = [
    'about',
    'education',
    'experience',
    'projects',
    'skills',
    // 'hidden',
    'help',
  ]

  // Validate the requested category
  if (!validCategories.includes(category as DataCategory)) {
    return {
      __error: {
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        type: 'error',
      },
    }
  }

  try {
    const result = await dataService.getData(category as DataCategory, fields, {
      includeHidden: true,
      includeInvalid: true,
    })

    // Return both data and metadata for analytics
    return {
      ...result.data,
      __metadata: result.metadata
    }
  } catch (error) {
    return {
      __error: {
        message: error instanceof Error ? error.message : 'Failed to execute query',
        type: 'error',
      },
    }
  }
}

export const executeQuery = async (query: string): Promise<QueryResult> => {
  if (!query || typeof query !== 'string') {
    return {
      __error: {
        message: 'Invalid query: Query must be a non-empty string',
        type: 'error',
      },
    }
  }

  return await execute(query)
}

export const handleRequest = executeQuery
