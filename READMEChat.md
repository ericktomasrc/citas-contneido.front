# 💬 SISTEMA DE CHAT ACTUALIZADO - OPCIÓN 1

## ✅ IMPLEMENTACIÓN CON `userRole`

---

## 📂 ESTRUCTURA DE ARCHIVOS

```
src/features/chat/
├── types/
│   ├── user.types.ts                    ⭐ Roles, badges, usuarios
│   ├── message.types.ts                 
│   └── chat.types.ts                    ⭐ Configuración individual
│
├── constants/
│   ├── badges.constants.ts              ⭐ Insignias de solvencia
│   └── gifts.constants.ts
│
├── hooks/
│   ├── useConversationSorting.ts        ⭐ Ordenamiento automático
│   ├── useChat.ts
│   └── useChatPermissions.ts
│
├── components/
│   ├── Badge/
│   │   └── BadgeComponent.tsx           ⭐ Componente de insignia
│   │
│   ├── FloatingChat/
│   │   ├── FloatingChatModal.tsx        ⭐ Modal principal (con userRole)
│   │   ├── ChatHeader.tsx               ⭐ Header (con opciones por rol)
│   │   ├── ChatInput.tsx                ⭐ Input (botones dinámicos)
│   │   ├── ChatMessages.tsx
│   │   └── MessageCard.tsx
│   │
│   ├── ConversationList/
│   │   ├── ConversationList.tsx         ⭐ Lista con ordenamiento
│   │   └── ConversationCard.tsx         ⭐ Card con badge y menú
│   │
│   ├── Settings/
│   │   ├── IndividualSettingsPanel.tsx  ⭐ Config individual (creadora)
│   │   └── QuickSettingsPanel.tsx
│   │
│   └── Gifts/
│       └── GiftPanel.tsx
```

---

## 🚀 CÓMO USAR

### **1. Para Espectador:**

```typescript
import { FloatingChatModal } from '@/features/chat/components/FloatingChat/FloatingChatModal';

<FloatingChatModal
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  userRole="espectador"              // ⭐ ROL ESPECTADOR
  conversation={currentConversation}
  onSendMessage={handleSendMessage}
  onSendGift={handleSendGift}        // ✅ Puede enviar regalos
  onSendTip={handleSendTip}          // ✅ Puede enviar propinas
/>
```

### **2. Para Creadora:**

```typescript
import { FloatingChatModal } from '@/features/chat/components/FloatingChat/FloatingChatModal';

<FloatingChatModal
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  userRole="creadora"                 // ⭐ ROL CREADORA
  conversation={currentConversation}
  onSendMessage={handleSendMessage}
  onUpdateConfig={handleUpdateConfig} // ✅ Puede configurar chat individual
/>
```

---

## ✨ FEATURES IMPLEMENTADOS

### **1. ✅ Roles Diferenciados**
```typescript
type UserRole = 'creadora' | 'espectador';
```

**Espectador ve:**
- Botones de 🎁 Regalo y 💵 Propina
- Restricciones según configuración de la creadora
- Su insignia de solvencia

**Creadora ve:**
- Botón ⚙️ de configuración individual
- Panel para gestionar permisos por espectador
- Sin botones de regalo/propina

---

### **2. ✅ Insignias de Solvencia**

```typescript
// Niveles de badges
🥉 Básico      → Gratis
🥈 Pro         → S/.50
💎 Premium     → S/.150
👑 VIP         → S/.300
⭐ Super VIP   → S/.500
```

**Ubicación:**
- Debajo del avatar en la lista de conversaciones
- Al lado derecho del mensaje en el chat

**Uso:**
```typescript
import { BadgeComponent } from '@/features/chat/components/Badge/BadgeComponent';

<BadgeComponent 
  badge={user.badge} 
  size="md" 
  position="avatar" // o "message"
/>
```

---

### **3. ✅ Ordenamiento Automático**

**Regla:** El chat con el mensaje **MÁS RECIENTE** siempre va **ARRIBA**

```typescript
import { useConversationSorting } from '@/features/chat/hooks/useConversationSorting';

const { sortedConversations } = useConversationSorting(conversations);
```

**Comportamiento:**
1. Espectador A envía mensaje → Va arriba
2. Espectador B envía mensaje → B va arriba, A baja
3. Creadora responde a A → A va arriba
4. Nuevo mensaje de C → C va arriba, A segundo, B tercero

