// src/data/types.ts

export interface Project {
  name: string
  description: string
  tech: string[]
  category?: string
  contributors?: string[]
  owner?: string
  status: 'completed' | 'in-progress' | 'maintained'
  github?: string
  live?: string
  features?: string[]
  images?: {
    thumbnail?: string
    screenshots?: string[]
    demo?: string
    architecture?: string
  }
}
export interface ProjectData {
  backend?: Project[]
  frontend?: Project[]
  fullStack?: Project[]
  analytics?: Project[]
  bots?: Project[]
  other?: Project[]
}

export interface Certification {
  name: string
  issuer: string
  year: string
  link: string
  skills: string[]
}

export interface EducationData {
  highschool: {
    degree: string[]
    duration: string[]
    institution: string
    location: string
  }
  college: {
    degree: string
    duration: string
    institution: string
    location: string
  }
  certifications: Certification[]
  onlineCourses: {
    name: string
    platform: string
    year: string
    instructor?: string
  }[]
}

export interface AboutData {
  name: string
  title: string
  subtitle: string
  bio: string
  shortBio: string
  location: string
  email: string
  phone: string
  github: string
  linkedin: string
  portfolio: string
  availability: string
  languages: string[]
}

export interface Career {
  employer: string
  position: string
  duration: string
  location: string
  description: string
  highlights: string[]
  technologies: string[]
  achievements?: string[]
  type?: string
  hoursPerWeek?: string
  workplace?: string
}

export interface ExperienceData {
  latestRole: string
  presentEmployer: string
  availability: string
  recentCareer: Career[]
  entireCareer: Career[]
}

export interface SkillsData {
  programming_languages: string[]
  apis: string[]
  frameworks: string[]
  databases: string[]
  devOps: string[]
  tools: string[]
}

export type ExtraData = {
  [key: string]: string
}

export interface HiddenData {
  about: {
    whatsapp: string
    telegram: string
    discord: string
    skype: string
    calendly: string
    zoom: string
    nickname: string
    age: string
    birthday: string
    hometown: string
    coffee: string
    editor: string
    os: string
  }
  education: {
    favorite_subject: string
    favorite_teacher: string
    [key: string]: any
  }
  experience: {
    salary: string
    rate: string
    preferred: string
    sponsorship: string
    relocation: string
    workstyle: string
    teamsize: string
    timezone: string
    [key: string]: any
  }
  skills: {
    learning: string[]
    weakness: string
    strength: string
    ai_tools: string[]
    [key: string]: any
  }
  projects: {
    favorite_project: string
    bugs_fixed: string
    failed_project: string
    [key: string]: any
  }
}

export interface PortfolioData {
  about: AboutData
  skills: SkillsData
  experience: ExperienceData
  education: EducationData
  projects: ProjectData
  extraData: ExtraData
  hidden: HiddenData
  help?: any
}
