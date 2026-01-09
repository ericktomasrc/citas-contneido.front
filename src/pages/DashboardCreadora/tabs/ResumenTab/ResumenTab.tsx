import { StatsCards } from '../../../../components/DashboardCreadora/StatsCards/StatsCards';
import { WelcomeHeader } from './components/WelcomeHeader';
import { ActividadReciente } from './components/ActividadReciente';
import { ProximosLives } from './components/ProximosLives';

interface ResumenTabProps {
  nombreUsuario: string;
  gananciasMes: number;
}

export const ResumenTab = ({ nombreUsuario, gananciasMes }: ResumenTabProps) => {
  return (
    <>
      <WelcomeHeader 
        nombreUsuario={nombreUsuario}
        gananciasMes={gananciasMes}
      />

      <StatsCards />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActividadReciente />
        <ProximosLives />
      </div>
    </>
  );
};