**Con animaciones:**
```css
animation: slideIn 0.3s ease-out
```

---

### **4. ✅ Configuración Individual (Creadora)**

Panel para configurar permisos **por cada espectador**:

```typescript
interface ChatConfig {
  permissions: {
    canSendPhotos: boolean;
    canSendVideos: boolean;
    canSendAudios: boolean;
    canSendGifts: boolean;
    canSendTips: boolean;
    canRequestVideocall: boolean;
  };
  blockedWords: string[];
  autoBlockEnabled: boolean;
  allowAnonymousTips: boolean;
  minimumTipAmount: number;
  videocallsEnabled: boolean;
}
```

**Cómo abrir:**
- Click en botón ⚙️ del header (solo visible para creadora)
- Panel modal con todos los permisos
- Guardar aplica solo a ese espectador

---

### **5. ✅ Gestión de Mensajes**

Menú contextual con:
- 📌 Fijar conversación
- 📦 Archivar
- 🗑️ Eliminar
- 🔇 Silenciar

---

## 🎨 EJEMPLOS VISUALES

### **Espectador con Badge:**
```
┌─────────────────────────────────────┐
│ [Avatar]  Carlos López              │
│  🥈 Pro   En línea            2m    │
│                                     │
│  Hola! 👋                           │
│  [🎁 Regalo] [💵 Propina]           │
└─────────────────────────────────────┘
```

### **Creadora con Config:**
```
┌─────────────────────────────────────┐
│ [Avatar]  Juan Pérez        ⚙️ ➖ ✕ │
│           En línea            5m    │
│                                     │
│  Gracias por el contenido!          │
│  [Enviar mensaje...]                │
└─────────────────────────────────────┘
```

### **Lista con Ordenamiento:**
```
📱 Mensajes

[Pedro] 💎 Premium
Hola! 👋                        Ahora ⬆

[Juan]  👑 VIP
Gracias                         2m

[Ana]   🥈 Pro
Me gusta tu contenido           1h
```

---

## 🔄 FLUJO DE ORDENAMIENTO

```
Estado inicial:
1. Juan (10:00 AM)
2. Pedro (9:50 AM)
3. Ana (9:30 AM)

Pedro envía mensaje (10:05 AM):
1. Pedro ⬆ (10:05 AM) [ANIMACIÓN: slide-in]
2. Juan (10:00 AM)
3. Ana (9:30 AM)

Creadora responde a Ana (10:10 AM):
1. Ana ⬆ (10:10 AM) [ANIMACIÓN: slide-in]
2. Pedro (10:05 AM)
3. Juan (10:00 AM)
```

---

## 📱 INTEGRACIÓN CON BACKEND

### **Endpoints necesarios:**

```typescript
// 1. Obtener conversaciones
GET /api/chat/conversations
Response: Conversation[]

// 2. Enviar mensaje
POST /api/chat/messages
Body: { conversationId, content, type }

// 3. Actualizar config individual (creadora)
PUT /api/chat/conversations/:id/config
Body: ChatConfig

// 4. Comprar badge
POST /api/chat/badges/purchase
Body: { badgeLevel, amount }

// 5. Gestionar conversación
PUT /api/chat/conversations/:id
Body: { isPinned?, isArchived?, isMuted? }
```

---

## ⚡ SOCKET.IO EVENTS

```typescript
// Escuchar nuevos mensajes
socket.on('new_message', (message) => {
  // 1. Agregar mensaje a conversación
  // 2. Actualizar lastMessageAt
  // 3. Re-ordenar lista automáticamente
});

// Emitir mensaje
socket.emit('send_message', {
  conversationId,
  content,
  type: 'text'
});

// Actualizar estado de lectura
socket.emit('mark_as_read', {
  conversationId
});
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Implementar múltiples chats abiertos simultáneamente
2. ✅ Agregar notificaciones push
3. ✅ Implementar búsqueda de mensajes
4. ✅ Agregar reacciones a mensajes
5. ✅ Implementar eliminación de mensajes
6. ✅ Agregar mensajes programados

---

## 📞 SOPORTE

Si necesitas ayuda con la implementación, revisa:
- `types/` - Para entender las interfaces
- `constants/badges.constants.ts` - Para badges
- `hooks/useConversationSorting.ts` - Para ordenamiento
- `components/FloatingChat/FloatingChatModal.tsx` - Componente principal

---

**¡Listo para implementar! 🚀**
