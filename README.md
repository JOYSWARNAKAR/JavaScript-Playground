# JavaScript Playground

- Built a browser-based JavaScript code editor and execution environment using React and Web Workers.
## Features

- JavaScript editing with Monaco
- Run code with the **Run** button or **Ctrl/⌘ + Enter**
- View console output, errors, and execution status
- Stop execution, clear output, and isolate code in a Web Worker
- Responsive interface styled with Tailwind CSS v4

## Dependencies

- React and React DOM
- Monaco Editor (`@monaco-editor/react`)
- Vite and the React plugin
- Tailwind CSS v4 with its Vite plugin
- Oxlint

## Project structure

```text
src/
├── assets/             Static assets
├── components/         Code editor and console UI
├── hooks/              JavaScript execution hook
├── lib/                Console value formatting
├── workers/            Isolated JavaScript worker
├── App.jsx             Main application
├── index.css           Tailwind CSS entry
└── main.jsx            Application entry point
index.html
vite.config.js
package.json
```

## Getting started

```sh
npm install
npm run dev
```

Press **Run** or **Ctrl/⌘ + Enter** to execute code.

## Available commands

```sh
npm run dev
npm run build
npm run preview
npm run lint
```
