/**
 * Terminal Query Executor
 */

import { dataManager } from './dataManager'
import type { TerminalResult } from './config'

export async function executeTerminalQuery(query: string): Promise<TerminalResult> {
  if (!query?.trim()) {
    return {
      data: { message: '💡 Type "help" to see available commands' },
      metadata: {
        totalFields: 1,
        validFields: 1,
        hiddenFields: 0,
        invalidFields: 0,
      },
    }
  }

  const parsedQuery = dataManager.parseQuery(query)

  // Handle special commands
  if (parsedQuery.type === 'special') {
    const specialResult = await dataManager.handleSpecialCommand(query.trim())
    if (specialResult) {
      return specialResult
    }
  }

  // Handle category queries
  if (parsedQuery.type === 'category' && parsedQuery.category) {
    return await dataManager.getCategoryByName(parsedQuery.category)
  }

  // Handle field queries
  if (parsedQuery.type === 'fields' && parsedQuery.fields) {
    if (parsedQuery.fields.length === 0) {
      return {
        data: { message: '💡 Type "help" for usage examples or "fields" to see available fields' },
        metadata: {
          totalFields: 0,
          validFields: 1,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
    }

    return await dataManager.getFieldsByNames(parsedQuery.fields)
  }

  // Fallback
  return {
    data: { message: '❌ Invalid query format\n\n💡 Type "help" for usage examples' },
    metadata: {
      totalFields: 0,
      validFields: 0,
      hiddenFields: 0,
      invalidFields: 1,
    },
  }
}

/**
 * Main terminal interface
 */
export const terminal = {
  execute: executeTerminalQuery,
  getCommands: () => dataManager.getAvailableCommands(),
  getFields: () => dataManager.getAvailableFields(),
  getFieldsByCategory: () => dataManager.getFieldsByCategory(),
  getQuickActions: () => dataManager.getQuickActions(),
  getCategories: () => dataManager.getAvailableCategories(),
}
