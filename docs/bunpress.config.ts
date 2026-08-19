import type { BunPressConfig } from '@stacksjs/bunpress'

const config: BunPressConfig = {
  title: 'ts-inputs',
  description: 'Modern & lightweight input masking for TypeScript',
  url: 'https://ts-inputs.stacksjs.org',

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/stacksjs/ts-inputs' },
      { icon: 'discord', link: 'https://discord.gg/stacksjs' },
      { icon: 'twitter', link: 'https://twitter.com/stacksjs' },
    ],
    colors: {
      primary: '#10b981',
    },
  },

  sidebar: [
    {
      text: 'Introduction',
      link: '/',
    },
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Mask Patterns', link: '/guide/masks' },
        { text: 'Vue Components', link: '/guide/vue' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Phone Numbers', link: '/features/phone' },
        { text: 'Credit Cards', link: '/features/credit-cards' },
        { text: 'Date Masks', link: '/features/dates' },
        { text: 'Currency Input', link: '/features/currency' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Custom Masks', link: '/advanced/custom-masks' },
        { text: 'Dynamic Masks', link: '/advanced/dynamic' },
        { text: 'Validation Integration', link: '/advanced/validation' },
        { text: 'React Support', link: '/advanced/react' },
      ],
    },
  ],

  nav: [
    { text: 'Home', link: '/' },
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-inputs' },
  ],

}

export default config
