export interface Category {
  name: string
  displayName: string
  description: string
  allFields: string[]
  defaultFields: string[]
  fieldDescriptions: Record<string, string>
  hints?: string
  exampleQuery?: string
}

export interface FreestyleInfoType {
  displayName: string
  description: string
  defaultFields: string[]
  allAvailableFields: Array<{
    name: string
    description: string
    category?: string
    isDefault?: boolean
  }>
  hints?: string
  exampleQuery?: string
}
