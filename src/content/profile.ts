import type { NavItem, Profile, SkillGroup, ContactChannel } from './types'

const BIRTH_DATE = '2003-06-10'

export function getAge(reference: Date = new Date()): number {
  const birth = new Date(`${BIRTH_DATE}T00:00:00`)
  let age = reference.getFullYear() - birth.getFullYear()
  const month = reference.getMonth() - birth.getMonth()
  if (month < 0 || (month === 0 && reference.getDate() < birth.getDate())) age -= 1
  return age
}

export const profile = {
  name: 'Victor Crepaldi Gomes',
  shortName: 'Victor Crepaldi',
  initials: 'VC',
  birthDate: BIRTH_DATE,
  role: {
    pt: 'Desenvolvedor Full Stack',
    en: 'Full Stack Developer',
  },
  tagline: {
    pt: 'Construo interfaces web limpas e rápidas com React e TypeScript.',
    en: 'I build clean, fast web interfaces with React and TypeScript.',
  },
  bio: {
    pt: [
      'Tenho {age} anos, sou de Dracena/SP e formado em Análise e Desenvolvimento de Sistemas pela FUNDEC. Hoje trabalho como Desenvolvedor Júnior na AsA Sistemas, com React, TypeScript e Styled-Components.',
      'Antes disso passei por suporte técnico e estágio. Foi ali que entendi como um sistema quebra na mão de quem usa, e não só na minha máquina.',
      'No dia a dia trabalho em projetos internos: telas novas e telas que já existem há anos. Manter o código que outra pessoa escreveu ensina tanto quanto escrever o seu.',
      'Fora do expediente estudo em trilhas da Rocketseat e da Alura, e construo projeto pessoal — que é onde dá pra errar à vontade e testar coisa nova sem quebrar a produção de ninguém.',
      'Gosto de detalhe: o layout que quebra no 320px, o loading que ninguém tratou, o clique que demora 300ms a mais do que deveria.',
    ],
    en: [
      "I'm {age}, based in Dracena, Brazil, with a degree in Systems Analysis and Development from FUNDEC. I work as a Junior Developer at AsA Sistemas with React, TypeScript and Styled-Components.",
      'Before that I worked in technical support and did an internship. That is where I learned how software breaks for the person using it, not just on my machine.',
      'Day to day I work on internal projects: new screens, and screens that have been around for years. Maintaining someone else’s code teaches you as much as writing your own.',
      'Outside work I study through Rocketseat and Alura tracks and build side projects — which is where I get to be wrong freely and try things without breaking anyone’s production.',
      'I like the details: the layout that breaks at 320px, the loading state nobody handled, the click that takes 300ms longer than it should.',
    ],
  },
  location: {
    pt: 'Dracena, São Paulo — Brasil',
    en: 'Dracena, São Paulo — Brazil',
  },
  locationUrl: 'https://maps.google.com/?q=Dracena,SP',
  email: 'victorcrepaldigomes@gmail.com',
  phone: {
    display: '+55 (18) 99791-6114',
    href: 'tel:+5518997916114',
  },
  github: 'https://github.com/VictorCrepaldiGomes',
  linkedin: 'https://linkedin.com/in/victor-gomes-b067a3266',
  site: 'https://www.victorgomes.dev.br',
  avatar: 'https://github.com/VictorCrepaldiGomes.png?size=280',
  available: true,
  resume: '/curriculo.pdf',
  diploma: '/diploma.pdf',
  focus: [
    {
      key: 'state',
      label: { pt: 'Interfaces com estado complexo', en: 'Interfaces with complex state' },
    },
    { key: 'perf', label: { pt: 'Performance e tempo de resposta', en: 'Performance and response time' } },
    { key: 'a11y', label: { pt: 'Acessibilidade e navegação por teclado', en: 'Accessibility and keyboard navigation' } },
    { key: 'system', label: { pt: 'Design system e consistência visual', en: 'Design systems and visual consistency' } },
  ],
  facts: [
    {
      key: 'role',
      label: { pt: 'Atuação', en: 'Role' },
      value: { pt: 'Desenvolvedor Júnior', en: 'Junior Developer' },
    },
    {
      key: 'company',
      label: { pt: 'Empresa', en: 'Company' },
      value: { pt: 'AsA Sistemas', en: 'AsA Sistemas' },
    },
    {
      key: 'education',
      label: { pt: 'Formação', en: 'Education' },
      value: { pt: 'ADS — FUNDEC', en: 'CS Tech — FUNDEC' },
    },
    {
      key: 'base',
      label: { pt: 'Base', en: 'Based in' },
      value: { pt: 'Dracena, SP', en: 'Dracena, BR' },
    },
  ],
} as const satisfies Profile

export const githubUser = profile.github.split('/').pop() as string

export const navigation = [
  { id: 'hero', index: '00', label: { pt: 'Início', en: 'Home' } },
  { id: 'about', index: '01', label: { pt: 'Sobre', en: 'About' } },
  { id: 'experience', index: '02', label: { pt: 'Trajetória', en: 'Path' } },
  { id: 'work', index: '03', label: { pt: 'Projetos', en: 'Work' } },
  { id: 'github', index: '04', label: { pt: 'GitHub', en: 'GitHub' } },
  { id: 'contact', index: '05', label: { pt: 'Contato', en: 'Contact' } },
] as const satisfies readonly NavItem[]

export const skillGroups = [
  {
    id: 'frontend',
    label: { pt: 'Frontend', en: 'Frontend' },
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Styled-Components',
      'React Native',
    ],
  },
  {
    id: 'backend',
    label: { pt: 'Backend', en: 'Backend' },
    items: ['Node.js', 'Prisma', 'PostgreSQL', 'MongoDB', 'Firebase', 'REST APIs', 'Zod'],
  },
  {
    id: 'tooling',
    label: { pt: 'Ferramentas', en: 'Tooling' },
    items: ['Git', 'Vite', 'Docker', 'Python', 'Expo', 'Figma'],
  },
] as const satisfies readonly SkillGroup[]

export const contactChannels = [
  {
    id: 'email',
    label: { pt: 'E-mail', en: 'Email' },
    value: profile.email,
    hint: { pt: 'A via mais direta', en: 'The most direct route' },
    href: `mailto:${profile.email}`,
    external: false,
  },
  {
    id: 'linkedin',
    label: { pt: 'LinkedIn', en: 'LinkedIn' },
    value: 'victor-gomes-b067a3266',
    hint: { pt: 'Carreira e networking', en: 'Career and networking' },
    href: profile.linkedin,
    external: true,
  },
  {
    id: 'github',
    label: { pt: 'GitHub', en: 'GitHub' },
    value: githubUser,
    hint: { pt: 'Código e projetos', en: 'Code and projects' },
    href: profile.github,
    external: true,
  },
  {
    id: 'phone',
    label: { pt: 'Telefone', en: 'Phone' },
    value: profile.phone.display,
    hint: { pt: 'WhatsApp e chamadas', en: 'WhatsApp and calls' },
    href: profile.phone.href,
    external: false,
  },
] as const satisfies readonly ContactChannel[]
