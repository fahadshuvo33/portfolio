// composables/useFormatter.ts
import prettier from 'prettier/standalone'
import parserGraphql from 'prettier/parser-graphql'

export function useFormatter() {
  const formatGraphQL = async (text: string): Promise<string> => {
    return await prettier.format(text, {
      parser: 'graphql',
      plugins: [parserGraphql],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
    })
  }

  // Native JSON formatting - lightweight and perfect
  const formatJSON = (text: string): string => {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  }

  const isJSON = (text: string): boolean => {
    try {
      JSON.parse(text)
      return text.trim().startsWith('{') || text.trim().startsWith('[')
    } catch {
      return false
    }
  }

  const formatCode = async (text: string): Promise<string> => {
    if (isJSON(text)) {
      return formatJSON(text) // Synchronous, fast
    } else {
      return await formatGraphQL(text) // Async, more complex
    }
  }

  return {
    formatCode,
    formatGraphQL,
    formatJSON,
    isJSON,
  }
}
