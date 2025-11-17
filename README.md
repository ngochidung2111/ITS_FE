

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

* @vitejs/plugin-react uses Babel (or oxc when used in rolldown-vite) for Fast Refresh
* @vitejs/plugin-react-swc uses SWC for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see the official documentation.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also install eslint-plugin-react-x and eslint-plugin-react-dom for React-specific lint rules:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
# Cấu trúc Project ReactJS + Vite + TailwindCSS

```
its/
│
├── node_modules/
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/               # Chứa hình ảnh, icon, fonts...
│   │   └── react.svg
│   │
│   ├── components/           # Chứa các component UI
│   │   └── Header.tsx
│   │
│   ├── pages/                # Chứa các page (Home, Login, About...)
│   │   └── Home.tsx
│   │
│   ├── layouts/              # Layouts chung (MainLayout, AdminLayout...)
│   │   └── MainLayout.tsx
│   │
│   ├── hooks/                # Custom hooks (useAuth, useFetch...)
│   │
│   ├── context/              # Context API (AuthContext,...)
│   │
│   ├── utils/                # Helper functions
│   │   └── request.ts
│   │
│   ├── types/                # lưu các type (kiểu dữ liệu)
│   │   └── user.d.ts
│   ├── App.jsx               # App root
│   ├── main.jsx              # Điểm vào ứng dụng (entry point)
│   └── index.css             # Tailwind import
│
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```