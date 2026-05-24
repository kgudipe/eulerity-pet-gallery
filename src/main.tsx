import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DownloadManagerProvider } from './context/DownloadManagerContext';
import { PetsProvider } from './context/PetsContext';
import { SelectionProvider } from './context/SelectionContext';
import { GlobalStyles } from './styles/GlobalStyles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PetsProvider>
        <SelectionProvider>
          <DownloadManagerProvider>
            <GlobalStyles />
            <App />
          </DownloadManagerProvider>
        </SelectionProvider>
      </PetsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
