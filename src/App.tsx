import { useEffect } from 'react';
import { AppProviders } from '@app/providers';
import { AppRouter } from '@app/router';
import { useAuthStore } from '@features/auth/model/authStore';
import { TransmisionProvider } from './contexts/TransmisionContext'; // ✅ NUEVO 

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  // Inicializar auth al cargar la app
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AppProviders>
      <TransmisionProvider> {/* ✅ NUEVO - Envuelve todo */}
        <AppRouter />
         
      </TransmisionProvider>
    </AppProviders>
  );
}

export default App;