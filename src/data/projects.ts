// src/data/projects.ts
import type { ProjectData } from './types'

export const projects: ProjectData = {
  fullStack: [
    {
      name: 'Mitnity: Event Management SaaS',
      description: 'Developing multi-tenant event platform with dynamic subdomains.',
      tech: ['Django', 'Docker', 'PostgreSQL', 'Redis', 'Vue.js'],
      category: 'Full Stack',
      status: 'in-progress',
      github: 'github.com/fahadshuvo33/mitnity',

      images: {
        thumbnail: '/images/projects/mitnity/thumbnail.png',
        screenshots: [
          '/images/projects/mitnity/screenshot-1.png', // Dashboard
          '/images/projects/mitnity/screenshot-2.png', // Event creation
          '/images/projects/mitnity/screenshot-3.png', // Ticket management
        ],
        architecture: '/images/projects/mitnity/architecture.png',
      },

      features: [
        'Multi-tenant architecture',
        'Event creation and management',
        'Ticketing system',
        'Real-time notifications',
      ],
    },
  ],
  frontend: [
    {
      name: 'QuranVerse: Educational Web App',
      description: 'Interactive Svelte application with 6000+ verses',
      tech: ['Svelte', 'Tailwind CSS', 'Quran APIs'],
      category: 'Frontend',
      status: 'completed',
      github: 'github.com/fahadshuvo33/quranverse',
      live: 'quranverse.app',

      images: {
        thumbnail: '/images/projects/quranverse/thumbnail.png',
        screenshots: [
          '/images/projects/quranverse/screenshot-1.png', // Home page
          '/images/projects/quranverse/screenshot-2.png', // Verse reader
          '/images/projects/quranverse/screenshot-3.png', // Search feature
        ],
        demo: '/images/projects/quranverse/demo.gif', // Animated demo
      },
    },
  ],
  bots: [
    {
      name: 'QuoteBot: Multi-Platform Bot',
      description:
        'Cross-platform bot serving 200+ daily inspirational quotes across Telegram and Discord',
      tech: ['Python', 'Telegram Bot API', 'Discord Bot API', 'Asyncio', 'API Ninja'],
      category: 'Bot Development',
      status: 'maintained',
      github: 'github.com/fahadshuvo33/quotebot',
      features: [
        'Multi-platform support (Telegram & Discord)',
        '200+ daily quotes',
        'Async architecture for performance',
        'Category-based quote filtering',
        'Admin commands for bot management',
      ],
    },
  ],
}
