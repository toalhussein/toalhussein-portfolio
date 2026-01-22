import ar from './ar'
import en from './en'

export const dictionaries = {
  ar,
  en,
} as const

// Create a generic Dictionary type that works for both locales
export type Dictionary = {
  readonly meta: {
    readonly title: string
    readonly description: string
  }
  readonly nav: {
    readonly home: string
    readonly about: string
    readonly projects: string
    readonly skills: string
    readonly works: string
    readonly contact: string
    readonly admin: string
  }
  readonly hero: {
    readonly greeting: string
    readonly name: string
    readonly title: string
    readonly subtitle: string
    readonly cta: string
    readonly contact: string
  }
  readonly about: {
    readonly title: string
    readonly subtitle: string
    readonly description: string
    readonly experience: string
    readonly projects: string
    readonly clients: string
  }
  readonly skills: {
    readonly title: string
    readonly subtitle: string
    readonly categories: {
      readonly mobile: string
      readonly backend: string
      readonly database: string
      readonly devops: string
      readonly tools: string
      readonly design: string
    }
  }
  readonly works: {
    readonly title: string
    readonly subtitle: string
    readonly current: string
    readonly present: string
    readonly to: string
  }
  readonly projects: {
    readonly title: string
    readonly subtitle: string
    readonly viewAll: string
    readonly viewProject: string
    readonly viewCode: string
    readonly liveDemo: string
    readonly featured: string
    readonly technologies: string
  }
  readonly techStack: {
    readonly title: string
    readonly subtitle: string
  }
  readonly contact: {
    readonly title: string
    readonly subtitle: string
    readonly description: string
    readonly form: {
      readonly name: string
      readonly namePlaceholder: string
      readonly email: string
      readonly emailPlaceholder: string
      readonly subject: string
      readonly subjectPlaceholder: string
      readonly message: string
      readonly messagePlaceholder: string
      readonly send: string
      readonly sending: string
      readonly success: string
      readonly error: string
    }
  }
  readonly footer: {
    readonly rights: string
    readonly madeWith: string
    readonly by: string
  }
  readonly common: {
    readonly loading: string
    readonly error: string
    readonly retry: string
    readonly back: string
    readonly next: string
    readonly previous: string
    readonly close: string
    readonly open: string
    readonly search: string
    readonly noResults: string
  }
  readonly admin: {
    readonly dashboard: string
    readonly login: string
    readonly logout: string
    readonly email: string
    readonly password: string
    readonly loginButton: string
    readonly welcomeBack: string
    readonly sidebar: {
      readonly overview: string
      readonly projects: string
      readonly works: string
      readonly messages: string
      readonly settings: string
    }
    readonly projectsCrud: {
      readonly title: string
      readonly add: string
      readonly edit: string
      readonly delete: string
      readonly deleteConfirm: string
      readonly noProjects: string
    }
    readonly worksCrud: {
      readonly title: string
      readonly add: string
      readonly edit: string
      readonly delete: string
      readonly deleteConfirm: string
      readonly noWorks: string
    }
    readonly messagesCrud: {
      readonly title: string
      readonly markAsRead: string
      readonly archive: string
      readonly delete: string
      readonly deleteConfirm: string
      readonly noMessages: string
      readonly status: {
        readonly new: string
        readonly read: string
        readonly archived: string
      }
    }
    readonly stats: {
      readonly totalProjects: string
      readonly totalWorks: string
      readonly newMessages: string
      readonly totalViews: string
    }
  }
}
