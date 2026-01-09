# 🎯 Quick Reference - Cheatsheet

## 📁 Dónde está cada cosa

```
🔍 Necesito...                          📂 Lo encuentro en...
─────────────────────────────────────────────────────────────────
Página principal                       → DashboardCreadoraPage.tsx
Lógica de infinite scroll              → hooks/useInfiniteScroll.ts
Manejo de tabs                         → hooks/useTabs.ts
Tarjeta de invitación                  → components/InvitacionCard.tsx
Grid con scroll infinito               → components/InvitacionesGrid.tsx
Estado vacío                           → components/InvitacionesEmpty.tsx
Header de subtabs (reutilizable)       → components/SubTabsHeader.tsx
Tab de invitaciones                    → tabs/InvitacionesTab/
Tab de resumen                         → tabs/ResumenTab/
Tipos de TypeScript                    → types/invitaciones.types.ts
Datos mock                             → data/invitaciones.data.ts
Configuración de subtabs               → config/subtabs.config.ts
```

## 🔧 Comandos Comunes

### Agregar Nuevo Tab

```typescript
// 1. En hooks/useTabs.ts
export type TabType = 'resumen' | 'nuevo-tab' | ...

// 2. Crear tabs/NuevoTab/NuevoTab.tsx
export const NuevoTab = () => { ... }

// 3. En DashboardCreadoraPage.tsx
import { NuevoTab } from './tabs/NuevoTab/NuevoTab';
{activeTab === 'nuevo-tab' && <NuevoTab />}
```

### Agregar Nuevo SubTab

```typescript
// 1. En config/subtabs.config.ts
{ id: 'nuevo', label: 'Nuevo', icon: Star }

// 2. En hooks/useTabs.ts
export type SubTabType = 'invitaciones' | 'nuevo' | ...

// 3. En DashboardCreadoraPage.tsx
{activeSubTab === 'nuevo' && <NuevoSubTab />}
```

### Reutilizar Infinite Scroll

```typescript
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const { items, isLoading, hasMore, observerTarget } = useInfiniteScroll({
  initialData: misItems,
  enabled: true,
});

return (
  <>
    {items.map(item => <div key={item.id}>{item.name}</div>)}
    <div ref={observerTarget} />
  </>
);
```

## 🎨 Patrones de Código

### Componente con Props

```typescript
interface MiComponenteProps {
  titulo: string;
  onClick: () => void;
}

export const MiComponente = ({ titulo, onClick }: MiComponenteProps) => {
  return <button onClick={onClick}>{titulo}</button>;
};
```

### Hook Personalizado

```typescript
export const useMiHook = (param: string) => {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // lógica
  }, [param]);
  
  return { state, setState };
};
```

### Tab con SubTabs

```typescript
export const MiTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('sub1');
  
  return (
    <>
      <SubTabsHeader 
        tabs={misTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      {activeSubTab === 'sub1' && <SubTab1 />}
      {activeSubTab === 'sub2' && <SubTab2 />}
    </>
  );
};
```

## 🔍 Búsquedas Rápidas

```bash
# Encontrar todos los componentes
find . -name "*.tsx" -path "*/components/*"

# Encontrar todos los hooks
find . -name "*.ts" -path "*/hooks/*"

# Encontrar todos los tabs
find . -name "*.tsx" -path "*/tabs/*"

# Buscar uso de un hook
grep -r "useInfiniteScroll" .

# Buscar imports de un componente
grep -r "InvitacionCard" .
```

## 📊 Métricas Importantes

```
Archivo Principal:        ~150 líneas (era ~500)
Componente Promedio:      ~80 líneas
Hook Promedio:            ~70 líneas
Total Archivos:           18 (era 1)
Nivel de Acoplamiento:    Bajo ✅
Testeable:                100% ✅
Reutilizable:             100% ✅
```

## 🚨 Red Flags a Evitar

❌ Archivos de más de 300 líneas
❌ Componentes con más de 5 props
❌ Lógica de negocio en componentes
❌ Duplicación de código
❌ Imports circulares
❌ Props drilling (más de 3 niveles)

## ✅ Best Practices

✅ Un componente = una responsabilidad
✅ Hooks para lógica reutilizable
✅ Props con interfaces tipadas
✅ Nombres descriptivos
✅ Componentes pequeños (<100 líneas)
✅ Documentar código complejo

## 🎯 Estructura Ideal de Archivo

```typescript
// 1. Imports
import { useState } from 'react';
import { MiTipo } from '../types';

// 2. Interfaces
interface MiComponenteProps {
  // ...
}

// 3. Component
export const MiComponente = (props: MiComponenteProps) => {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => {};
  
  // 3.3 Effects (si hay)
  useEffect(() => {}, []);
  
  // 3.4 Render
  return <div>{/* JSX */}</div>;
};
```

## 📝 Convenciones de Nombres

```typescript
// Componentes: PascalCase
export const MiComponente = () => {}

// Hooks: camelCase con prefijo "use"
export const useMiHook = () => {}

// Archivos de componentes: PascalCase.tsx
MiComponente.tsx

// Archivos de hooks: camelCase.ts
useMiHook.ts

// Tipos: PascalCase
interface MiTipo {}
type MiTipo = {}

// Props: ComponenteNameProps
interface MiComponenteProps {}

// Constantes: UPPER_SNAKE_CASE
const API_URL = 'https://...'

// Variables/funciones: camelCase
const miVariable = 123;
const miFuncion = () => {};
```

## 🔄 Flujo de Datos

```
Usuario interactúa
    ↓
Handler en Component
    ↓
Update State (useState/useReducer)
    ↓
Re-render Component
    ↓
Props pasan a Children
    ↓
Children se renderizan
```

## 💡 Tips Útiles

**Debugging:**
```typescript
console.log('🔍 Estado:', state);
console.log('📍 Props recibidas:', props);
```

**React DevTools:**
- Components tab → Ver árbol de componentes
- Profiler tab → Medir rendimiento

**VSCode:**
- `Ctrl+P` → Buscar archivo rápido
- `Ctrl+Shift+F` → Buscar en todos los archivos
- `F12` → Ir a definición

## 🎯 Checklist de Calidad

Antes de commitear, verifica:

- [ ] Sin errores de TypeScript
- [ ] Sin warnings en consola
- [ ] Componentes < 150 líneas
- [ ] Props tipadas correctamente
- [ ] Nombres descriptivos
- [ ] Sin código duplicado
- [ ] Funciona en mobile
- [ ] No hay console.logs olvidados

## 🚀 Recursos Adicionales

**Docs Completas:**
- `docs/README-ESTRUCTURA.md` → Arquitectura
- `docs/GUIA-MIGRACION.md` → Implementación
- `docs/COMPARACION-ANTES-DESPUES.md` → Mejoras
- `docs/EJEMPLOS-CODIGO.md` → Casos de uso

**Online:**
- React Docs: https://react.dev
- TypeScript Docs: https://typescriptlang.org
- TailwindCSS: https://tailwindcss.com

---

💡 **Pro Tip:** Imprime este cheatsheet y tenlo a mano mientras codeas!
