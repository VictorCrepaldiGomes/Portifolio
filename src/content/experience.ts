import type { TimelineEntry } from './types'

export const timeline: readonly TimelineEntry[] = [
  {
    id: 'asa-dev',
    kind: 'work',
    role: { pt: 'Desenvolvedor Júnior', en: 'Junior Developer' },
    organization: 'AsA Sistemas de Computação',
    period: { pt: 'Mai 2025 — Presente', en: 'May 2025 — Present' },
    start: '2025-05',
    current: true,
    description: {
      pt: 'Desenvolvimento de interfaces web com React, TypeScript e Styled-Components. Atuação em projetos internos com foco em qualidade de código, consistência visual e experiência do usuário.',
      en: 'Building web interfaces with React, TypeScript and Styled-Components. Working on internal products with a focus on code quality, visual consistency and user experience.',
    },
    stack: ['React', 'TypeScript', 'Styled-Components'],
  },
  {
    id: 'asa-support',
    kind: 'work',
    role: { pt: 'Analista de Suporte Técnico', en: 'Technical Support Analyst' },
    organization: 'AsA Sistemas de Computação',
    period: { pt: 'Ago 2024 — Mai 2025', en: 'Aug 2024 — May 2025' },
    start: '2024-08',
    description: {
      pt: 'Suporte técnico a clientes, análise e resolução de problemas em sistemas em produção, documentação de processos e atendimento em campo.',
      en: 'Customer-facing technical support, diagnosing and resolving issues in production systems, documenting processes and handling on-site service.',
    },
    stack: ['ERP', 'SQL', 'Troubleshooting'],
  },
  {
    id: 'tob',
    kind: 'work',
    role: { pt: 'Técnico', en: 'Technician' },
    organization: 'TOB Distribuição',
    period: { pt: 'Jun 2024 — Ago 2024', en: 'Jun 2024 — Aug 2024' },
    start: '2024-06',
    description: {
      pt: 'Atuação na área técnica com manutenção e suporte aos sistemas internos da distribuidora.',
      en: 'Technical work maintaining and supporting the distributor’s internal systems.',
    },
    stack: ['Hardware', 'Suporte'],
  },
  {
    id: 'fundec-intern',
    kind: 'work',
    role: { pt: 'Estagiário', en: 'Intern' },
    organization: 'FUNDEC',
    period: { pt: 'Abr 2024', en: 'Apr 2024' },
    start: '2024-04',
    description: {
      pt: 'Estágio curricular com atuação em projetos acadêmicos e apoio ao departamento de TI da instituição.',
      en: 'Curricular internship working on academic projects and supporting the institution’s IT department.',
    },
    stack: ['TI', 'Suporte'],
  },
  {
    id: 'fundec-degree',
    kind: 'education',
    role: {
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
    },
    organization: 'FUNDEC',
    period: { pt: '2022 — 2024', en: '2022 — 2024' },
    start: '2022-01',
    description: {
      pt: 'Formação superior com foco em desenvolvimento web, banco de dados e fundamentos de engenharia de software.',
      en: 'Higher education focused on web development, databases and software engineering fundamentals.',
    },
    stack: ['Web', 'Banco de Dados', 'Engenharia de Software'],
  },
]
