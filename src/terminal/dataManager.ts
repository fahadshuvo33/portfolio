/**
 * Terminal Data Manager Implementation
 */

import { portfolioData } from '@/data'
import { similarFields } from '@/data/similarFields'
import { categoryDesc, terminalDesc } from '@/data/desc'
import type {
  DataCategory,
  FieldType,
  TerminalResult,
  CommandInfo,
  QuickAction,
  AVAILABLE_THEMES,
  CATEGORY_ICONS,
  COMMAND_ICONS,
  PRO_TIPS,
  USAGE_EXAMPLES,
} from './config'

class TerminalDataManager {
  /**
   * Get all available commands dynamically
   */
  getAvailableCommands(): CommandInfo[] {
    const categories = this.getAvailableCategories()

    return [
      {
        name: 'help',
        description: terminalDesc.help || 'Show help information',
        usage: [USAGE_EXAMPLES.theme[0]],
        icon: COMMAND_ICONS.help,
      },
      {
        name: 'clear',
        description: 'Clear terminal screen and reset session',
        usage: ['clear'],
        icon: COMMAND_ICONS.clear,
      },
      {
        name: 'theme',
        description: 'Change terminal theme and visual style',
        usage: ['theme <name>', 'theme', `Available: ${AVAILABLE_THEMES.join(', ')}`],
        icon: COMMAND_ICONS.theme,
      },
      {
        name: 'fields',
        description: 'Show fields modal with all available fields by category',
        usage: ['fields'],
        icon: COMMAND_ICONS.fields,
      },
      ...categories.map((cat) => ({
        name: `${cat}[]`,
        description: categoryDesc[cat] || `Show all ${cat} information`,
        usage: [`${cat}[]`],
        icon: CATEGORY_ICONS[cat] || '📄',
      })),
      {
        name: 'field-queries',
        description: 'Get specific fields using field names',
        usage: [
          ...USAGE_EXAMPLES.singleField,
          ...USAGE_EXAMPLES.multipleSpace,
          ...USAGE_EXAMPLES.multipleComma,
        ],
        icon: COMMAND_ICONS.fieldQueries,
      },
    ]
  }

  /**
   * Get available categories dynamically
   */
  getAvailableCategories(): DataCategory[] {
    return ['about', 'education', 'experience', 'projects', 'skills']
  }

  /**
   * Get all available field names across categories (excluding hidden fields)
   */
  getAvailableFields(): string[] {
    const fields = new Set<string>()
    const categories = this.getAvailableCategories()

    // Add fields from all categories
    for (const category of categories) {
      const categoryData = this.getCategoryData(category)
      if (categoryData && typeof categoryData === 'object') {
        Object.keys(categoryData).forEach((key) => fields.add(key))
      }
    }

    // Add fields from extraData
    if (portfolioData.extraData && typeof portfolioData.extraData === 'object') {
      Object.keys(portfolioData.extraData).forEach((key) => fields.add(key))
    }

    // Add similar field names (actual fields only, not similar names)
    Object.keys(similarFields).forEach((actualField) => {
      fields.add(actualField)
    })

    return Array.from(fields).sort()
  }

  /**
   * Get all fields by category for the fields modal (excluding hidden)
   */
  getFieldsByCategory(): Record<string, string[]> {
    const categories = this.getAvailableCategories()
    const result: Record<string, string[]> = {}

    for (const category of categories) {
      const categoryData = this.getCategoryData(category)
      if (categoryData && typeof categoryData === 'object') {
        result[category] = Object.keys(categoryData).sort()
      }
    }

    // Add extra fields if they exist
    if (portfolioData.extraData && typeof portfolioData.extraData === 'object') {
      const extraFields = Object.keys(portfolioData.extraData)
      if (extraFields.length > 0) {
        result['extra'] = extraFields.sort()
      }
    }

    return result
  }

  /**
   * Get quick actions dynamically
   */
  getQuickActions(): QuickAction[] {
    const categories = this.getAvailableCategories()
    const actions: QuickAction[] = []

    // Add main categories with [] syntax
    categories.forEach((cat) => {
      actions.push({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        cmd: `${cat}[]`,
        icon: CATEGORY_ICONS[cat] || '📄',
      })
    })

    // Add field examples
    actions.push(
      { label: 'Contact Info', cmd: USAGE_EXAMPLES.multipleSpace[1], icon: '📧' },
      { label: 'Basic Info', cmd: USAGE_EXAMPLES.multipleSpace[0], icon: '👤' },
      { label: 'Fields Modal', cmd: 'fields', icon: COMMAND_ICONS.fields },
    )

    return actions
  }

