// src/data/skills.ts
import type { SkillsData } from './types'

export const skills: SkillsData = {
  // Core Programming Languages
  programming_languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'],

  frameworks: ['Django', 'Flask', 'FastApi', 'AioHttp'],

  // Database Technologies
  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Django ORM', 'SQLAlchemy'],

  apis: ['RESTful API', 'GraphQL', 'WebSockets'],
  // DevOps & Infrastructure
  devOps: [
    'Docker',
    'Docker Compose',
    'GitHub Actions',
    'CI/CD Pipelines',
    'Nginx',
    'Linux',
    'Server Deployment',
  ],

  // Development Tools
  tools: ['Git', 'GitHub', 'Postman', 'VS Code', 'Jira', 'Swagger/OpenAPI', 'Docker Desktop'],
}
