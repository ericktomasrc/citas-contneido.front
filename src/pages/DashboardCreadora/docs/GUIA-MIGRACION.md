# Guía de Migración - Paso a Paso

## 🎯 Objetivo
Migrar de un archivo monolítico `DashboardCreadoraPage.tsx` a una estructura modular y organizada.

## 📋 Checklist de Migración

### Fase 1: Preparación (15 min)

- [ ] Crear backup del código actual
- [ ] Crear estructura de carpetas nueva
- [ ] Instalar dependencias si faltan

```bash
# Crear estructura
mkdir -p src/pages/DashboardCreadora/{tabs/{InvitacionesTab,ResumenTab/components},components,hooks,types,data,config}
```

### Fase 2: Mover Tipos y Datos (10 min)

- [ ] Copiar `types/invitaciones.types.ts`
- [ ] Copiar `data/invitaciones.data.ts`
- [ ] Copiar `config/subtabs.config.ts`

### Fase 3: Crear Hooks (15 min)

- [ ] Copiar `hooks/useInfiniteScroll.ts`
- [ ] Copiar `hooks/useTabs.ts`
- [ ] Verificar imports

### Fase 4: Componentes Base (20 min)

- [ ] Copiar `components/InvitacionCard.tsx`
- [ ] Copiar `components/InvitacionesGrid.tsx`
- [ ] Copiar `components/InvitacionesEmpty.tsx`
- [ ] Copiar `components/SubTabsHeader.tsx`
- [ ] Copiar `components/PageHeader.tsx`
- [ ] Verificar imports de lucide-react

### Fase 5: Tabs (20 min)

- [ ] Copiar `tabs/InvitacionesTab/InvitacionesTab.tsx`
- [ ] Copiar `tabs/ResumenTab/ResumenTab.tsx`
- [ ] Copiar `tabs/ResumenTab/components/WelcomeHeader.tsx`
- [ ] Copiar `tabs/ResumenTab/components/ActividadReciente.tsx`
- [ ] Copiar `tabs/ResumenTab/components/ProximosLives.tsx`
- [ ] Ajustar imports de StatsCards

### Fase 6: Página Principal (15 min)

- [ ] Reemplazar `DashboardCreadoraPage.tsx` con la versión refactorizada
- [ ] Actualizar imports
- [ ] Verificar rutas de componentes existentes (Navbar, Sidebar, etc.)

### Fase 7: Testing (20 min)

- [ ] Verificar que la navegación funciona
- [ ] Probar infinite scroll en invitaciones
- [ ] Verificar cambio de tabs
- [ ] Probar URL sync
- [ ] Verificar acciones (aceptar/rechazar)
- [ ] Testing en mobile

### Fase 8: Limpieza (10 min)

- [ ] Eliminar código antiguo no usado
- [ ] Actualizar imports en otros archivos
- [ ] Commit con mensaje descriptivo

## 🔍 Verificaciones Importantes

### Imports a Revisar

```typescript
// Asegúrate que estos imports existan:
import { StatsCards } from '../../components/DashboardCreadora/StatsCards/StatsCards';
import { MiActividadTab } from '../../components/DashboardCreadora/Tabs/Inicio/MiActividadTab';
import { ContenidoPage } from '../DashboardCreadora/ContenidoPage/ContenidoPage';
import { PacksPage } from './PacksPage/PacksPage';
```

### Rutas Relativas

Ajusta las rutas según tu estructura:
```typescript
// Si DashboardCreadoraPage está en:
// src/pages/DashboardCreadora/DashboardCreadoraPage.tsx

// Entonces:
import { useTabs } from './hooks/useTabs';                    // ✅
import { InvitacionesTab } from './tabs/InvitacionesTab/...'  // ✅
```

## 🚨 Problemas Comunes

### 1. Error: "Cannot find module"
**Solución:** Verificar rutas relativas de imports

### 2. Infinite scroll no funciona
**Solución:** Verificar que `enabled` está en `true` cuando el tab está activo

### 3. Tabs no cambian la URL
**Solución:** Verificar que `useSearchParams` está importado de `react-router-dom`

### 4. Tipos TypeScript
**Solución:** Asegurarse que `TabType` y `SubTabType` están correctamente definidos

## 📝 Ejemplo de Commit

```bash
git add .
git commit -m "refactor: Restructure DashboardCreadora to modular architecture

- Split monolithic DashboardCreadoraPage into multiple components
- Extract infinite scroll logic to custom hook
- Create reusable SubTabsHeader component
- Organize tabs into separate directories
- Add proper TypeScript types
- Improve maintainability and scalability"
```

## 🎉 Resultado Esperado

Después de la migración deberías tener:

✅ Código más legible y mantenible
✅ Componentes reutilizables
✅ Hooks personalizados para lógica compleja
✅ Mejor organización de archivos
✅ Misma funcionalidad que antes
✅ Más fácil de escalar y testear

## 💡 Tips

- No hagas todo de golpe, ve fase por fase
- Haz commits pequeños después de cada fase
- Prueba después de cada cambio importante
- Si algo falla, revierte y revisa paso a paso
- Mantén el código antiguo hasta confirmar que todo funciona
