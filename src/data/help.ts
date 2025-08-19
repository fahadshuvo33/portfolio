interface CategoryHelp {
  description: string
  hints: string
}

interface HelpData {
  freestyle: {
    description: string
    hints: string
  }
  [key: string]: CategoryHelp
}

export const helpData: HelpData = {
  freestyle: {
    description: 'Freestyle mode - search any field across all categories and extraData',
    hints:
      'In freestyle mode, you can mix fields from any category, access detailed skill descriptions from extraData, and discover hidden fields from anywhere. Try combining normal fields (name, email), hidden fields (nickname, salary), and extraData (python, javascript) in one query. Similar field names work everywhere - fullname, gmail, py, js, etc. Perfect for exploring everything at once!',
  },

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
  terminal: {
    description: 'Terminal commands and usage',
    hints:
      "Think about project insights developers don't usually advertise - which project they're most proud of, how many bugs they've actually fixed, or if they've ever had a complete project failure. These honest developer experiences make great hidden fields.",
  },
}

export default helpData
