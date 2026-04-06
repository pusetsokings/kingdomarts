import { createRoot } from 'react-dom/client';
import App from './app/App';
import { AppProvider } from './app/contexts/AppProvider';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
