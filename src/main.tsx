import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PetsProvider } from './context/PetsContext';
import { SelectionProvider } from './context/SelectionContext';
import { GlobalStyles } from './styles/GlobalStyles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PetsProvider>
        <SelectionProvider>
          <GlobalStyles />
          <App />
        </SelectionProvider>
      </PetsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
