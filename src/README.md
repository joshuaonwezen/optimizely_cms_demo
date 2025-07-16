# Optimizely CMS Demo - Code Structure

This demo showcases Optimizely CMS and Feature Experimentation integration.

## 📁 Folder Structure

```
src/
├── components/
│   ├── content/         # CMS content components (City, Experience, etc.)
│   ├── layout/          # Header, Footer, navigation
│   ├── ui/              # Reusable UI components (modals, loaders)
│   └── icons/           # Icon components
├── lib/
│   ├── apollo.ts        # GraphQL client configuration
│   ├── cms.ts           # CMS integration helpers
│   └── optimizely.ts    # Feature Experimentation setup
├── hooks/               # Custom React hooks
├── queries/             # GraphQL queries
├── utils/               # Pure utility functions
├── pages/               # Next.js pages
└── styles/              # CSS files
```

## 🎯 Key Demo Features

- **CMS Integration**: Visual Builder, content editing
- **Feature Experimentation**: A/B testing, feature flags
- **Search**: Optimizely Graph search with ranking experiments
- **Performance**: Skeleton loading, caching

## 🚀 Quick Start

1. Set up environment variables in `.env`
2. Run `npm run dev`
3. Navigate to different URLs to see various features