const ar = {
  // Metadata
  meta: {
    title: 'الحسين عبدالصبور | مطور تطبيقات الموبايل',
    description: 'مطور تطبيقات موبايل محترف متخصص في Flutter و Kotlin و تطوير التطبيقات المتعددة المنصات',
  },
  
  // Navigation
  nav: {
    home: 'الرئيسية',
    about: 'عني',
    projects: 'المشاريع',
    skills: 'المهارات',
    works: 'الخبرات',
    contact: 'تواصل معي',
    admin: 'لوحة التحكم',
  },
  
  // Hero Section
  hero: {
    greeting: 'مرحباً، أنا',
    name: 'الحسين عبدالصبور',
    title: 'مطور تطبيقات الموبايل',
    subtitle: 'أبني تطبيقات موبايل عالية الجودة باستخدام Flutter و Kotlin وأحدث التقنيات',
    cta: 'تصفح مشاريعي',
    contact: 'تواصل معي',
  },
  
  // About Section
  about: {
    title: 'عني',
    subtitle: 'تعرف علي أكثر',
    description: [
      'أنا الحسين، مطور Flutter بحب أبني تطبيقات موبايل سريعة، أنيقة، وسهلة الاستخدام، وتشتغل بكفاءة على أندرويد و iOS من كود واحد.',
      'اشتغلت على تطبيقات في مجالات مختلفة زي التجارة الإلكترونية، التعليم، السوشيال ميديا، وتطبيقات الإنتاجية، ودايمًا تركيزي بيكون على الأداء، التجربة، ونظافة الكود.',
      'مهتم بالتعلم المستمر ومتابعة كل جديد في Flutter و Dart، وبحب أطبق أفضل الممارسات بدل ما أكتب كود وخلاص. بالنسبة لي، تجربة المستخدم مش إضافة… دي الأساس.',
      'بعيدًا عن الشغل، بستكشف تقنيات جديدة، أشارك في مشاريع مفتوحة المصدر، وبحب أشارك اللي اتعلمته مع مجتمع المطورين.'
    ],
    experience: 'سنوات الخبرة',
    projects: 'المشاريع المكتملة',
    clients: 'العملاء',
  },
  
  // Skills Section
  skills: {
    title: 'المهارات',
    subtitle: 'التقنيات التي أتقنها',
    categories: {
      mobile: 'تطوير الموبايل',
      backend: 'الخلفية',
      database: 'قواعد البيانات',
      devops: 'DevOps',
      tools: 'الأدوات',
      design: 'التصميم',
    },
  },
  
  // Works Section
  works: {
    title: 'الخبرات العملية',
    subtitle: 'مسيرتي المهنية',
    current: 'حالياً',
    present: 'الآن',
    to: '←',
  },
  
  // Projects Section
  projects: {
    title: 'المشاريع',
    subtitle: 'أعمالي المميزة',
    viewAll: 'عرض جميع المشاريع',
    viewProject: 'عرض المشروع',
    viewCode: 'عرض الكود',
    liveDemo: 'تصفح التطبيق',
    featured: 'مميز',
    technologies: 'التقنيات المستخدمة',
  },
  
  // Tech Stack Section
  techStack: {
    title: 'التقنيات',
    subtitle: 'الأدوات والتقنيات التي أستخدمها',
  },
  
  // Contact Section
  contact: {
    title: 'تواصل معي',
    subtitle: 'دعنا نعمل معاً',
    description: 'هل لديك مشروع في ذهنك؟ تواصل معي وسأكون سعيداً بمساعدتك!',
    form: {
      name: 'الاسم',
      namePlaceholder: 'أدخل اسمك',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      subject: 'الموضوع',
      subjectPlaceholder: 'ما موضوع رسالتك؟',
      message: 'الرسالة',
      messagePlaceholder: 'اكتب رسالتك هنا...',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      success: 'تم إرسال رسالتك بنجاح!',
      error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    },
  },
  
  // Footer
  footer: {
    rights: 'جميع الحقوق محفوظة',
    madeWith: 'صنع',
    by: 'بواسطة',
  },
  
  // Common
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    close: 'إغلاق',
    open: 'فتح',
    search: 'بحث',
    noResults: 'لا توجد نتائج',
  },
  
  // Admin
  admin: {
    dashboard: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'دخول',
    welcomeBack: 'مرحباً بعودتك',
    
    // Sidebar
    sidebar: {
      overview: 'نظرة عامة',
      projects: 'المشاريع',
      works: 'الأعمال',
      messages: 'الرسائل',
      settings: 'الإعدادات',
    },
    
    // Projects CRUD
    projectsCrud: {
      title: 'إدارة المشاريع',
      add: 'إضافة مشروع',
      edit: 'تعديل المشروع',
      delete: 'حذف المشروع',
      deleteConfirm: 'هل أنت متأكد من حذف هذا المشروع؟',
      noProjects: 'لا توجد مشاريع بعد',
    },
    
    // Works CRUD
    worksCrud: {
      title: 'إدارة الأعمال',
      add: 'إضافة عمل',
      edit: 'تعديل العمل',
      delete: 'حذف العمل',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العمل؟',
      noWorks: 'لا توجد أعمال بعد',
    },
    
    // Messages
    messagesCrud: {
      title: 'صندوق الرسائل',
      markAsRead: 'تحديد كمقروء',
      archive: 'أرشفة',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الرسالة؟',
      noMessages: 'لا توجد رسائل جديدة',
      status: {
        new: 'جديد',
        read: 'مقروء',
        archived: 'مؤرشف',
      },
    },
    
    // Stats
    stats: {
      totalProjects: 'إجمالي المشاريع',
      totalWorks: 'إجمالي الأعمال',
      newMessages: 'رسائل جديدة',
      totalViews: 'إجمالي المشاهدات',
    },
  },
} as const

export default ar
