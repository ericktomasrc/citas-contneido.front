import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@pages/home/HomePage';
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { VerificarEmailPage } from '@pages/auth/VerificarEmailPage';
import { SeleccionarTipoUsuarioPage } from '@pages/auth/SeleccionarTipoUsuarioPage';
import { CompletarRegistroPage } from '@pages/auth/CompletarRegistroPage'; // ✅ NUEVO
import { ROUTES } from '@shared/config/constants';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path="/verificar-email" element={<VerificarEmailPage />} />
        <Route path="/seleccionar-tipo-usuario" element={<SeleccionarTipoUsuarioPage />} />
        <Route path="/completar-registro" element={<CompletarRegistroPage />} /> {/* ✅ NUEVO */}
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};