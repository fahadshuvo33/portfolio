import { computed } from 'vue'
import {
  categoryDesc,
  freestyleDesc,
  fieldDesc,
  defaultFields,
  getCategoryFields,
  getFieldDescription,
} from '@/data/desc'
import type { DataCategory } from '@/api/types'

type CategoryName = Exclude<DataCategory, 'hidden' | 'help'>

// Type for the default fields object
type DefaultFields = Record<CategoryName, string[]> & {
  freestyle: string[]
}

interface CategoryInfo {
  name: CategoryName
  displayName: string
  description: string
  hints: string
  allFields: string[]
  defaultFields: string[]
  exampleQuery: string
  fieldDescriptions: Record<string, string>
}

type ExtendedCategoryName = CategoryName | 'extra'

interface FreestyleInfo {
  displayName: string
  description: string
  hints: string
  defaultFields: string[]
  exampleQuery: string
  allAvailableFields: Array<{
    name: string
    description: string
    category: ExtendedCategoryName
    isDefault: boolean
  }>
}

export function useCategoryInfo() {
  // Real categories (excluding 'hidden' and 'help')
  const realCategories: CategoryName[] = ['about', 'education', 'experience', 'projects', 'skills']

  /**
   * Get all categories with complete information
   */
  const categories = computed((): CategoryInfo[] =>
    realCategories.map((categoryName) => {
      const allFields = getCategoryFields(categoryName as DataCategory)
      const categoryDefaultFields = (defaultFields as DefaultFields)[categoryName] || []

      // Create field descriptions object for this category
      const fieldDescriptions: Record<string, string> = {}
      allFields.forEach((fieldName) => {
        fieldDescriptions[fieldName] = getFieldDescription(categoryName as DataCategory, fieldName)
      })

      return {
        name: categoryName,
        displayName: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        description: categoryDesc[categoryName as DataCategory]?.description || '',
        hints: categoryDesc[categoryName as DataCategory]?.hints || '',
        allFields,
        defaultFields: categoryDefaultFields,
        exampleQuery: `query {\n  ${categoryName} {\n    ${categoryDefaultFields.join('\n    ')}\n  }\n}`,
        fieldDescriptions,
      }
    }),
  )

  /**
   * Get freestyle mode information
   */
  const freestyleInfo = computed((): FreestyleInfo => {
    // Get all fields from all categories for freestyle
    const allAvailableFields: Array<{
      name: string
      description: string
      category: ExtendedCategoryName
      isDefault: boolean
    }> = []

    // Add regular category fields
    realCategories.forEach((categoryName) => {
      const categoryFields = getCategoryFields(categoryName as DataCategory)
      categoryFields.forEach((fieldName) => {
        allAvailableFields.push({
          name: fieldName,
          description: getFieldDescription(categoryName as DataCategory, fieldName),
          category: categoryName as CategoryName,
          isDefault: (defaultFields as DefaultFields).freestyle.includes(fieldName),
        })
      })
    })

    // Add extra category fields
    const extraFields = fieldDesc.extra || {}
    Object.entries(extraFields).forEach(([fieldName, description]) => {
      allAvailableFields.push({
        name: fieldName,
        description: description as string,
        category: 'extra',
        isDefault: (defaultFields as DefaultFields).freestyle.includes(fieldName),
      })
    })

    return {
      displayName: 'Freestyle',
      description: freestyleDesc?.description || '',
      hints: freestyleDesc?.hints || '',
      defaultFields: (defaultFields as DefaultFields).freestyle,
      exampleQuery: `query {\n  ${(defaultFields as DefaultFields).freestyle.join('\n  ')}\n}`,
      allAvailableFields,
    }
  })

  /**
   * Generate example query for a category with specific fields
   */
  const generateExampleQuery = (categoryName: CategoryName, selectedFields: string[]): string => {
    const fields =
      selectedFields.length > 0
        ? selectedFields
        : (defaultFields as DefaultFields)[categoryName] || []

    return `query {\n  ${categoryName} {\n    ${fields.join('\n    ')}\n  }\n}`
  }

  /**
   * Generate freestyle query example
   */
  const generateFreestyleQuery = (selectedFields: string[]): string => {
    if (selectedFields.length === 0) {
      const fields = (defaultFields as DefaultFields).freestyle || []
      return `query {\n  ${fields.join('\n  ')}\n}`
    }
    return `query {\n  ${selectedFields.join('\n  ')}\n}`
  }

  const api = {
    // Main data
    categories,
    freestyleInfo,

    // Helper functions
    generateExampleQuery,
    generateFreestyleQuery,

    // Direct access to category names
    realCategories: computed(() => realCategories),
  }

  return api
}

// Export the main composable
export function usePortfolioApi() {
  return useCategoryInfo()
}

export default usePortfolioApi
