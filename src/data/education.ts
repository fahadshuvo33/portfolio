// src/data/education.ts
import type { EducationData } from './types'

export const education: EducationData = {
  highschool: {
    degree: ['Higher Secondary Certificate (HSC)', 'Secondary School Certificate (SSC)'],
    duration: ['2015 – 2017', '2013 – 2015'],
    institution: 'Al Amin Academy School and College',
    location: 'Chandpur, Bangladesh',
  },
  college: {
    degree: 'Bachelor of Science in Psychology',
    duration: '2017 – 2023',
    institution: 'Tejgaon College Dhaka',
    location: 'Dhaka, Bangladesh',
  },

  certifications: [
    {
      name: 'IBM Data Science Professional Certificate',
      issuer: 'Coursera',
      year: '2023',
      link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/XXXXXX',
      skills: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
    },
    {
      name: 'IBM Data Analyst Professional Certificate',
      issuer: 'Coursera',
      year: '2023',
      link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/XXXXXX',
      skills: ['Data Visualization', 'Excel', 'SQL', 'Python'],
    },
  ],

  onlineCourses: [
    {
      name: 'Complete Python Bootcamp',
      platform: 'Udemy',
      year: '2023',
      instructor: 'Jose Portilla',
    },
    {
      name: 'Django REST Framework',
      platform: 'Udemy',
      year: '2023',
    },
    {
      name: 'FastAPI - The Complete Course',
      platform: 'Udemy',
      year: '2024',
    },
  ],
}
