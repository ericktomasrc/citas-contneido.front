import { useEffect } from 'react';
import { AppProviders } from '@app/providers';
import { AppRouter } from '@app/router';
import { useAuthStore } from '@features/auth/model/authStore';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  // Inicializar auth al cargar la app
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;