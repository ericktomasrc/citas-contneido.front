import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@pages/home/HomePage';
import { LoginPage } from '@pages/auth/LoginPage';
import { VerificarEmailPage } from '@pages/auth/VerificarEmailPage';
import { SeleccionarTipoUsuarioPage } from '@pages/auth/SeleccionarTipoUsuarioPage';
import { CompletarRegistroPage } from '@pages/auth/CompletarRegistroPage';
import { RecuperarPasswordPage } from '@pages/auth/RecuperarPasswordPage';
import { RegisterLoginPage } from '@pages/auth/RegisterLoginPage';
import { DashboardEspectadorPage } from '../../pages/Dashboard/DashboardEspectadorPage'; // ✅ NUEVO
import { ROUTES } from '@shared/config/constants'; 
import { CreatorProfilePageFullscreen } from '@/components/CreatorProfile/CreatorProfilePageFullscreen';
import { LiveStreamPage } from '@/components/CreatorProfile/LiveStream/LiveStreamPage';
import { SubscriptionsPage } from '@/pages/Subscriptions/SubscriptionsPage';
import { InvitationsPage } from '@/pages/Invitaciones/InvitationsPage';
import { SettingsPage } from '@/pages/Settings/SettingsPage'; 

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterLoginPage />} />
        <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
        <Route path="/verificar-email" element={<VerificarEmailPage />} />
        <Route path="/seleccionar-tipo-usuario" element={<SeleccionarTipoUsuarioPage />} />
        <Route path="/completar-registro" element={<CompletarRegistroPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardEspectadorPage />} /> {/*  NUEVO */}
        {/* <Route path="/perfil/:id" element={<CreatorProfilePage />} /> */}
        
        <Route path="/perfil/:slug" element={<CreatorProfilePageFullscreen />} />
        <Route path="/live/:slug" element={<LiveStreamPage />} />

        <Route path="/mis-suscripciones" element={<SubscriptionsPage />} />
        <Route path="/invitaciones" element={<InvitationsPage />} />
         <Route path="/configuracion" element={<SettingsPage />} /> 
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};