  /**
   * Parse query and determine type
   */
  parseQuery(query: string): {
    type: 'category' | 'fields' | 'special'
    category?: string
    fields?: string[]
  } {
    const trimmed = query.trim()

    // Check for special commands
    if (
      ['help', 'clear', 'fields'].includes(trimmed.toLowerCase()) ||
      trimmed.toLowerCase().startsWith('theme')
    ) {
      return { type: 'special' }
    }

    // Check for category syntax: category[]
    // Alternative approach without regex
    if (trimmed.endsWith('[]') && trimmed.length > 2) {
      const category = trimmed.slice(0, -2).toLowerCase()
      return { type: 'category', category }
    }

    // Otherwise, treat as field names
    const fields = this.parseFields(trimmed)
    return { type: 'fields', fields }
  }

  /**
   * Handle special commands (theme, clear, help, fields)
   */
  async handleSpecialCommand(command: string): Promise<TerminalResult | null> {
    const cmd = command.toLowerCase().trim()

    if (cmd === 'clear') {
      return {
        data: { action: 'clear' },
        metadata: {
          totalFields: 0,
          validFields: 1,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
    }

    if (cmd === 'help') {
      // Build commands list
      const commandsList = Object.entries(terminalDesc.commands)
        .map(([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`)
        .join('\n')
      
      // Build examples list
      const examplesList = terminalDesc.examples
        .map(example => `  $ ${example}`)
        .join('\n')
      
      const helpMessage = [
        'TERMINAL HELP',
        '============',
        '',
        `Description: ${terminalDesc.description}`,
        '',
        'Available Commands:',
        commandsList,
        '',
        'Examples:',
        examplesList,
        '',
        `Hints: ${terminalDesc.hints}`,
        ''
      ].join('\n')
      
      return {
        data: {
          action: 'help',
          message: helpMessage
        },
        metadata: {
          totalFields: 1,
          validFields: 1,
          hiddenFields: 0,
          invalidFields: 0,
        },
      };
    }

    if (cmd === 'fields') {
      return {
        data: { action: 'show-fields-modal' },
        metadata: {
          totalFields: 0,
          validFields: 1,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
    }

    if (cmd.startsWith('theme')) {
      const themeName = cmd.split(' ')[1]

      if (!themeName) {
        return {
          data: {
            message: `🎨 Available themes: ${AVAILABLE_THEMES.join(', ')}\n\n💡 Usage: theme <name>\n\nExample: ${USAGE_EXAMPLES.theme[0]}`,
          },
          metadata: {
            totalFields: 1,
            validFields: 1,
            hiddenFields: 0,
            invalidFields: 0,
          },
        }
      }

      if (AVAILABLE_THEMES.includes(themeName as any)) {
        return {
          data: {
            action: 'theme',
            theme: themeName,
            message: `✅ Theme changed to: ${themeName}`,
          },
          metadata: {
            totalFields: 1,
            validFields: 1,
            hiddenFields: 0,
            invalidFields: 0,
          },
        }
      } else {
        return {
          data: {
            message: `❌ Invalid theme: ${themeName}\n\n🎨 Available themes: ${AVAILABLE_THEMES.join(', ')}\n\n💡 Usage: theme <name>`,
          },
          metadata: {
            totalFields: 1,
            validFields: 0,
            hiddenFields: 0,
            invalidFields: 1,
          },
        }
      }
    }

    return null
  }

  /**
   * Get help data using terminalDesc from desc file
   */
  private async getHelpData(): Promise<TerminalResult> {
    const commands = this.getAvailableCommands()

    let helpText = `\n${terminalDesc.description || 'Terminal Interface'}\n`
    helpText += '='.repeat(50) + '\n\n'

    if (terminalDesc.hints) {
      helpText += `💡 ${terminalDesc.hints}\n\n`
    }

    helpText += '📋 Available Commands:\n\n'

    // System commands
    const systemCommands = commands.filter((cmd) =>
      ['help', 'clear', 'theme', 'fields'].includes(cmd.name),
    )

    helpText += '🔧 System Commands:\n'
    systemCommands.forEach((cmd) => {
      helpText += `   ${cmd.icon} ${cmd.name.toUpperCase()}\n`
      helpText += `      ${cmd.description}\n`
      if (cmd.usage.length > 0) {
        cmd.usage.forEach((usage) => {
          helpText += `      Usage: ${usage}\n`
        })
      }
      helpText += '\n'
    })

    // Category commands
    const categoryCommands = commands.filter((cmd) => cmd.name.includes('[]'))
    helpText += '📁 Category Commands:\n'
    categoryCommands.forEach((cmd) => {
      helpText += `   ${cmd.icon} ${cmd.name.toUpperCase()}\n`
      helpText += `      ${cmd.description}\n`
      helpText += `      Usage: ${cmd.name}\n\n`
    })

    // Field commands
    helpText += '🏷️ Field Commands:\n'
    helpText += `   • Single field: ${USAGE_EXAMPLES.singleField.join(', ')}\n`
    helpText += `   • Multiple (space): ${USAGE_EXAMPLES.multipleSpace.join(', ')}\n`
    helpText += `   • Multiple (comma): ${USAGE_EXAMPLES.multipleComma.join(', ')}\n`
    helpText += '   • Mixed formats supported\n\n'

    helpText += '💡 Pro Tips:\n'
    PRO_TIPS.forEach((tip) => {
      helpText += `   • ${tip}\n`
    })

    return {
      data: { message: helpText },
      metadata: {
        totalFields: 1,
        validFields: 1,
        hiddenFields: 0,
        invalidFields: 0,
      },
    }
  }

  /**
   * Get specific fields by names (supports similar field resolution)
   */
  async getFieldsByNames(fieldNames: string[]): Promise<TerminalResult> {
    const result: Record<string, any> = {}
    const fieldMetadata: Record<string, FieldType> = {}
    const sources: Record<string, string> = {}
    let validFields = 0
    let hiddenFields = 0
    let invalidFields = 0

    for (const fieldName of fieldNames) {
      const actualField = this.resolveSimilarField(fieldName)
      const fieldInfo = this.findFieldAnywhere(actualField)

      result[fieldName] = fieldInfo.value
      fieldMetadata[fieldName] = fieldInfo.type

      if (fieldInfo.source) {
        sources[fieldName] = fieldInfo.source
      }

      if (fieldInfo.type === 'normal') validFields++
      else if (fieldInfo.type === 'hidden') hiddenFields++
      else invalidFields++
    }

    return {
      data: result,
      metadata: {
        totalFields: fieldNames.length,
        validFields,
        hiddenFields,
        invalidFields,
        fieldTypes: fieldMetadata,
        sources,
      },
    }
  }

  /**
   * Get data from a specific category
   */
  async getCategoryByName(category: string): Promise<TerminalResult> {
    const categories = this.getAvailableCategories()

    if (!categories.includes(category as DataCategory)) {
      return {
        data: {
          message: `❌ Invalid category: ${category}[]\n\n📁 Available categories: ${categories.map((cat) => `${cat}[]`).join(', ')}`,
        },
        metadata: {
          totalFields: 0,
          validFields: 0,
          hiddenFields: 0,
          invalidFields: 1,
        },
      }
    }

    const categoryData = this.getCategoryData(category)

    if (!categoryData) {
      return {
        data: {
          message: `❌ No data found for category: ${category}[]`,
        },
        metadata: {
          totalFields: 0,
          validFields: 0,
          hiddenFields: 0,
          invalidFields: 1,
        },
      }
    }

    const fieldCount = Object.keys(categoryData).length

    return {
      data: categoryData,
      metadata: {
        totalFields: fieldCount,
        validFields: fieldCount,
        hiddenFields: 0,
        invalidFields: 0,
        sources: { [category]: category },
      },
    }
  }

  private parseFields(query: string): string[] {
    if (query.includes(',')) {
      return query
        .split(',')
        .map((field) => field.trim())
        .filter(Boolean)
    }

    return query
      .split(/\s+/)
      .map((field) => field.trim())
      .filter(Boolean)
  }

  private resolveSimilarField(queryField: string): string {
    const queryFieldLower = queryField.toLowerCase()

    for (const [actualField, similarNames] of Object.entries(similarFields)) {
      const similarNamesLower = similarNames.map((name) => name.toLowerCase())
      if (similarNamesLower.includes(queryFieldLower)) {
        return actualField
      }
    }

    return queryField
  }

  private findFieldAnywhere(field: string): { value: any; type: FieldType; source?: string } {
    const categories = this.getAvailableCategories()

    // Check extraData first
    if (portfolioData.extraData && field in portfolioData.extraData) {
      return {
        value: (portfolioData.extraData as any)[field],
        type: 'normal',
        source: 'extra',
      }
    }

    // Check hidden fields across all categories
    for (const category of categories) {
      const hiddenData = portfolioData.hidden?.[category as keyof typeof portfolioData.hidden]
      if (hiddenData && field in hiddenData) {
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
        return {
          value: (categoryData as any)[field],
          type: 'normal',
          source: category,
        }
      }
    }

    // Return null for invalid fields instead of error
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
}

export const dataManager = new TerminalDataManager()
