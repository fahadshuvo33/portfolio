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
} from './config'
import { USAGE_EXAMPLES, AVAILABLE_THEMES, CATEGORY_ICONS, COMMAND_ICONS } from './config' // Import all necessary constants as values

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
   * Find similar fields for a given input
   */
  findSimilarFields(input: string): string[] {
    if (!input) return []

    const inputLower = input.toLowerCase().trim()
    const allFields = this.getAvailableFields()

    // Check for exact matches in similar fields (including commands)
    for (const [actualField, aliases] of Object.entries(similarFields)) {
      if (aliases.some((alias) => alias.toLowerCase() === inputLower)) {
        return [actualField]
      }
    }

    // Then check for partial matches
    const matches = []
    for (const [actualField, aliases] of Object.entries(similarFields)) {
      if (
        actualField.toLowerCase().includes(inputLower) ||
        aliases.some((alias) => alias.toLowerCase().includes(inputLower))
      ) {
        matches.push(actualField)
      }
    }

    // Also check direct field matches
    for (const field of allFields) {
      if (field.toLowerCase().includes(inputLower) && !matches.includes(field)) {
        matches.push(field)
      }
    }

    return matches.slice(0, 5) // Return top 5 matches
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
  /**
   * Parse query and determine type
   */
  parseQuery(query: string): {
    type: 'category' | 'fields' | 'special'
    category?: string
    fields?: string[]
  } {
    const trimmed = query.trim()

    // Check if the ENTIRE query is a special command (including aliases)
    const resolvedTrimmed = this.resolveSimilarField(trimmed)
    const commandsList = ['help', 'clear', 'fields', 'theme']

    if (
      commandsList.includes(resolvedTrimmed.toLowerCase()) ||
      resolvedTrimmed.toLowerCase().startsWith('theme')
    ) {
      return { type: 'special' }
    }

    // Check for category syntax: category[]
    if (trimmed.endsWith('[]') && trimmed.length > 2) {
      const category = trimmed.slice(0, -2).toLowerCase()
      return { type: 'category', category }
    }

    // Everything else is treated as fields
    const fields = this.parseFields(trimmed)
    return { type: 'fields', fields }
  }
  /**
   * Handle mixed commands with other fields
   */
  /**
   * Handle mixed commands with other fields
   */

  /**
   * Handle special commands (theme, clear, help, fields)
   */
  /**
   * Handle special commands (theme, clear, help, fields)
   */
  async handleSpecialCommand(command: string): Promise<TerminalResult | null> {
    // Store the original command for theme processing
    const originalCommand = command.trim()

    // Resolve any similar fields
    const resolvedCommand = this.resolveSimilarField(originalCommand)
    const cmd = resolvedCommand.toLowerCase()

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
      const examplesList = terminalDesc.examples.map((example) => `  $ ${example}`).join('\n')

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
        '',
      ].join('\n')

      return {
        data: {
          action: 'help',
          message: helpMessage,
        },
        metadata: {
          totalFields: 1,
          validFields: 1,
          hiddenFields: 0,
          invalidFields: 0,
        },
      }
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
      // Use original command to preserve the theme name
      const parts = originalCommand.split(' ')
      const themeName = parts[1]

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

  /**
   * Main query processor that routes to appropriate handlers
   */
  /**
   * Main query processor that routes to appropriate handlers
   */
  async processQuery(query: string): Promise<TerminalResult> {
    if (!query || query.trim() === '') {
      return {
        data: {
          message: '❌ Please enter a command or field name\n\n💡 Type "help" for usage examples',
        },
        metadata: { totalFields: 0, validFields: 0, hiddenFields: 0, invalidFields: 1 },
      }
    }

    const parsed = this.parseQuery(query)

    switch (parsed.type) {
      case 'special':
        const resolvedCommand = this.resolveSimilarField(query.trim())
        const specialResult = await this.handleSpecialCommand(resolvedCommand)
        return (
          specialResult || {
            data: { message: '❌ Invalid special command\n\n💡 Type "help" for usage examples' },
            metadata: { totalFields: 0, validFields: 0, hiddenFields: 0, invalidFields: 1 },
          }
        )

      case 'category':
        return await this.getCategoryByName(parsed.category!)

      case 'fields':
        return await this.getFieldsByNames(parsed.fields!)

      default:
        return {
          data: { message: '❌ Invalid query format\n\n💡 Type "help" for usage examples' },
          metadata: { totalFields: 0, validFields: 0, hiddenFields: 0, invalidFields: 1 },
        }
    }
  }
  private parseFields(query: string): string[] {
    // Handle comma-separated fields
    if (query.includes(',')) {
      return query
        .split(',')
        .map((field) => field.trim())
        .filter(Boolean)
    }

    // For space-separated fields, we need to be more careful
    // Don't split on spaces within quotes, and preserve fields starting with - or --
    const fields: string[] = []
    let currentField = ''
    let inQuotes = false

    for (let i = 0; i < query.length; i++) {
      const char = query[i]

      if (char === '"' || char === "'") {
        inQuotes = !inQuotes
        continue
      }

      if (char === ' ' && !inQuotes) {
        if (currentField.trim()) {
          fields.push(currentField.trim())
        }
        currentField = ''
      } else {
        currentField += char
      }
    }

    // Don't forget the last field
    if (currentField.trim()) {
      fields.push(currentField.trim())
    }

    return fields.filter(Boolean)
  }

  private resolveSimilarField(queryField: string): string {
    const queryFieldLower = queryField.toLowerCase().trim()

    // Check if it's an exact match for an actual field
    for (const [actualField, similarNames] of Object.entries(similarFields)) {
      if (actualField.toLowerCase() === queryFieldLower) {
        return actualField
      }

      // Check similar names - ensure we're comparing trimmed lowercase versions
      for (const similarName of similarNames) {
        if (similarName.toLowerCase().trim() === queryFieldLower) {
          return actualField
        }
      }
    }

    // Return the original field if no match found
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

    // Return null for invalid fields (including commands when not used properly)
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

  private getHiddenFieldNamesWithAliases(): Set<string> {
    const hiddenNames = new Set<string>()

    // Add all hidden fields and their keys from portfolioData.hidden
    for (const category of this.getAvailableCategories()) {
      const hiddenCategoryData =
        portfolioData.hidden?.[category as keyof typeof portfolioData.hidden]
      if (hiddenCategoryData) {
        Object.keys(hiddenCategoryData).forEach((key) => {
          hiddenNames.add(key.toLowerCase())
          // Add aliases for these hidden keys if they exist in similarFields
          if (similarFields[key]) {
            similarFields[key].forEach((alias) => hiddenNames.add(alias.toLowerCase()))
          }
        })
      }
    }

    // Also ensure any field explicitly marked as hidden in findFieldAnywhere logic is covered
    // (though the above should mostly cover it if hiddenData is comprehensive)
    Object.entries(similarFields).forEach(([actualField, aliases]) => {
      const fieldInfo = this.findFieldAnywhere(actualField)
      if (fieldInfo.type === 'hidden') {
        hiddenNames.add(actualField.toLowerCase())
        aliases.forEach((alias) => hiddenNames.add(alias.toLowerCase()))
      }
    })

    return hiddenNames
  }

  /**
   * Get all available field names including similar field names (excluding hidden)
   */
  getFieldsWithSimilars(): string[] {
    const fields = new Set<string>()
    const categories = this.getAvailableCategories()
    const hiddenFields = this.getHiddenFieldNamesWithAliases()

    // Add fields from all categories, filtering out hidden ones
    for (const category of categories) {
      const categoryData = this.getCategoryData(category)
      if (categoryData && typeof categoryData === 'object') {
        Object.keys(categoryData).forEach((key) => {
          if (!hiddenFields.has(key.toLowerCase())) {
            fields.add(key)
          }
        })
      }
    }

    // Add fields from extraData, filtering out hidden ones
    if (portfolioData.extraData && typeof portfolioData.extraData === 'object') {
      Object.keys(portfolioData.extraData).forEach((key) => {
        if (!hiddenFields.has(key.toLowerCase())) {
          fields.add(key)
        }
      })
    }

    // Add both actual field names AND similar field names, filtering out hidden ones
    Object.entries(similarFields).forEach(([actualField, similarNames]) => {
      if (!hiddenFields.has(actualField.toLowerCase())) {
        fields.add(actualField)
      }
      similarNames.forEach((name) => {
        if (!hiddenFields.has(name.toLowerCase())) {
          fields.add(name)
        }
      })
    })

    return Array.from(fields).sort()
  }
}

export const dataManager = new TerminalDataManager()
