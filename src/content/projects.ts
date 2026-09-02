import type { Project } from './types'

export const projects: readonly Project[] = [
  {
    slug: 'pizzashop',
    title: 'PizzaShop',
    year: '2025',
    category: 'web',
    featured: true,
    repo: 'MyPizza-RocketSeat',
    summary: {
      pt: 'Sistema de gestão para pizzaria: pedidos, cozinha e métricas.',
      en: 'Management system for a pizzeria: orders, kitchen and metrics.',
    },
    description: {
      pt: 'Projeto full stack com dashboard de métricas, fluxo de pedidos, organização da cozinha e controle de produtos e categorias. O pedido é tratado como máquina de estados, com atualização em tempo real no painel.',
      en: 'Full stack project with a metrics dashboard, order flow, kitchen organisation and product/category management. Orders are modelled as a state machine, with live updates on the panel.',
    },
    highlights: {
      pt: [
        'Dashboard com receita, pedidos e cancelamentos',
        'Pedido modelado como máquina de estados',
        'API em Node.js com Prisma e PostgreSQL',
      ],
      en: [
        'Dashboard with revenue, orders and cancellations',
        'Orders modelled as a state machine',
        'Node.js API with Prisma and PostgreSQL',
      ],
    },
    stack: ['React', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL', 'shadcn/ui'],
  },
  {
    slug: 'ignite-call',
    title: 'Ignite Call',
    year: '2025',
    category: 'web',
    featured: true,
    repo: 'Ignite-Call-Rocketseat',
    summary: {
      pt: 'Agendamento integrado ao Google Calendar com OAuth.',
      en: 'Scheduling app integrated with Google Calendar through OAuth.',
    },
    description: {
      pt: 'O usuário conecta a conta Google, define a disponibilidade por dia da semana e recebe agendamentos por um link público. Os eventos são criados direto no Google Calendar.',
      en: 'The user connects their Google account, sets weekly availability and receives bookings through a public link. Events are created straight in Google Calendar.',
    },
    highlights: {
      pt: [
        'OAuth com Google e escrita no Google Calendar',
        'Disponibilidade por intervalo, validada com Zod',
        'Onboarding em etapas com estado persistido',
      ],
      en: [
        'Google OAuth with Google Calendar writes',
        'Interval-based availability validated with Zod',
        'Multi-step onboarding with persisted state',
      ],
    },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Google APIs', 'Zod'],
  },
  {
    slug: 'target',
    title: 'Target',
    year: '2025',
    category: 'mobile',
    featured: true,
    repo: 'Mobile-TargetRocketseat',
    summary: {
      pt: 'App de metas financeiras com SQLite local.',
      en: 'Financial goals app with local SQLite.',
    },
    description: {
      pt: 'App React Native para criar metas de economia e acompanhar o progresso com depósitos e resgates. Os dados ficam em SQLite no aparelho, então funciona offline.',
      en: 'React Native app for creating savings goals and tracking progress with deposits and withdrawals. Data lives in on-device SQLite, so it works offline.',
    },
    highlights: {
      pt: [
        'Persistência local com SQLite',
        'Resumo de total guardado, entradas e saídas',
        'Progresso por meta atualizado a cada transação',
      ],
      en: [
        'Local SQLite persistence',
        'Summary of total saved, deposits and withdrawals',
        'Per-goal progress updated on every transaction',
      ],
    },
    stack: ['React Native', 'Expo', 'TypeScript', 'SQLite'],
  },
  {
    slug: 'dt-money',
    title: 'DT Money',
    year: '2025',
    category: 'web',
    featured: true,
    repo: 'DTMoney-Rocketseat',
    summary: {
      pt: 'Controle financeiro com busca e filtro de transações.',
      en: 'Finance tracker with transaction search and filtering.',
    },
    description: {
      pt: 'Cadastro de entradas e saídas, busca por descrição e listagem com valores formatados. Usei contextos separados para evitar re-render da árvore inteira a cada digitação na busca.',
      en: 'Income and expense entry, search by description and a formatted transaction list. I split the contexts to avoid re-rendering the whole tree on every keystroke in the search.',
    },
    highlights: {
      pt: [
        'Entradas e saídas validadas com Zod',
        'Busca e filtro por descrição',
        'Tema dark com Styled-Components',
      ],
      en: [
        'Income and expenses validated with Zod',
        'Search and filter by description',
        'Dark theme with Styled-Components',
      ],
    },
    stack: ['React', 'TypeScript', 'Vite', 'Styled-Components', 'Zod', 'Axios'],
  },
  {
    slug: 'price-watcher',
    title: 'Price Watcher',
    year: '2025',
    category: 'automation',
    featured: true,
    repo: 'WebScraping',
    summary: {
      pt: 'Monitor de preços em Python com Selenium e BeautifulSoup.',
      en: 'Price monitor in Python with Selenium and BeautifulSoup.',
    },
    description: {
      pt: 'Script que abre a página do produto, extrai o preço e guarda o histórico em JSON, rodando de forma contínua. Foi onde aprendi a lidar com elemento que carrega tarde e layout que muda.',
      en: 'A script that opens the product page, extracts the price and stores history as JSON, running continuously. This is where I learned to deal with late-loading elements and changing layouts.',
    },
    highlights: {
      pt: [
        'Navegação automatizada com Selenium',
        'Extração com BeautifulSoup e histórico em JSON',
        'Execução contínua para acompanhar variação',
      ],
      en: [
        'Automated navigation with Selenium',
        'Parsing with BeautifulSoup and JSON history',
        'Continuous execution to track price changes',
      ],
    },
    stack: ['Python', 'Selenium', 'BeautifulSoup', 'JSON'],
  },
  {
    slug: 'comprar',
    title: 'Comprar',
    year: '2025',
    category: 'mobile',
    featured: true,
    repo: 'Mobile-ComprarRocketseat',
    summary: {
      pt: 'Lista de compras em React Native com persistência local.',
      en: 'Shopping list in React Native with local persistence.',
    },
    description: {
      pt: 'Lista de compras com itens pendentes e comprados, filtro por status e persistência em AsyncStorage. É um app pequeno, feito para acertar estado e toque.',
      en: 'Shopping list with pending and purchased items, status filtering and AsyncStorage persistence. A small app, built to get state and touch right.',
    },
    highlights: {
      pt: ['Filtro entre pendentes e comprados', 'Persistência com AsyncStorage'],
      en: ['Filter between pending and purchased', 'Persistence with AsyncStorage'],
    },
    stack: ['React Native', 'TypeScript', 'AsyncStorage'],
  },
  {
    slug: 'todo-list',
    title: 'ToDo List',
    year: '2025',
    category: 'web',
    featured: false,
    repo: 'ToDoList-Rocketseat',
    summary: {
      pt: 'Lista de tarefas em React + TypeScript.',
      en: 'Task list in React + TypeScript.',
    },
    description: {
      pt: 'Lista de tarefas com React, TypeScript e Vite, com ESLint configurado do zero. O exercício foi tipar o estado direito, sem nenhum any.',
      en: 'Task list with React, TypeScript and Vite, with ESLint set up from scratch. The exercise was typing state properly, with no any.',
    },
    highlights: {
      pt: ['Estado totalmente tipado', 'ESLint configurado do zero'],
      en: ['Fully typed state', 'ESLint configured from scratch'],
    },
    stack: ['React', 'TypeScript', 'Vite', 'ESLint'],
  },
  {
    slug: 'organo',
    title: 'Organo',
    year: '2025',
    category: 'web',
    featured: false,
    repo: 'organo-Alura',
    summary: {
      pt: 'Cadastro de colaboradores com componentes reutilizáveis.',
      en: 'Team registry built on reusable components.',
    },
    description: {
      pt: 'Cadastro de pessoas em times, com navegação entre páginas. Foi o projeto onde composição de componentes e estado no componente pai finalmente fizeram sentido.',
      en: 'Registering people into teams, with routing between pages. This is where component composition and lifting state finally made sense.',
    },
    highlights: {
      pt: ['Componentes reutilizáveis', 'Navegação com React Router'],
      en: ['Reusable components', 'Routing with React Router'],
    },
    stack: ['React', 'JavaScript', 'React Router'],
  },
  {
    slug: 'portfolio',
    title: 'Este portfólio',
    year: '2026',
    category: 'web',
    featured: false,
    repo: 'Portifolio',
    demo: 'https://www.victorgomes.dev.br',
    summary: {
      pt: 'O site que você está lendo agora.',
      en: 'The site you are reading right now.',
    },
    description: {
      pt: 'React 19, Vite e Tailwind v4, tudo em JetBrains Mono, monocromático com um azul. Idioma e filtros ficam na URL, os dados do GitHub são buscados no build, e tem um Snake escondido.',
      en: 'React 19, Vite and Tailwind v4, all in JetBrains Mono, monochrome with one blue. Language and filters live in the URL, GitHub data is fetched at build time, and there is a hidden Snake.',
    },
    highlights: {
      pt: [
        'Estado de UI na URL com nuqs',
        'Dados do GitHub no build, com revalidação no cliente',
        'Contraste validado em WCAG AA nos dois temas',
      ],
      en: [
        'UI state in the URL with nuqs',
        'Build-time GitHub data with client revalidation',
        'Contrast verified against WCAG AA in both themes',
      ],
    },
    stack: ['React 19', 'Vite', 'TypeScript', 'Tailwind v4', 'Motion', 'nuqs'],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const projectCategories = ['web', 'mobile', 'api', 'automation'] as const

export const categoryLabels = {
  web: { pt: 'Web', en: 'Web' },
  mobile: { pt: 'Mobile', en: 'Mobile' },
  api: { pt: 'API', en: 'API' },
  automation: { pt: 'Automação', en: 'Automation' },
} as const
