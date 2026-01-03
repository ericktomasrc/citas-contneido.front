# 🔌 GUÍA DE INTEGRACIÓN BACKEND C#

Este documento detalla todo lo que necesitas implementar en el backend C# para conectar con el sistema de suscripciones y PPV del frontend.

---

## 📋 TABLA DE CONTENIDOS
1. [Modelos/DTOs](#modelos-dtos)
2. [Endpoints Requeridos](#endpoints-requeridos)
3. [Base de Datos](#base-de-datos)
4. [Pasarela de Pagos](#pasarela-de-pagos)
5. [Archivos Frontend a Modificar](#archivos-frontend-a-modificar)

---

## 🗂️ MODELOS / DTOS

### UsuarioSuscripcionDTO
```csharp
public class UsuarioSuscripcionDTO
{
    public string UserId { get; set; }
    public string CreadoraId { get; set; }
    public TipoSuscripcion TipoSuscripcion { get; set; } // Enum: Basico, Vip, Elite
    public bool Activa { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaExpiracion { get; set; }
    public bool RenovacionAutomatica { get; set; }
}

public enum TipoSuscripcion
{
    Basico,   // S/.20/mes
    Vip,      // S/.50/mes
    Elite     // S/.150/mes
}
```

### TransmisionConfigDTO
```csharp
public class TransmisionConfigDTO
{
    public string ChannelName { get; set; }
    public TipoTransmision TipoTransmision { get; set; }
    public decimal? PrecioPPV { get; set; }
    public string DescripcionPPV { get; set; }
    public string CreadoraId { get; set; }
    public DateTime FechaInicio { get; set; }
}

public enum TipoTransmision
{
    Gratis,
    Suscriptores,
    PPV
}
```

### AccesoPPVDTO
```csharp
public class AccesoPPVDTO
{
    public string UserId { get; set; }
    public string ChannelName { get; set; }
    public decimal MontoPagado { get; set; }
    public DateTime FechaPago { get; set; }
    public string TransaccionId { get; set; }
}
```

---

## 🌐 ENDPOINTS REQUERIDOS

### 1. **Verificar Suscripción**
```csharp
[HttpGet("api/suscripciones/verificar/{userId}/{creadoraId}")]
[Authorize] // JWT Token
public async Task<IActionResult> VerificarSuscripcion(string userId, string creadoraId)
{
    // Lógica:
    // 1. Buscar suscripción activa del userId para la creadoraId
    // 2. Verificar que no haya expirado (FechaExpiracion > DateTime.Now)
    // 3. Retornar resultado
    
    var suscripcion = await _context.Suscripciones
        .FirstOrDefaultAsync(s => s.UserId == userId 
            && s.CreadoraId == creadoraId 
            && s.Activa 
            && s.FechaExpiracion > DateTime.Now);
    
    return Ok(new 
    { 
        esSuscriptor = suscripcion != null,
        tipoSuscripcion = suscripcion?.TipoSuscripcion,
        expiraEn = suscripcion?.FechaExpiracion
    });
}
```

### 2. **Crear Suscripción**
```csharp
[HttpPost("api/suscripciones/crear")]
[Authorize]
public async Task<IActionResult> CrearSuscripcion([FromBody] CrearSuscripcionRequest request)
{
    // Request: { UserId, CreadoraId, TipoSuscripcion, MetodoPago }
    
    // Lógica:
    // 1. Validar que no exista suscripción activa
    // 2. Procesar pago con pasarela (Culqi, MercadoPago, Stripe, etc.)
    // 3. Si pago exitoso, crear suscripción en BD
    // 4. Configurar webhook para renovaciones automáticas
    // 5. Retornar transaccionId
    
    var resultado = await _pagoService.ProcesarPago(request);
    
    if (resultado.Success)
    {
        var suscripcion = new UsuarioSuscripcion
        {
            UserId = request.UserId,
            CreadoraId = request.CreadoraId,
            TipoSuscripcion = request.TipoSuscripcion,
            Activa = true,
            FechaInicio = DateTime.Now,
            FechaExpiracion = DateTime.Now.AddMonths(1),
            RenovacionAutomatica = true
        };
        
        await _context.Suscripciones.AddAsync(suscripcion);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            success = true, 
            suscripcion, 
            transaccionId = resultado.TransaccionId 
        });
    }
    
    return BadRequest(new { success = false, error = resultado.Error });
}
```

### 3. **Cancelar Suscripción**
```csharp
[HttpPost("api/suscripciones/cancelar")]
[Authorize]
public async Task<IActionResult> CancelarSuscripcion([FromBody] CancelarSuscripcionRequest request)
{
    // Request: { UserId, CreadoraId }
    
    var suscripcion = await _context.Suscripciones
        .FirstOrDefaultAsync(s => s.UserId == request.UserId 
            && s.CreadoraId == request.CreadoraId 
            && s.Activa);
    
    if (suscripcion != null)
    {
        suscripcion.Activa = false;
        suscripcion.RenovacionAutomatica = false;
        await _context.SaveChangesAsync();
    }
    
    return Ok(new { success = true });
}
```

### 4. **Pagar PPV**
```csharp
[HttpPost("api/ppv/pagar")]
[Authorize]
public async Task<IActionResult> PagarPPV([FromBody] PagarPPVRequest request)
{
    // Request: { UserId, ChannelName, Monto, MetodoPago }
    
    // Lógica:
    // 1. Verificar que el canal existe y es tipo PPV
    // 2. Procesar pago con pasarela
    // 3. Si exitoso, registrar acceso en BD
    // 4. Retornar accesoId
    
    var resultado = await _pagoService.ProcesarPagoPPV(request);
    
    if (resultado.Success)
    {
        var acceso = new AccesoPPV
        {
            UserId = request.UserId,
            ChannelName = request.ChannelName,
            MontoPagado = request.Monto,
            FechaPago = DateTime.Now,
            TransaccionId = resultado.TransaccionId
        };
        
        await _context.AccesosPPV.AddAsync(acceso);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            success = true, 
            accesoId = acceso.Id,
            transaccionId = resultado.TransaccionId 
        });
    }
    
    return BadRequest(new { success = false, error = resultado.Error });
}
```

### 5. **Verificar Acceso PPV**
```csharp
[HttpGet("api/ppv/verificar/{userId}/{channelName}")]
[Authorize]
public async Task<IActionResult> VerificarAccesoPPV(string userId, string channelName)
{
    var acceso = await _context.AccesosPPV
        .FirstOrDefaultAsync(a => a.UserId == userId && a.ChannelName == channelName);
    
    return Ok(new 
    { 
        tienePago = acceso != null,
        expiraEn = acceso?.FechaPago.AddHours(24) // Opcional: expiración
    });
}
```

### 6. **Actualizar Canal con Tipo de Transmisión**
```csharp
[HttpPost("api/canal/iniciar")]
public async Task<IActionResult> IniciarCanal([FromBody] IniciarCanalRequest request)
{
    // Request: { ChannelName, TipoTransmision, PrecioPPV?, DescripcionPPV? }
    
    var canal = new TransmisionConfig
    {
        ChannelName = request.ChannelName,
        TipoTransmision = request.TipoTransmision,
        PrecioPPV = request.PrecioPPV,
        DescripcionPPV = request.DescripcionPPV,
        FechaInicio = DateTime.Now,
        Activo = true
    };
    
    await _context.Canales.AddAsync(canal);
    await _context.SaveChangesAsync();
    
    return Ok(new { success = true, activo = true });
}

[HttpGet("api/canal/{channelName}/activo")]
public async Task<IActionResult> ObtenerEstadoCanal(string channelName)
{
    var canal = await _context.Canales
        .FirstOrDefaultAsync(c => c.ChannelName == channelName && c.Activo);
    
    return Ok(new 
    { 
        activo = canal != null,
        tipoTransmision = canal?.TipoTransmision ?? "gratis",
        precioPPV = canal?.PrecioPPV ?? 0,
        descripcionPPV = canal?.DescripcionPPV ?? ""
    });
}
```

---

## 🗄️ BASE DE DATOS

### Tabla: Suscripciones
```sql
CREATE TABLE Suscripciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    CreadoraId NVARCHAR(450) NOT NULL,
    TipoSuscripcion INT NOT NULL, -- 0=Basico, 1=Vip, 2=Elite
    Activa BIT NOT NULL DEFAULT 1,
    FechaInicio DATETIME2 NOT NULL,
    FechaExpiracion DATETIME2 NOT NULL,
    RenovacionAutomatica BIT NOT NULL DEFAULT 1,
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id),
    FOREIGN KEY (CreadoraId) REFERENCES AspNetUsers(Id),
    INDEX IX_UserId_CreadoraId (UserId, CreadoraId)
);
```

### Tabla: AccesosPPV
```sql
CREATE TABLE AccesosPPV (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    ChannelName NVARCHAR(200) NOT NULL,
    MontoPagado DECIMAL(10,2) NOT NULL,
    FechaPago DATETIME2 NOT NULL,
    TransaccionId NVARCHAR(100) NOT NULL UNIQUE,
    
    FOREIGN KEY (UserId) REFERENCES AspNetUsers(Id),
    INDEX IX_UserId_ChannelName (UserId, ChannelName)
);
```

### Tabla: Canales (actualizar)
```sql
ALTER TABLE Canales ADD TipoTransmision INT DEFAULT 0; -- 0=Gratis, 1=Suscriptores, 2=PPV
ALTER TABLE Canales ADD PrecioPPV DECIMAL(10,2) NULL;
ALTER TABLE Canales ADD DescripcionPPV NVARCHAR(500) NULL;
```

---

## 💳 PASARELA DE PAGOS

### Recomendaciones para Perú:

1. **Culqi** (recomendado para Perú)
   - Soporta tarjetas peruanas
   - API sencilla
   - Webhooks para suscripciones
   - https://www.culqi.com/

2. **MercadoPago**
   - Amplia aceptación en Latinoamérica
   - Soporta múltiples métodos de pago

3. **Stripe** (internacional)
   - Más completo pero complejo
   - Requiere más configuración

### Ejemplo con Culqi:
```csharp
public class CulqiService
{
    private readonly HttpClient _client;
    private readonly string _secretKey;
    
    public async Task<PagoResult> ProcesarPago(decimal monto, string email, string tokenId)
    {
        var request = new
        {
            amount = (int)(monto * 100), // Culqi usa centavos
            currency_code = "PEN",
            email = email,
            source_id = tokenId
        };
        
        var response = await _client.PostAsJsonAsync("https://api.culqi.com/v2/charges", request);
        // ... manejar respuesta
    }
}
```

---

## 📝 ARCHIVOS FRONTEND A MODIFICAR

Cuando conectes el backend C#, solo necesitas actualizar **1 archivo**:

### `src/shared/services/subscription.service.ts`

Busca los comentarios `// TODO: BACKEND C#` y descomenta el código marcado como "IMPLEMENTACIÓN REAL CON C#".

**Ejemplo:**
```typescript
// Cambiar esto:
const userId = getTempUserId();

// Por esto:
const userId = getUserIdFromToken(); // Tu función que obtiene userId del JWT

// Y descomentar:
const response = await fetch(`${BACKEND_URL}/api/suscripciones/verificar/${userId}/${creadoraId}`, {
  headers: {
    'Authorization': `Bearer ${getToken()}` // Tu token JWT
  }
});
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

- [ ] Crear modelos/DTOs en C#
- [ ] Crear tablas en base de datos
- [ ] Implementar 6 endpoints principales
- [ ] Integrar pasarela de pagos (Culqi/MercadoPago)
- [ ] Configurar webhooks para renovaciones
- [ ] Actualizar `subscription.service.ts` en frontend
- [ ] Probar flujo completo de suscripción
- [ ] Probar flujo completo de PPV
- [ ] Implementar logs/auditoría de pagos
- [ ] Configurar notificaciones por email

---

## 🚀 FLUJO COMPLETO

### Suscripción:
1. Usuario hace clic en "Suscribirme"
2. Frontend llama `crearSuscripcion()` → POST `/api/suscripciones/crear`
3. Backend procesa pago con Culqi
4. Backend guarda suscripción en BD
5. Backend retorna `{ success: true, transaccionId }`
6. Frontend permite acceso al live

### PPV:
1. Usuario intenta ver live PPV
2. Frontend verifica acceso → GET `/api/ppv/verificar/:userId/:channelName`
3. Si no tiene acceso, muestra modal de pago
4. Usuario paga → POST `/api/ppv/pagar`
5. Backend procesa pago y registra acceso
6. Frontend permite acceso al live

---

## 📧 CONTACTO
Si tienes dudas sobre la integración, revisa los comentarios en:
- `src/shared/services/subscription.service.ts`
- `src/shared/types/subscription.types.ts`

Todos los endpoints simulados tienen comentarios `// TODO: BACKEND C#` con ejemplos exactos.
