import { ref, reactive, computed, readonly } from 'vue'

interface QueryHistory {
  query: string
  timestamp: Date
  mode: 'category' | 'freestyle'
  totalFieldsRequested: number
}

export interface GraphQLResponseMetadata {
  fieldTypes?: Record<string, 'normal' | 'hidden' | 'invalid'>
  hiddenFields?: number
  invalidFields?: number
  totalFields?: number
  validFields?: number
}

export interface GraphQLResponse {
  data: any
  errors?: Array<{ message: string }>
  metadata?: GraphQLResponseMetadata
}

interface GraphQLStats {
  totalQueries: number
  hiddenFieldsFound: number
  uniqueFieldsDiscovered: Set<string>
  queryHistory: QueryHistory[]
  foundHiddenFieldNames: Set<string>
  invalidFieldsAttempted: number
}

const graphqlStats = reactive<GraphQLStats>({
  totalQueries: 0,
  hiddenFieldsFound: 0,
  uniqueFieldsDiscovered: new Set<string>(),
  queryHistory: [],
  foundHiddenFieldNames: new Set<string>(),
  invalidFieldsAttempted: 0,
})

const sessionStartTime = ref<Date>(new Date())

export function useGraphQLStats() {
  const trackGraphQLQuery = (queryStr: string, response: GraphQLResponse) => {
    graphqlStats.totalQueries++

    const queryMode = isFreestyleQuery(queryStr) ? 'freestyle' : 'category'

    if (response.metadata && response.metadata.fieldTypes) {
      const fieldTypes = response.metadata.fieldTypes
      for (const fieldPath in fieldTypes) {
        const fieldType = fieldTypes[fieldPath]

        if (fieldType === 'invalid') {
          graphqlStats.invalidFieldsAttempted++
        } else {
          // For both 'normal' and 'hidden' fields, they are considered "discovered".
          if (!graphqlStats.uniqueFieldsDiscovered.has(fieldPath)) {
            graphqlStats.uniqueFieldsDiscovered.add(fieldPath)
          }

          if (fieldType === 'hidden') {
            if (!graphqlStats.foundHiddenFieldNames.has(fieldPath)) {
              graphqlStats.foundHiddenFieldNames.add(fieldPath)
            }
          }
        }
      }
    }

    // Update the count of unique hidden fields found.
    graphqlStats.hiddenFieldsFound = graphqlStats.foundHiddenFieldNames.size

    graphqlStats.queryHistory.push({
      query: queryStr,
      timestamp: new Date(),
      mode: queryMode,
      totalFieldsRequested:
        graphqlStats.uniqueFieldsDiscovered.size + graphqlStats.invalidFieldsAttempted,
    })

    if (graphqlStats.queryHistory.length > 50) {
      graphqlStats.queryHistory = graphqlStats.queryHistory.slice(-50)
    }
  }

  const isFreestyleQuery = (query: string): boolean => {
    const cleanQuery = query.replace(/^query\s*/, '').trim()
    return /^\{\s*[^{}]+\s*\}$/.test(cleanQuery)
  }

  const extractAllFieldNames = (query: string): string[] => {
    const fields: string[] = []
    const stack: { path: string; depth: number }[] = []
    let currentPath = ''
    let currentDepth = 0

    const matches = Array.from(query.matchAll(/(\w+)\s*(?:\([^)]*\))?\s*\{/g))

    for (const match of matches) {
      const fieldName = match[1]
      if (fieldName === 'query' || fieldName.startsWith('__')) continue

      while (stack.length > 0 && stack[stack.length - 1].depth >= currentDepth) {
        stack.pop()
      }

      currentPath = stack.length > 0 ? `${stack[stack.length - 1].path}.${fieldName}` : fieldName

      fields.push(currentPath)
      stack.push({ path: currentPath, depth: currentDepth })
      currentDepth++
    }

    return fields
  }

  const stats = computed(() => {
    const sessionMinutes = Math.floor((Date.now() - sessionStartTime.value.getTime()) / 1000 / 60)

    return {
      totalQueries: graphqlStats.totalQueries,
      hiddenFieldsFound: graphqlStats.hiddenFieldsFound,
      uniqueFieldsCount: graphqlStats.uniqueFieldsDiscovered.size,
      invalidFieldsAttempted: graphqlStats.invalidFieldsAttempted,
      sessionMinutes,
      allUniqueFieldsList: Array.from(graphqlStats.uniqueFieldsDiscovered),
      recentQueries: graphqlStats.queryHistory.slice(-5).reverse(),
      latestQuery: graphqlStats.queryHistory[graphqlStats.queryHistory.length - 1],
    }
  })

  const getQueryHistory = computed(() => {
    return graphqlStats.queryHistory.slice().reverse()
  })

  const resetGraphQLStats = () => {
    graphqlStats.totalQueries = 0
    graphqlStats.hiddenFieldsFound = 0
    graphqlStats.uniqueFieldsDiscovered.clear()
    graphqlStats.queryHistory = []
    graphqlStats.foundHiddenFieldNames.clear()
    graphqlStats.invalidFieldsAttempted = 0
    sessionStartTime.value = new Date()

    console.log('🔄 GraphQL session stats reset')
  }

  const achievements = computed(() => ({
    firstQuery: stats.value.totalQueries >= 1,
    explorer: stats.value.totalQueries >= 5,
    detective: stats.value.hiddenFieldsFound >= 3,
    fieldCollector: stats.value.uniqueFieldsCount >= 15,
    hiddenMaster: stats.value.hiddenFieldsFound >= 10,
    persistent: stats.value.sessionMinutes >= 5,
  }))

  return {
    trackGraphQLQuery,
    resetGraphQLStats,
    stats,
    achievements,
    getQueryHistory,
    rawStats: readonly(graphqlStats),
  }
}
