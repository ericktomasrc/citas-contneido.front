# Estructura Refactorizada del Dashboard Creadora

## 📁 Estructura de Carpetas

```
src/
├── pages/
│   └── DashboardCreadora/
│       ├── DashboardCreadoraPage.tsx          # Página principal (solo layout)
│       │
│       ├── tabs/                              # Tabs principales
│       │   ├── InvitacionesTab/
│       │   │   └── InvitacionesTab.tsx       # Tab de invitaciones con lógica
│       │   │
│       │   └── ResumenTab/
│       │       ├── ResumenTab.tsx             # Tab de resumen
│       │       └── components/                # Componentes del resumen
│       │           ├── WelcomeHeader.tsx
│       │           ├── ActividadReciente.tsx
│       │           └── ProximosLives.tsx
│       │
│       ├── components/                        # Componentes compartidos
│       │   ├── InvitacionCard.tsx            # Tarjeta individual
│       │   ├── InvitacionesGrid.tsx          # Grid con infinite scroll
│       │   ├── InvitacionesEmpty.tsx         # Estado vacío
│       │   ├── SubTabsHeader.tsx             # Header de subtabs reutilizable
│       │   └── PageHeader.tsx                # Header de página simple
│       │
│       ├── hooks/                             # Hooks personalizados
│       │   ├── useInfiniteScroll.ts          # Lógica de infinite scroll
│       │   └── useTabs.ts                     # Lógica de tabs y URL
│       │
│       ├── types/                             # TypeScript types
│       │   └── invitaciones.types.ts
│       │
│       ├── data/                              # Datos mock
│       │   └── invitaciones.data.ts
│       │
│       └── config/                            # Configuración
│           └── subtabs.config.ts
```

## 🎯 Ventajas de esta Estructura

### 1. **Separación de Responsabilidades**
- Cada componente tiene una única responsabilidad
- La lógica está separada de la presentación
- Los hooks encapsulan comportamientos reutilizables

### 2. **Reutilización**
- `SubTabsHeader` puede usarse en otras páginas
- `useInfiniteScroll` puede usarse para otras listas
- `InvitacionCard` es independiente y testeable

### 3. **Mantenibilidad**
- Fácil encontrar y modificar código específico
- Menos conflictos en Git al trabajar en equipo
- Cambios localizados no afectan otras partes

### 4. **Escalabilidad**
- Fácil agregar nuevos tabs o subtabs
- Simple extender funcionalidad sin tocar código existente
- Estructura clara para nuevos desarrolladores

## 📝 Cómo Usar

### Agregar un Nuevo Tab

1. Crear carpeta en `tabs/`:
```typescript
// tabs/MensajesTab/MensajesTab.tsx
export const MensajesTab = () => {
  return <div>Contenido de mensajes</div>;
};
```

2. Importar en `DashboardCreadoraPage.tsx`:
```typescript
import { MensajesTab } from './tabs/MensajesTab/MensajesTab';

// En el render:
{activeTab === 'mensajes' && <MensajesTab />}
```

### Agregar un Nuevo SubTab

1. Actualizar `config/subtabs.config.ts`:
```typescript
export const subTabsConfig: SubTab[] = [
  // ... existentes
  { id: 'nuevo', label: 'Nuevo Tab', icon: Star },
];
```

2. Agregar en `hooks/useTabs.ts`:
```typescript
export type SubTabType = 'invitaciones' | 'resumen' | 'miactividad' | 'nuevo';
```

3. Renderizar en `DashboardCreadoraPage.tsx`:
```typescript
{activeSubTab === 'nuevo' && <NuevoTab />}
```

### Usar el Hook de Infinite Scroll en Otro Lugar

```typescript
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

const MiComponente = () => {
  const { items, isLoading, hasMore, observerTarget } = useInfiniteScroll({
    initialData: misItems,
    enabled: true,
  });

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <div ref={observerTarget} />
    </div>
  );
};
```

## 🔧 Próximos Pasos

1. **Mover datos mock a API real**
   - Reemplazar `invitaciones.data.ts` con llamadas a backend
   - Actualizar `useInfiniteScroll` para usar endpoints reales

2. **Agregar Context API**
   - Crear `UserContext` para datos del usuario actual
   - Evitar prop drilling

3. **Tests Unitarios**
   - Testear hooks independientemente
   - Tests de componentes individuales

4. **Optimizaciones**
   - React.memo para componentes costosos
   - useMemo/useCallback donde sea necesario

## 📦 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `DashboardCreadoraPage.tsx` | Layout principal, orquesta todo |
| `useTabs.ts` | Manejo de estado de tabs y URL |
| `useInfiniteScroll.ts` | Lógica de infinite scroll reutilizable |
| `InvitacionesTab.tsx` | Lógica del tab de invitaciones |
| `InvitacionCard.tsx` | Presentación de invitación individual |
| `SubTabsHeader.tsx` | Header reutilizable de subtabs |

## 🚀 Migración desde Código Antiguo

1. Copiar archivos nuevos a tu proyecto
2. Actualizar imports en componentes existentes
3. Reemplazar `DashboardCreadoraPage.tsx` antiguo
4. Verificar que rutas funcionen correctamente
5. Eliminar código duplicado
