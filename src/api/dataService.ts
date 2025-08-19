/**
 * Data Service Implementation
 */

import { portfolioData } from '@/data'
import { similarFields } from '@/data/similarFields'
import { categoryDesc, freestyleDesc } from '@/data/desc'
import type { DataService, DataResult, FieldResult, DataCategory, FieldType } from './types'

class PortfolioDataService implements DataService {
  async getData<T = any>(
    category: DataCategory,
    fields?: string[],
    options?: {
      includeHidden?: boolean
      includeInvalid?: boolean
    },
  ): Promise<DataResult<T>> {
    if (category === 'help') {
      return this.getHelpData(fields)
    }

    const result: any = {}
    let validFields = 0
    let hiddenFields = 0
    let invalidFields = 0

    if (!fields || fields.length === 0) {
      const categoryData = this.getCategoryData(category)
      return {
        data: categoryData as T,
        metadata: {
          totalFields: categoryData ? Object.keys(categoryData).length : 0,
          validFields: categoryData ? Object.keys(categoryData).length : 0,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
    }

    for (const field of fields) {
      if (field === 'help') {
        // Use new desc structure
        const categoryHelp = categoryDesc[category]
        result[field] = categoryHelp || null
        categoryHelp ? validFields++ : invalidFields++
        continue
      }

      const actualField = this.resolveSimilarField(field)
      const fieldInfo = this.analyzeField(category, actualField)

      result[field] = fieldInfo.value

      if (fieldInfo.type === 'normal') validFields++
      else if (fieldInfo.type === 'hidden') hiddenFields++
      else invalidFields++
    }

    const fieldMetadata: Record<string, FieldType> = {}
    for (const field of fields) {
      if (field === 'help') {
        fieldMetadata[field] = categoryDesc[category] ? 'normal' : 'invalid'
      } else {
        const actualField = this.resolveSimilarField(field)
        fieldMetadata[field] = this.analyzeField(category, actualField).type
      }
    }

    return {
      data: result as T,
      metadata: {
        totalFields: fields.length,
        validFields,
        hiddenFields,
        invalidFields,
        fieldTypes: fieldMetadata,
      },
    }
  }

  async getFieldsFreestyle(fields: string[]): Promise<DataResult<any>> {
    const result: any = {}
    let validFields = 0
    let hiddenFields = 0
    let invalidFields = 0

    for (const field of fields) {
      if (field === 'help') {
        // Use new freestyle desc structure
        result[field] = freestyleDesc
        validFields++
        continue
      }

      const actualField = this.resolveSimilarField(field)
      const fieldInfo = this.findFieldAnywhere(actualField)

      result[field] = fieldInfo.value

      if (fieldInfo.type === 'normal') validFields++
      else if (fieldInfo.type === 'hidden') hiddenFields++
      else invalidFields++
    }

    const fieldMetadata: Record<string, FieldType> = {}
    for (const field of fields) {
      if (field === 'help') {
        fieldMetadata[field] = 'normal' // freestyleDesc always exists
      } else {
        const actualField = this.resolveSimilarField(field)
        fieldMetadata[field] = this.findFieldAnywhere(actualField).type
      }
    }

    return {
      data: result,
      metadata: {
        totalFields: fields.length,
        validFields,
        hiddenFields,
        invalidFields,
        fieldTypes: fieldMetadata,
        mode: 'freestyle',
      },
    }
  }

  async getField<T = any>(category: DataCategory, fieldPath: string): Promise<FieldResult<T>> {
    const actualField = this.resolveSimilarField(fieldPath)
    const fieldInfo = this.analyzeField(category, actualField)

    return {
      value: fieldInfo.value as T,
      type: fieldInfo.type,
      message:
        fieldInfo.type === 'invalid'
          ? `Field '${fieldPath}' is not valid for category '${category}'`
          : undefined,
    }
  }

  private resolveSimilarField(queryField: string): string {
    const queryFieldLower = queryField.toLowerCase()

    for (const [actualField, similarNames] of Object.entries(similarFields)) {
      const similarNamesLower = similarNames.map((name) => name.toLowerCase())
      if (similarNamesLower.includes(queryFieldLower)) {
        console.log(`Resolved similar field: ${queryField} -> ${actualField}`)
        return actualField
      }
    }

    return queryField
  }

  private findFieldAnywhere(field: string): { value: any; type: FieldType; source?: string } {
    const categories = ['about', 'experience', 'skills', 'education', 'projects']

    // Check extraData first (freestyle only)
    if (portfolioData.extraData && field in portfolioData.extraData) {
      console.log(`Found extraData field '${field}'`)
      return {
        value: (portfolioData.extraData as any)[field],
        type: 'normal',
        source: 'extraData',
      }
    }

    // Check hidden fields across all categories
    for (const category of categories) {
      const hiddenData = portfolioData.hidden?.[category as keyof typeof portfolioData.hidden]
      if (hiddenData && field in hiddenData) {
        console.log(`Found hidden field '${field}' in category '${category}'`)
        return {
          value: (hiddenData as any)[field],
          type: 'hidden',
          source: category,
        }
      }
    }

    // Check normal fields across all categories
    for (const category of categories) {
      const categoryData = this.getCategoryData(category)
      if (categoryData && field in categoryData) {
        console.log(`Found normal field '${field}' in category '${category}'`)
        return {
          value: (categoryData as any)[field],
          type: 'normal',
          source: category,
        }
      }
    }

    console.log(`Field '${field}' not found in any category or extraData`)
    return { value: null, type: 'invalid' }
  }

  private analyzeField(category: string, field: string): { value: any; type: FieldType } {
    // Check hidden fields first
    const hiddenData = portfolioData.hidden?.[category as keyof typeof portfolioData.hidden]
    if (hiddenData && field in hiddenData) {
      console.log(`Found hidden field: ${field} = ${(hiddenData as any)[field]}`)
      return {
        value: (hiddenData as any)[field],
        type: 'hidden',
      }
    }

    // Check normal fields
    const categoryData = this.getCategoryData(category)
    if (categoryData && field in categoryData) {
      console.log(`Found normal field: ${field} = ${(categoryData as any)[field]}`)
      return {
        value: (categoryData as any)[field],
        type: 'normal',
      }
    }

    console.log(`Field not found: ${field}`)
    return { value: null, type: 'invalid' }
  }

  private getCategoryData(category: string): any {
    const data = {
      about: portfolioData.about,
      projects: portfolioData.projects,
      experience: portfolioData.experience,
      skills: portfolioData.skills,
      education: portfolioData.education,
    }

    return data[category as keyof typeof data] || null
  }

  private async getHelpData(fields?: string[]): Promise<DataResult<any>> {
    // Use the new desc structure
    const allHelpData = {
      ...categoryDesc,
      freestyle: freestyleDesc,
    }

    if (!fields || fields.length === 0) {
      return {
        data: allHelpData,
        metadata: {
          totalFields: Object.keys(allHelpData).length,
          validFields: Object.keys(allHelpData).length,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
    }

    const result: any = {}
    let validFields = 0
    let invalidFields = 0

    for (const field of fields) {
      if (field in allHelpData) {
        result[field] = (allHelpData as any)[field]
        validFields++
      } else {
        result[field] = null
        invalidFields++
      }
    }

    const fieldMetadata: Record<string, FieldType> = {}
    for (const field of fields) {
      fieldMetadata[field] = field in allHelpData ? 'normal' : 'invalid'
    }

    return {
      data: result,
      metadata: {
        totalFields: fields.length,
        validFields,
        hiddenFields: 0,
        invalidFields,
        fieldTypes: fieldMetadata,
      },
    }
  }
}

export const dataService = new PortfolioDataService()
