# Eulerity Pet Gallery

React + TypeScript pet gallery app built for the frontend challenge.

## Tech

- React 18
- TypeScript
- styled-components
- react-router-dom
- Vite

## Run Locally

```bash
source ~/.nvm/nvm.sh
nvm use 22
npm install
npm run dev
```

Build for production:

```bash
source ~/.nvm/nvm.sh
nvm use 22
npm run build
```

## Implemented Requirements

- Fetch pets with `fetch('/pets')`
- Custom hook with explicit loading/error/empty states
- Search by title/description
- Sort: name A-Z, name Z-A, newest, oldest
- Multi-select, select all, clear selection
- Selection count + estimated total file size
- Download selected images
- Dynamic pet details route: `/pets/:id`
- About page + not-found page
- Global selection state persisted across route navigation
- Responsive gallery: 1 column mobile, 2 tablet, 4 desktop
- Pagination for gallery items

