// src/data/desc.ts
import type { DataCategory } from '@/api/types'

interface CategoryDesc {
  description: string
  hints: string
}

interface FieldDescMap {
  [fieldName: string]: string
}

// Category descriptions and hints
export const categoryDesc: Record<DataCategory, CategoryDesc> = {
  about: {
    description: 'Personal information and professional profile',
    hints:
      'Think about what personal details a developer might keep private - casual nicknames, age, hometown, personal contacts like WhatsApp or Discord, development preferences like favorite editor or OS, and fun facts like coffee preferences. Try common field variations too - fullname instead of name, gmail instead of email, mobile instead of phone.',
  },

  experience: {
    description: 'Professional work history and career information',
    hints:
      "Consider what career info developers usually don't share publicly - salary expectations, hourly rates, work style preferences (remote vs office), visa sponsorship needs, timezone, team size preferences, and relocation willingness. Alternative names work too - try pay instead of salary, remote instead of preferred.",
  },

  skills: {
    description: 'Technical skills and competencies',
    hints:
      "Think about honest self-assessment that developers rarely share openly - what they're currently learning, their biggest weaknesses, greatest strengths, and what AI tools they actually use for coding. Similar field names work - try languages instead of programming_languages, or learning instead of currently_learning.",
  },

  education: {
    description: 'Educational background and certifications',
    hints:
      "Consider personal academic memories that aren't on resumes - favorite subjects, favorite teachers, or other nostalgic school-related details. Keep it simple and think about what you'd reminisce about from your education.",
  },

  projects: {
    description: 'Portfolio projects and development work',
    hints:
      "Think about project insights developers don't usually advertise - which project they're most proud of, how many bugs they've actually fixed, or if they've ever had a complete project failure. These honest developer experiences make great hidden fields.",
  },

  hidden: {
    description: 'Confidential or sensitive information not publicly displayed',
    hints: 'These fields contain private information and are accessed through other categories.',
  },

  help: {
    description: 'Assistance and guidance for using the API',
    hints: 'Get information about categories, field usage, and query examples.',
  },
}

// Field descriptions organized by category
export const fieldDesc = {
  about: {
    name: 'Full name as used professionally',
    title: 'Professional title or role',
    subtitle: 'Secondary title or tagline',
    bio: 'Professional biography',
    shortBio: 'Brief professional summary',
    location: 'Current location or residence',
    email: 'Primary email address',
    phone: 'Contact phone number',
    github: 'GitHub profile URL',
    linkedin: 'LinkedIn profile URL',
    portfolio: 'Portfolio website URL',
    availability: 'Current availability status',
    languages: 'Spoken languages',
  },

  experience: {
    latestRole: 'Most recent job position',
    presentEmployer: 'Current company or organization',
    recentCareer: 'Recent work experience entries',
    entireCareer: 'Complete work history',
  },

  skills: {
    programming_languages: 'Programming languages proficiency',
    apis: 'API technologies and experience',
    frameworks: 'Development frameworks used',
    databases: 'Database technologies',
    devOps: 'DevOps and deployment tools',
    tools: 'Development tools and software',
  },

  education: {
    highschool: 'High school education details',
    college: 'College and university education',
    certifications: 'Professional certifications',
    onlineCourses: 'Online learning and courses',
  },

  projects: {
    backend: 'Backend development projects',
    frontend: 'Frontend development projects',
    fullStack: 'Full-stack development projects',
    analytics: 'Data analytics projects',
    bots: 'Bot and automation projects',
    other: 'Other miscellaneous projects',
  },

  // Extra data fields for freestyle mode
  extra: {
    python: 'Python programming language expertise',
    javascript: 'JavaScript programming language expertise',
    django: 'Django web framework experience',
    fastapi: 'FastAPI framework experience',
    vue: 'Vue.js frontend framework experience',
    react: 'React frontend library experience',
    postgresql: 'PostgreSQL database experience',
    mongodb: 'MongoDB NoSQL database experience',
    docker: 'Docker containerization experience',
    git: 'Version control with Git',
    postman: 'API testing with Postman',
    vscode: 'VS Code editor experience',
    rest: 'REST API design and implementation',
    graphql: 'GraphQL API experience',
    agile: 'Agile development methodology experience',
    tdd: 'Test-Driven Development experience',
  },
}

// Freestyle mode description
export const freestyleDesc = {
  description:
    'Search any field across all categories and access detailed descriptions with intelligent field mapping',
  hints:
    'Mix and match fields from different categories, use similar field names, and discover hidden personal details. This mode also unlocks extraData with detailed descriptions of programming languages and technologies.',
  help: 'Get information about categories, field usage, and query examples.',
}

export const terminalDesc = {
  description: 'Terminal-based interface for exploring my portfolio',
  hints: 'Use tab completion for commands and fields. Try different themes with the theme command.',
  help: 'Display this help message with available commands and usage',
  commands: {
    help: 'Show this help message',
    clear: 'Clear the terminal screen',
    theme: 'Change terminal theme (matrix, dracula, monokai, cyberpunk, minimal)',
    about: 'Show personal information',
    skills: 'List technical skills and competencies',
    projects: 'Show portfolio projects',
    experience: 'View work experience',
    education: 'Show educational background',
    fields: 'Show available fields for querying'
  },
  examples: [
    'theme dracula',
    'skills',
    'projects --category=fullstack',
    'experience --detailed',
    'education --format=json'
  ]
}
// Default fields for each category
export const defaultFields = {
  about: ['name', 'title', 'bio', 'email', 'github', 'location'],
  education: ['college', 'certifications'],
  skills: ['programming_languages', 'frameworks', 'databases'],
  projects: ['backend', 'frontend', 'fullStack'],
  experience: ['latestRole', 'presentEmployer', 'recentCareer'],
  freestyle: ['name', 'latestRole', 'programming_languages', 'nickname', 'git'],
}

// Helper functions to work with nested structure
export const getCategoryFields = (category: DataCategory | 'extra'): string[] => {
  if (category === 'hidden' || category === 'help') return []
  return Object.keys(fieldDesc[category as keyof typeof fieldDesc] || {})
}

export const getFieldDescription = (
  category: DataCategory | 'extra',
  fieldName: string,
): string => {
  if (category === 'hidden' || category === 'help') return `${fieldName} information`
  const categoryFields = fieldDesc[category as keyof typeof fieldDesc] as FieldDescMap | undefined
  return categoryFields?.[fieldName] || `${fieldName} information`
}

export const getAllFields = (): Array<{
  name: string
  description: string
  category: DataCategory
}> => {
  const result: Array<{ name: string; description: string; category: DataCategory }> = []

  Object.entries(fieldDesc).forEach(([categoryName, fields]) => {
    Object.entries(fields).forEach(([fieldName, description]) => {
      result.push({
        name: fieldName,
        description,
        category: categoryName as DataCategory,
      })
    })
  })

  return result
}

export const searchFields = (
  searchTerm: string,
): Array<{ name: string; description: string; category: DataCategory }> => {
  const term = searchTerm.toLowerCase()
  return getAllFields().filter(
    (field) =>
      field.name.toLowerCase().includes(term) || field.description.toLowerCase().includes(term),
  )
}
