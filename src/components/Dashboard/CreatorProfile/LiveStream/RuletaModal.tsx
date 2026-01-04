import RuletaCreadoraModal from './RuletaCreadoraModal';
import RuletaEspectadorModal from './RuletaEspectadorModal';
import { PremioRuleta } from '../../../../shared/types/ruleta.types';

interface RuletaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCreadora: boolean;
  channelName: string;
  
  // Props para creadora
  onActivarRuleta?: (costoGiro: number, premios: PremioRuleta[]) => void;
  onDesactivarRuleta?: () => void;
  ruletaActiva?: boolean;
  
  // Props para espectador
  onGirar?: () => void;
  costoGiro?: number;
  premioGanado?: PremioRuleta | null;
  girando?: boolean;
  premiosDisponibles?: PremioRuleta[];
  usuarioGirando?: string | null;
  currentUserName?: string;
  coinsBalance?: number;
  onRecargarCoins?: () => void;
}

export default function RuletaModal({
  isOpen,
  onClose,
  isCreadora,
  channelName,
  onActivarRuleta,
  onDesactivarRuleta,
  ruletaActiva,
  onGirar,
  costoGiro,
  premioGanado,
  girando,
  premiosDisponibles,
  usuarioGirando,
  currentUserName,
  coinsBalance,
  onRecargarCoins
}: RuletaModalProps) {
  
  // Si es creadora, mostrar modal de creadora
  if (isCreadora) {
    return (
      <RuletaCreadoraModal
        isOpen={isOpen}
        onClose={onClose}
        channelName={channelName}
        onActivarRuleta={onActivarRuleta}
        onDesactivarRuleta={onDesactivarRuleta}
        ruletaActiva={ruletaActiva}
      />
    );
  }
  
  // Si es espectador, mostrar modal de espectador
  return (
    <RuletaEspectadorModal
      isOpen={isOpen}
      onClose={onClose}
      channelName={channelName}
      onGirar={onGirar}
      costoGiro={costoGiro}
      premioGanado={premioGanado}
      girando={girando}
      premiosDisponibles={premiosDisponibles}
      usuarioGirando={usuarioGirando}
      currentUserName={currentUserName}
      coinsBalance={coinsBalance}
      onRecargarCoins={onRecargarCoins}
    />
  );
}
