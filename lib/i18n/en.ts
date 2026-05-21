const en = {
  // Navigation
  nav_program: 'Program',
  nav_countries: 'Countries',
  nav_organizations: 'Organizations',
  nav_login: 'Login',
  nav_register: 'Register',

  // Hero
  hero_headline: 'The Global Nuclear Program Intelligence Platform',
  hero_sub:
    'Track every emerging nuclear program worldwide — from policy decisions to first power. Built for analysts, regulators, and developers.',
  hero_cta_register: 'Register Free',
  hero_cta_programs: 'View Programs',

  // Metrics
  metrics_countries_value: '25+',
  metrics_countries_label: 'Countries Monitored',
  metrics_programs_value: '2',
  metrics_programs_label: 'Active Build Programs',
  metrics_iaea_value: 'Phase 2',
  metrics_iaea_label: 'Vietnam IAEA Status',

  // Latest Developments
  developments_title: 'Latest Developments',
  dev1_date: 'May 2026',
  dev1_category: 'Policy',
  dev1_title: 'Vietnam Approves Nuclear Energy Law',
  dev1_body:
    'The National Assembly passed the revised Nuclear Energy Law, clearing the legal path for the Ninh Thuan 1 project and setting a 2030 construction target.',
  dev2_date: 'April 2026',
  dev2_category: 'Technology',
  dev2_title: 'Poland Selects Westinghouse AP1000',
  dev2_body:
    'Poland confirmed the AP1000 reactor design for its first nuclear plant in Pomerania, with construction expected to begin in 2028 and first power by 2035.',
  dev3_date: 'March 2026',
  dev3_category: 'Finance',
  dev3_title: 'IAEA Milestone Review — Bangladesh',
  dev3_body:
    'Bangladesh completed its IAEA Phase 2 infrastructure milestone review for the Rooppur NPP, securing $500M in additional international financing.',

  // Footer
  footer_tagline: 'Global Nuclear Program Intelligence',
  footer_rights: '© 2026 NuclearGo. All rights reserved.',

  // Auth — shared
  auth_email: 'Email',
  auth_password: 'Password',
  auth_first_name: 'First Name',
  auth_last_name: 'Last Name',
  auth_organization: 'Organization',
  auth_country: 'Country',
  auth_role: 'Role',

  // Auth — register
  auth_register_title: 'Create your account',
  auth_register_subtitle: 'Join the global nuclear intelligence network',
  auth_register_submit: 'Create Account',
  auth_register_link: 'Already have an account?',
  auth_register_link_action: 'Sign in',

  // Auth — login
  auth_login_title: 'Sign in to NuclearGo',
  auth_login_subtitle: 'Access the nuclear program intelligence platform',
  auth_login_submit: 'Sign In',
  auth_login_link: "Don't have an account?",
  auth_login_link_action: 'Register free',

  // Auth — messages
  auth_check_email: 'Check your email',
  auth_check_email_body:
    'We sent a confirmation link to your email address. Click it to activate your account.',

  // Dashboard
  dashboard_title: 'Dashboard',
  dashboard_welcome: 'Welcome back',
  dashboard_countries_card: 'Countries',
  dashboard_countries_desc: 'Nuclear program profiles and IAEA status',
  dashboard_plants_card: 'Plants',
  dashboard_plants_desc: 'Active reactor construction and milestones',
  dashboard_developments_card: 'Developments',
  dashboard_developments_desc: 'Latest policy, finance, and technology news',
  dashboard_coming_soon: 'Coming soon',
} as const

export type TranslationKey = keyof typeof en
export default en
