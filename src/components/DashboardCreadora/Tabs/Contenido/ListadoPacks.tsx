// src/components/DashboardCreadora/Tabs/Contenido/ListadoPacks.tsx
import { Pack } from './types';
import { TarjetaPack } from './TarjetaPack';

interface ListadoPacksProps {
  packs: Pack[];
  onTogglePack: (packId: string) => void;
  onEditarPack: (pack: Pack) => void;
  onEliminarPack: (packId: string) => void;
}

export const ListadoPacks = ({
  packs,
  onTogglePack,
  onEditarPack,
  onEliminarPack,
}: ListadoPacksProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packs.map((pack) => (
        <TarjetaPack
          key={pack.id}
          pack={pack}
          onToggle={() => onTogglePack(pack.id)}
          onEditar={() => onEditarPack(pack)}
          onEliminar={() => onEliminarPack(pack.id)}
        />
      ))}
    </div>
  );
};
