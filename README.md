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
- Queued download manager with progress, retry, and cancel controls
- Download selected images as ZIP export
- Accessibility pass: skip link, keyboard-first popover flow, visible focus states, and aria-live status messaging
- Dynamic pet details route: `/pets/:id`
- About page + not-found page
- Global selection state persisted across route navigation
- Responsive gallery: 1 column mobile, 2 tablet, 4 desktop
- Pagination for gallery items

## Extra Feature Branch (Not Merged to `main`)

- Branch: `feature/accessibility-pass`
- Extra feature: WCAG-minded accessibility pass (skip link, stronger focus states, full keyboard-friendly popover flow, better labels, `aria-live` status updates).
- Location:
  - `src/components/Layout.tsx`
  - `src/components/DownloadManagerPanel.tsx`
  - `src/components/GalleryControls.tsx`
  - `src/components/PaginationControls.tsx`
  - `src/components/PetCard.tsx`
  - `src/pages/PetDetailPage.tsx`
  - `src/styles/GlobalStyles.ts`
- Reason not merged to `main`: this is an additional enhancement beyond the original required scope, so it is kept isolated on its own branch.
