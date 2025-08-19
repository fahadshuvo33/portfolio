/**
 * Type Definitions
 */

export type FieldType = 'normal' | 'hidden' | 'invalid'

export interface FieldResult<T = any> {
  value: T
  type: FieldType
  message?: string
}

// Custom response type that can be either the data or an error
export type QueryResult<T = any> = T | { __error: { message: string; type: string } }

export interface DataResult<T = any> {
  data: T
  errors?: Array<{
    field: string
    message: string
    type: FieldType
  }>
  metadata?: {
    totalFields: number
    validFields: number
    hiddenFields: number
    invalidFields: number
    fieldTypes?: Record<string, FieldType>
    mode?: 'category' | 'freestyle'
  }
}

export type DataCategory =
  | 'about'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'hidden'
  | 'help'

// SINGLE, COMPLETE DataService interface
export interface DataService {
  getData<T = any>(
    category: DataCategory,
    fields?: string[],
    options?: {
      includeHidden?: boolean
      includeInvalid?: boolean
    },
  ): Promise<DataResult<T>>

  getField<T = any>(category: DataCategory, fieldPath: string): Promise<FieldResult<T>>

  getFieldsFreestyle(fields: string[]): Promise<DataResult<any>> // Required, not optional
}
