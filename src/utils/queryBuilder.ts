import { ref, computed, type Ref } from 'vue'
import { fieldDescriptions } from '@/data/similarFields'

// Core query builder functionality
type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array'

interface QueryNode {
  name: string
  type: FieldType
  description?: string
  isSelected: boolean
  isHidden: boolean
  path: string
  children?: QueryNode[]
}

interface QueryStats {
  totalQueries: number
  lastExecutionTime: number
  fieldsUsed: Set<string>
  totalTime: number
  lastResponseSize: number
}

export function useQueryBuilder() {
  const selectedFields: Ref<Set<string>> = ref(new Set())
  const stats = ref<QueryStats>({
    totalQueries: 0,
    lastExecutionTime: 0,
    fieldsUsed: new Set(),
    totalTime: 0,
    lastResponseSize: 0,
  })

  // Convert field descriptions to query nodes
  const getFieldNodes = (fields: Record<string, unknown>, path: string[] = []): QueryNode[] => {
    return Object.entries(fields).map(([key, value]) => {
      const currentPath = [...path, key]
      const pathString = currentPath.join('.')

      const fieldValue = value as
        | {
            description?: string
            isHidden?: boolean
            fields?: Record<string, unknown>
            type?: string
          }
        | string

      const node: QueryNode = {
        name: key,
        type: getFieldType(fieldValue),
        description: typeof fieldValue === 'string' ? fieldValue : fieldValue?.description,
        isSelected: selectedFields.value.has(pathString),
        isHidden: typeof fieldValue === 'string' ? false : Boolean(fieldValue?.isHidden),
        path: pathString,
      }

      if (
        typeof fieldValue === 'object' &&
        fieldValue?.fields &&
        typeof fieldValue.fields === 'object'
      ) {
        node.children = getFieldNodes(fieldValue.fields, currentPath)
      }

      return node
    })
  }

  const getFieldType = (value: unknown): FieldType => {
    if (Array.isArray(value)) return 'array'

    if (typeof value === 'object' && value !== null) {
      const obj = value as { type?: string; fields?: unknown }
      if (obj.type && typeof obj.type === 'string') {
        return obj.type as FieldType
      }
      if (obj.fields) return 'object'
    }

    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    return 'string'
  }

  const toggleField = (path: string) => {
    const fields = new Set(selectedFields.value)
    if (fields.has(path)) {
      fields.delete(path)
    } else {
      fields.add(path)
    }
    selectedFields.value = fields
  }

  const generateQuery = (): string => {
    if (selectedFields.value.size === 0) return ''
    const fields = Array.from(selectedFields.value)
      .sort()
      .map((f) => `  ${f}`)
      .join('\n')
    return `query {\n${fields}\n}`
  }

  const recordQuery = (executionTime: number, responseSize: number = 0) => {
    stats.value.totalQueries++
    stats.value.totalTime += executionTime
    stats.value.lastExecutionTime = executionTime
    stats.value.lastResponseSize = responseSize

    selectedFields.value.forEach((field) => {
      stats.value.fieldsUsed.add(field)
    })
  }

  const getFieldSuggestions = (query: string): string[] => {
    if (!query) return []
    try {
      const allFields = getFieldNodes(fieldDescriptions).flatMap(getAllPaths)
      return allFields
        .filter(
          (path) => path.toLowerCase().includes(query.toLowerCase()) && !path.endsWith('.isHidden'), // Skip hidden fields in suggestions
        )
        .slice(0, 5)
    } catch (error) {
      console.error('Error getting field suggestions:', error)
      return []
    }
  }

  // Helper to get all paths from a node and its children
  const getAllPaths = (node: QueryNode): string[] => {
    const paths = [node.path]
    if (node.children) {
      Object.values(node.children).forEach((child) => {
        paths.push(...getAllPaths(child))
      })
    }
    return paths
  }

  return {
    selectedFields: computed(() => Array.from(selectedFields.value)),
    stats: computed(() => stats.value),
    fieldNodes: computed(() => getFieldNodes(fieldDescriptions)),
    toggleField,
    generateQuery,
    recordQuery,
    getFieldSuggestions,
  }
}

// Export the query builder composable
export { useQueryBuilder }
