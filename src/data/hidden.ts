import type { HiddenData } from './types'

export const hiddenData: HiddenData = {
  // about secrets
  about: {
    whatsapp: '+880 1798-533-533',
    telegram: '@fahadshuvo',
    discord: 'fahad#1234',
    skype: 'fahadshuvo33',
    calendly: 'calendly.com/fahadshuvo',
    zoom: 'zoom.us/my/fahadshuvo',
    nickname: 'Shuvo',
    age: "Let's keep it a mystery 😉",
    birthday: 'You can guess it 😉',
    hometown: 'Chandpur, Bangladesh',
    coffee: 'Black coffee, no sugar ☕',
    editor: 'VS Code with Dracula theme',
    os: 'Ubuntu 22.04 LTS',
  },

  // education secrets
  education: {
    favorite_subject: 'Mathematics',
    favorite_teacher: 'Nazrul Islam - My high school math teacher',
  },

  // experience secrets
  experience: {
    salary: 'Open to discuss',
    rate: '$20-60/hour',
    preferred: 'Remote/Hybrid/Onsite',
    sponsorship: 'Open to sponsorship',
    relocation: 'Open to relocation',
    workstyle: 'Agile/Scrum',
    teamsize: 'Any size, prefer medium teams',
    timezone: 'Flexible, can adapt to team needs',
  },

  // Skills secrets
  skills: {
    learning: ['Aws', 'gRpc', 'Kubernetes', 'LangChain'],
    weakness: 'Frontend animations 😅',
    strength: 'API optimization',
    ai_tools: ['ChatGPT', 'Copilot', 'Claude Code', 'Agentic-AI'],
  },

  // Project secrets
  projects: {
    favorite_project: 'Mitnity - Most challenging',
    bugs_fixed: '200+ bugs squashed',
    failed_project: 'i failed with a lot of things, but i learned a lot from them',
  },
}

/**
 * Get hidden data by command
 * @param command - The command to look up in hidden data
 * @returns The hidden data if found, null otherwise
 */
export function getHiddenData(command: string): string | null {
  // Flatten the nested structure for easier searching
  const flatData: Record<string, string> = {}

  Object.entries(hiddenData).forEach(([category, items]) => {
    if (typeof items === 'object') {
      Object.entries(items).forEach(([key, value]) => {
        flatData[`${category}.${key}`] = value
      })
    }
  })

  // Check for exact match first, then try case-insensitive
  return (
    flatData[command] ||
    Object.entries(flatData)
      .find(([k]) => k.toLowerCase() === command.toLowerCase())
      ?.at(1) ||
    null
  )
}
