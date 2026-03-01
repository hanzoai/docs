/**
 * Blog post registry.
 * Slug must match the MDX filename in content/blog/.
 */
export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  date: string
  tags: string[]
}

export const posts: BlogPost[] = [
  {
    slug: 'zen5-release',
    title: 'Introducing Zen 5 — Our Most Capable Model Yet',
    description:
      'Zen 5 brings 1T+ parameter scale, 2M context windows, and state-of-the-art performance across reasoning, code, and multimodal tasks.',
    author: 'Zen LM Team',
    date: '2026-03-01',
    tags: ['release', 'zen5', 'flagship'],
  },
  {
    slug: 'zen-mode-architecture',
    title: 'Zen MoDE — How We Build Frontier Models Through Distillation',
    description:
      'An inside look at the Mixture of Distilled Experts architecture that powers the Zen model family.',
    author: 'Zen LM Team',
    date: '2026-02-15',
    tags: ['architecture', 'research', 'distillation'],
  },
  {
    slug: 'open-weights-philosophy',
    title: 'Why We Open-Source Everything',
    description:
      'The case for radical openness in AI — why releasing weights is the right thing, strategically and ethically.',
    author: 'Zen LM Team',
    date: '2026-01-20',
    tags: ['open-source', 'philosophy', 'community'],
  },
]

export function getSortedPosts(): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
