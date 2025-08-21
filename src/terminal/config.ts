/**
 * Terminal Configuration and Constants
 */

// Types
export type FieldType = 'normal' | 'hidden' | 'invalid'
export type DataCategory = 'about' | 'education' | 'experience' | 'projects' | 'skills'

export interface TerminalResult {
  data: any
  metadata?: {
    totalFields: number
    validFields: number
    hiddenFields: number
    invalidFields: number
    fieldTypes?: Record<string, FieldType>
    sources?: Record<string, string>
  }
}

export interface CommandInfo {
  name: string
  description: string
  usage: string[]
  icon?: string
}

export interface QuickAction {
  label: string
  cmd: string
  icon: string
}

// Constants
export const AVAILABLE_THEMES = ['matrix', 'dracula', 'monokai', 'cyberpunk', 'minimal'] as const
export type Theme = (typeof AVAILABLE_THEMES)[number]

export const CATEGORY_ICONS: Record<string, string> = {
  about: '👤',
  skills: '💻',
  projects: '📁',
  experience: '💼',
  education: '🎓',
  extra: '⭐',
}

// Fix: Make sure COMMAND_ICONS is properly exported
export const COMMAND_ICONS = {
  help: '❓',
  clear: '🧹',
  theme: '🎨',
  fields: '🔍',
  fieldQueries: '🏷️',
} as const

export const PRO_TIPS = [
  'Use "fields" to see all available fields by category',
  'Fields support similar names (e.g., "bio" → "biography")',
  'Hidden fields are accessible but not listed in fields modal',
  'Invalid fields return null instead of errors',
  'Use Tab for auto-completion',
  'Use Up/Down arrows for command history',
]

export const USAGE_EXAMPLES = {
  category: ['about[]', 'skills[]', 'projects[]'],
  singleField: ['age', 'name', 'email'],
  multipleSpace: ['name age location', 'email phone linkedin'],
  multipleComma: ['name,email,phone', 'age,salary,location'],
  theme: ['theme matrix', 'theme dracula'],
}
