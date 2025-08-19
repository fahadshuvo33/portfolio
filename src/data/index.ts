// Import concrete data
import { about } from './about'
import { education } from './education'
import { experience } from './experience'
import { skills } from './skills'
import { projects } from './projects'
import { extraData } from './extraData'
import { helpData } from './help'
import { hiddenData } from './hidden' // ADD THIS LINE
import { similarFields } from './similarFields'

// Export all types
export type {
  AboutData,
  EducationData,
  ExperienceData,
  SkillsData,
  ProjectData,
  ExtraData,
  PortfolioData,
  HiddenData,
} from './types'

// Export unified data object
export const portfolioData = {
  about,
  skills,
  education,
  experience,
  projects,
  extraData,
  hidden: hiddenData, // ADD THIS LINE
  help: helpData,
  similarFields,
}

// Export individual data objects for granular imports
export { about, education, experience, skills, projects, extraData, helpData, hiddenData } // ADD hiddenData

// Export default for convenience
export default portfolioData
