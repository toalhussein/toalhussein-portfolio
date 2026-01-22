const en = {
  // Metadata
  meta: {
    title: 'Alhussein Abdalsabour | Mobile App Developer',
    description: 'Professional mobile app developer specializing in Flutter, Kotlin, and cross-platform development',
  },
  
  // Navigation
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    works: 'Experience',
    contact: 'Contact',
    admin: 'Dashboard',
  },
  
  // Hero Section
  hero: {
    greeting: "Hello, I'm",
    name: 'Alhussein Abdalsabour',
    title: 'Mobile App Developer',
    subtitle: 'I build high-quality mobile apps using Flutter, Kotlin, and cutting-edge technologies',
    cta: 'View My Work',
    contact: 'Contact Me',
  },
  
  // About Section
  about: {
    title: 'About Me',
    subtitle: 'Get to know me',
    description: [
      "Hello! I'm Alhussein, a passionate Flutter developer with a strong foundation in building cross-platform mobile applications.",
      "I specialize in creating beautiful, responsive, and performant mobile apps using Flutter and Dart. My experience spans across various domains including e-commerce, social media, education, and productivity applications.",
      "I'm constantly learning and staying up-to-date with the latest technologies and best practices in mobile development. I believe in writing clean, maintainable code and creating exceptional user experiences.",
      "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community."
    ],
    experience: 'Years Experience',
    projects: 'Completed Projects',
    clients: 'Happy Clients',
  },
  
  // Skills Section
  skills: {
    title: 'Skills',
    subtitle: 'Technologies I master',
    categories: {
      mobile: 'Mobile Development',
      backend: 'Backend',
      database: 'Databases',
      devops: 'DevOps',
      tools: 'Tools',
      design: 'Design',
    },
  },
  
  // Works Section
  works: {
    title: 'Work Experience',
    subtitle: 'My professional journey',
    current: 'Current',
    present: 'Present',
    to: '→',
  },
  
  // Projects Section
  projects: {
    title: 'Projects',
    subtitle: 'My featured work',
    viewAll: 'View All Projects',
    viewProject: 'View Project',
    viewCode: 'View Code',
    liveDemo: 'Live Demo',
    featured: 'Featured',
    technologies: 'Technologies Used',
  },
  
  // Tech Stack Section
  techStack: {
    title: 'Tech Stack',
    subtitle: 'Tools & technologies I use',
  },
  
  // Contact Section
  contact: {
    title: 'Contact Me',
    subtitle: "Let's work together",
    description: 'Have a project in mind? Reach out and I would be happy to help!',
    form: {
      name: 'Name',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      subject: 'Subject',
      subjectPlaceholder: 'What is your message about?',
      message: 'Message',
      messagePlaceholder: 'Write your message here...',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Your message has been sent successfully!',
      error: 'An error occurred, please try again.',
    },
  },
  
  // Footer
  footer: {
    rights: 'All rights reserved',
    madeWith: 'Made with',
    by: 'by',
  },
  
  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    search: 'Search',
    noResults: 'No results found',
  },
  
  // Admin
  admin: {
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    loginButton: 'Sign In',
    welcomeBack: 'Welcome back',
    
    // Sidebar
    sidebar: {
      overview: 'Overview',
      projects: 'Projects',
      works: 'Works',
      messages: 'Messages',
      settings: 'Settings',
    },
    
    // Projects CRUD
    projectsCrud: {
      title: 'Manage Projects',
      add: 'Add Project',
      edit: 'Edit Project',
      delete: 'Delete Project',
      deleteConfirm: 'Are you sure you want to delete this project?',
      noProjects: 'No projects yet',
    },
    
    // Works CRUD
    worksCrud: {
      title: 'Manage Works',
      add: 'Add Work',
      edit: 'Edit Work',
      delete: 'Delete Work',
      deleteConfirm: 'Are you sure you want to delete this work?',
      noWorks: 'No works yet',
    },
    
    // Messages
    messagesCrud: {
      title: 'Messages Inbox',
      markAsRead: 'Mark as Read',
      archive: 'Archive',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this message?',
      noMessages: 'No new messages',
      status: {
        new: 'New',
        read: 'Read',
        archived: 'Archived',
      },
    },
    
    // Stats
    stats: {
      totalProjects: 'Total Projects',
      totalWorks: 'Total Works',
      newMessages: 'New Messages',
      totalViews: 'Total Views',
    },
  },
} as const

export default en
