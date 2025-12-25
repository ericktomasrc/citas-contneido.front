import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IdCard, BookOpen, CreditCard, Info, Smartphone, DollarSign, Banknote,
   Lock, Eye, EyeOff, Camera, MapPin, Upload, CheckCircle, UserCircle, Users, AlertCircle, 
   Flag} from 'lucide-react';
import { LiveCameraCapture } from '../../components/LiveCameraCapture';  
import { completarRegistro } from '../../shared/api/authApi';
import { Toast } from '../../components/Toast'; 
import { ConfirmModal } from '../../components/ConfirmModal'; 
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { LGBTIcon } from '@/components/SVG/LGBTIcon';

export const CompletarRegistroPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<any>(null);
  
  // Estados del formulario
  const [generoSeleccionado, setGeneroSeleccionado] = useState<string>('');   
  const [username, setUsername] = useState<string>(''); 
  const [tipoDocumentoSeleccionado, setTipoDocumentoSeleccionado] = useState<string>(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoDocumento, setFotoDocumento] = useState<File | null>(null);  
  const [fotoEnVivo, setFotoEnVivo] = useState<Blob | null>(null);
  const [mostrarCamara, setMostrarCamara] = useState(false);  
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false); 
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [numeroYape, setNumeroYape] = useState('');
  const [numeroPlin, setNumeroPlin] = useState('');
  const [bancoNombre, setBancoNombre] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [bio, setBio] = useState('');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [cargando, setCargando] = useState(false);

  //   NUEVOS ESTADOS PARA VALIDACIONES
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [codigoReferido, setCodigoReferido] = useState('');
  const [generoInteresId, setGeneroInteresId] = useState<number | null>(null);

  const [toast, setToast] = useState<{
  show: boolean;
  type: 'success' | 'error' | 'warning';
  message: string;
} | null>(null);


  //   VALIDACIÓN DE REQUISITOS DE CONTRASEÑA
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[\W_]/.test(password)
  };

  useEffect(() => {
    const dataStr = localStorage.getItem('temp_registration');
    
    if (!dataStr) {
      navigate('/register');
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      const elapsed = Date.now() - data.timestamp;
      
      if (elapsed > 30 * 60 * 1000) {
        localStorage.removeItem('temp_registration');
        navigate('/register');
        return;
      }

      if (!data.userId || !data.tipoUsuario) {
        navigate('/seleccionar-tipo-usuario');
        return;
      }

      setRegistrationData(data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('temp_registration');
      navigate('/register');
    }
  }, [navigate]);

  //   FUNCIÓN: Validar mayor de 18 años
  const calcularEdad = (fechaNac: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  //   FUNCIÓN: Validar WhatsApp
  const validarWhatsApp = (numero: string): boolean => {
    // Formato: +51999999999 o 51999999999 (mínimo 10 dígitos)
    const regex = /^\+?[1-9]\d{9,14}$/;
    return regex.test(numero.replace(/\s/g, ''));
  };

  //   FUNCIÓN: Validar número de celular (Yape/Plin)
  const validarCelular = (numero: string): boolean => {
    // 9 dígitos para Perú
    const regex = /^9\d{8}$/;
    return regex.test(numero.replace(/\s/g, ''));
  };

  //   FUNCIÓN: Validar Paso 1 (Información Personal)
  const validarPaso1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const esCreador = registrationData?.tipoUsuario === 2;
    const esCliente = registrationData?.tipoUsuario === 1;

    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }

    if (!fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (calcularEdad(fechaNacimiento) < 18) {
      newErrors.fechaNacimiento = 'Debes ser mayor de 18 años';
    }

    if (!generoSeleccionado) {
      newErrors.genero = 'Selecciona tu género';
    }

     if (esCliente && !generoInteresId) {
     newErrors.generoInteres = 'Selecciona qué género te interesa ver';
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   FUNCIÓN: Validar Paso 2 (Documento - Solo Creadores)
  const validarPaso2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tipoDocumentoSeleccionado) {
      newErrors.tipoDocumento = 'Selecciona el tipo de documento';
    }

    if (!numeroDocumento.trim()) {
      newErrors.numeroDocumento = 'El número de documento es obligatorio';
    }

    if (!nacionalidad) {
      newErrors.nacionalidad = 'Selecciona tu nacionalidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   FUNCIÓN: Validar Paso 3 (Contacto y Pagos - Solo Creadores)
  const validarPaso3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'El WhatsApp es obligatorio';
    } else if (!validarWhatsApp(whatsapp)) {
      newErrors.whatsapp = 'Formato inválido. Ej: +51999999999';
    }

    if (!bancoNombre) {
      newErrors.banco = 'Selecciona un banco';
    }

    if (!numeroCuenta.trim()) {
      newErrors.numeroCuenta = 'El número de cuenta es obligatorio';
    }

    // Validar Yape si está lleno
    if (numeroYape.trim() && !validarCelular(numeroYape)) {
      newErrors.yape = 'Formato inválido. Ej: 999999999';
    }

    // Validar Plin si está lleno
    if (numeroPlin.trim() && !validarCelular(numeroPlin)) {
      newErrors.plin = 'Formato inválido. Ej: 999999999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   FUNCIÓN: Validar Contraseñas
  const validarPasswords = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordRequirements.minLength) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!passwordRequirements.hasUpperCase) {
      newErrors.password = 'Debe tener al menos una mayúscula';
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = 'Debe tener al menos un número';
    } else if (!passwordRequirements.hasSpecial) {
      newErrors.password = 'Debe tener al menos un carácter especial';
    }

    if (!confirmarPassword) {
      newErrors.confirmarPassword = 'Confirma tu contraseña';
    } else if (password !== confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   FUNCIÓN: Manejar navegación entre pasos
  const handleNextStep = () => {
    setErrors({}); // Limpiar errores anteriores

    const esCreador = registrationData?.tipoUsuario === 2;

    // Validar según el paso actual
    if (currentStep === 1) {
      if (!validarPaso1()) return;
      setCurrentStep(esCreador ? 2 : 2);
    } else if (currentStep === 2 && esCreador) {
      if (!validarPaso2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3 && esCreador) {
      if (!validarPaso3()) return;
      setCurrentStep(4);
    } else if ((currentStep === 2 && !esCreador) || (currentStep === 4 && esCreador)) {
      if (!validarPasswords()) return;
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCompletarClick = () => {
  setShowConfirmDialog(true);
};

// ✅ FUNCIÓN: Confirmar y proceder con el registro
const handleConfirmRegistro = () => {
  setShowConfirmDialog(false); // Cerrar diálogo de confirmación
  handleSubmit(); // Proceder con el envío
};

// ✅ FUNCIÓN: Cancelar
const handleCancelRegistro = () => {
  setShowConfirmDialog(false);
};

  const handleSubmit = async () => {
     setShowConfirmModal(true);
  setCargando(true); 
    
    const formData = new FormData();
    formData.append('UsuarioId', registrationData.userId.toString());
    formData.append('TipoUsuarioId', registrationData.tipoUsuario.toString());
    formData.append('Username', username);
    formData.append('Nombre', nombre);
    formData.append('Apellidos', apellidos);
    formData.append('FechaNacimiento', fechaNacimiento);
    formData.append('GeneroId', generoSeleccionado === 'M' ? '1' : (generoSeleccionado === 'F' ? '2' : '3'));
    formData.append('Password', password);
    formData.append('ConfirmarPassword', confirmarPassword);
    formData.append('Latitud', latitud.toString());
    formData.append('Longitud', longitud.toString());

 // AGREGAR CÓDIGO DE REFERIDO (Solo Creadoras)
  if (registrationData.tipoUsuario === 2 && codigoReferido) {
    formData.append('CodigoQuienRecomendo', codigoReferido);
  }
  
  //  AGREGAR GÉNERO DE INTERÉS (Solo Clientes)
  if (registrationData.tipoUsuario === 1 && generoInteresId) {
    formData.append('GeneroQueMeInteresaId', generoInteresId.toString());
  }
    
    if (registrationData.tipoUsuario === 2) {
      formData.append('TipoDocumentoId', tipoDocumentoSeleccionado === 'DNI' ? '1' : tipoDocumentoSeleccionado === 'Pasaporte' ? '2' : '3');
      formData.append('NumeroDocumento', numeroDocumento);
      formData.append('Nacionalidad', nacionalidad);
      formData.append('WhatsApp', whatsapp);
      if (numeroYape) formData.append('NumeroYape', numeroYape);
      if (numeroPlin) formData.append('NumeroPlin', numeroPlin);
      if (bancoNombre) formData.append('BancoNombre', bancoNombre);
      if (numeroCuenta) formData.append('NumeroCuenta', numeroCuenta);
      if (bio) formData.append('Bio', bio);
    }
    
    if (fotoDocumento) formData.append('FotoDocumento', fotoDocumento);
    if (fotoEnVivo) formData.append('FotoEnVivo', fotoEnVivo);
    
    try {
      const result = await completarRegistro(formData);
      localStorage.setItem('token', result.token);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.removeItem('temp_registration');
 
    setRegistroExitoso(true);
    setCargando(false);
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    } catch (err: any) {
    setShowConfirmModal(false);
    setCargando(false);
    
    let errorMessage = 'Ocurrió un error al completar el registro';
    
    try {
      if (err.message) {
        errorMessage = err.message;
      }
    } catch (e) {
      console.error('Error parseando mensaje:', e);
    }
    
    // Mostrar toast de error
    setToast({
      show: true,
      type: 'error',
      message: errorMessage
    });
    } finally {
      setCargando(false);
    }
  };

  //   COMPONENTE: Mensaje de error
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Paso {currentStep} de {registrationData?.tipoUsuario === 2 ? '5' : '3'}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / (registrationData?.tipoUsuario === 2 ? 5 : 3)) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (registrationData?.tipoUsuario === 2 ? 5 : 3)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Información Personal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Información Personal</h2>
              <p className="text-gray-600">Cuéntanos sobre ti</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">@</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    setErrors({ ...errors, username: '' });
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tunombre"
                  maxLength={20}
                />
              </div>
              <ErrorMessage message={errors.username} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setErrors({ ...errors, nombre: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                />
                <ErrorMessage message={errors.nombre} />
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => {
                    setApellidos(e.target.value);
                    setErrors({ ...errors, apellidos: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.apellidos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tus apellidos"
                />
                <ErrorMessage message={errors.apellidos} />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => {
                  setFechaNacimiento(e.target.value);
                  setErrors({ ...errors, fechaNacimiento: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <ErrorMessage message={errors.fechaNacimiento} />
            </div> 

            {/* ✅ GÉNERO - AGREGAR OPCIÓN LGBTIQ+ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Género <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Masculino */}
                <button
                  type="button"
                  onClick={() => {
                    setGeneroSeleccionado('M');
                    setErrors({ ...errors, genero: '' });
                  }}
                  className={`p-4 border-2 rounded-lg transition flex flex-col items-center justify-center gap-2 ${
                    generoSeleccionado === 'M'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : errors.genero
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <UserCircle className={`w-8 h-8 ${generoSeleccionado === 'M' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`font-medium text-sm ${generoSeleccionado === 'M' ? 'text-blue-700' : 'text-gray-700'}`}>
                    Masculino
                  </span>
                </button>

                {/* Femenino */}
                <button
                  type="button"
                  onClick={() => {
                    setGeneroSeleccionado('F');
                    setErrors({ ...errors, genero: '' });
                  }}
                  className={`p-4 border-2 rounded-lg transition flex flex-col items-center justify-center gap-2 ${
                    generoSeleccionado === 'F'
                      ? 'border-pink-500 bg-pink-50 shadow-md'
                      : errors.genero
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <Users className={`w-8 h-8 ${generoSeleccionado === 'F' ? 'text-pink-600' : 'text-gray-500'}`} />
                  <span className={`font-medium text-sm ${generoSeleccionado === 'F' ? 'text-pink-700' : 'text-gray-700'}`}>
                    Femenino
                  </span>
                </button> 

                 {/*  LGBTIQ+ */}
                <button
                        type="button"
                        onClick={() => {
                          setGeneroSeleccionado('L');
                          setErrors({ ...errors, genero: '' });
                        }}
                        className={`p-4 border-2 rounded-lg transition flex items-center justify-center gap-3 ${
                          generoSeleccionado === 'L'
                            ? 'border-purple-500 bg-purple-100 shadow-md'
                            : errors.genero
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <Flag className={`w-6 h-6 ${generoSeleccionado === 'L' ? 'text-purple-600' : 'text-gray-500'}`} />
                        <span className={`font-medium ${generoSeleccionado === 'L' ? 'text-purple-700' : 'text-gray-700'}`}>
                          LGBTIQ+
                        </span>
                </button>

              </div>
              <ErrorMessage message={errors.genero} />
            </div>

            {/* ✅ NUEVO: CÓDIGO DE REFERIDO (Solo para Creadoras) */}
            {registrationData?.tipoUsuario === 2 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                {/* <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-500 rounded-full p-2">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      ¡Gana S/. 10 por cada amiga que invites! 💰
                    </h3>
                    <p className="text-sm text-green-700">
                      ¿Conoces a alguien que quiera ganar dinero? Comparte tu código y ambas ganan.
                    </p>
                  </div>
                </div> */}
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de quien te recomendó (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-green-600 font-mono">#</span>
                  </div>
                  <input
                    type="text"
                    value={codigoReferido}
                    onChange={(e) => setCodigoReferido(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white font-mono"
                    placeholder="Ej: ABC123"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Si te invitó una amiga, ingresa su código aquí
                </p>
              </div>
            )}

            {/* ✅ NUEVO: GÉNERO QUE ME INTERESA (Solo para Clientes) */}
            {registrationData?.tipoUsuario === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Qué te interesa ver? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Mujeres */}
                  <button
                    type="button"
                    onClick={() => {
                      setGeneroInteresId(1);
                      setErrors({ ...errors, generoInteres: '' });
                    }}
                    className={`p-4 border-2 rounded-lg transition flex flex-col items-center justify-center gap-2 ${
                      generoInteresId === 1
                        ? 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-200'
                        : errors.generoInteres
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <div className="text-3xl">👩</div>
                    <span className={`font-medium text-sm ${generoInteresId === 1 ? 'text-pink-700' : 'text-gray-700'}`}>
                      Mujeres
                    </span>
                  </button>

                  {/* Hombres */}
                  <button
                    type="button"
                    onClick={() => {
                      setGeneroInteresId(2);
                      setErrors({ ...errors, generoInteres: '' });
                    }}
                    className={`p-4 border-2 rounded-lg transition flex flex-col items-center justify-center gap-2 ${
                      generoInteresId === 2
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                        : errors.generoInteres
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-3xl">👨</div>
                    <span className={`font-medium text-sm ${generoInteresId === 2 ? 'text-blue-700' : 'text-gray-700'}`}>
                      Hombres
                    </span>
                  </button>

                  {/* LGBTIQ+ */}
                  <button
                    type="button"
                    onClick={() => {
                      setGeneroInteresId(3);
                      setErrors({ ...errors, generoInteres: '' });
                    }}
                    className={`p-4 border-2 rounded-lg transition flex flex-col items-center justify-center gap-2 ${
                      generoInteresId === 3
                        ? 'border-purple-500 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 shadow-md ring-2 ring-purple-200'
                        : errors.generoInteres
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="text-3xl">🏳️‍🌈</div>
                    <span className={`font-medium text-sm ${generoInteresId === 3 ? 'text-purple-700' : 'text-gray-700'}`}>
                      LGBTIQ+
                    </span>
                  </button>
                </div>
                <ErrorMessage message={errors.generoInteres} />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Esto nos ayuda a mostrarte contenido relevante para ti
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate('/seleccionar-tipo-usuario')}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Cambiar tipo de cuenta
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

       {/* Step 2: Documento de Identidad (Solo Creadores) */}
        {currentStep === 2 && registrationData?.tipoUsuario === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documento de Identidad</h2>
              <p className="text-gray-600">Para verificar tu identidad y seguridad</p>
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['DNI', 'Pasaporte', 'CE'].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => {
                      setTipoDocumentoSeleccionado(tipo);
                      setErrors({ ...errors, tipoDocumento: '' });
                    }}
                    className={`p-4 border-2 rounded-lg transition text-center ${
                      tipoDocumentoSeleccionado === tipo
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : errors.tipoDocumento
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {tipo === 'DNI' && <IdCard className={`w-8 h-8 mx-auto mb-2 ${tipoDocumentoSeleccionado === tipo ? 'text-primary-600' : 'text-gray-700'}`} />}
                    {tipo === 'Pasaporte' && <BookOpen className={`w-8 h-8 mx-auto mb-2 ${tipoDocumentoSeleccionado === tipo ? 'text-primary-600' : 'text-gray-700'}`} />}
                    {tipo === 'CE' && <CreditCard className={`w-8 h-8 mx-auto mb-2 ${tipoDocumentoSeleccionado === tipo ? 'text-primary-600' : 'text-gray-700'}`} />}
                    <div className="font-medium text-sm">{tipo === 'CE' ? 'C. Extranjería' : tipo}</div>
                  </button>
                ))}
              </div>
              <ErrorMessage message={errors.tipoDocumento} />
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={numeroDocumento}
                onChange={(e) => {
                  setNumeroDocumento(e.target.value);
                  setErrors({ ...errors, numeroDocumento: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.numeroDocumento ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 12345678"
                maxLength={20}
              />
              <ErrorMessage message={errors.numeroDocumento} />
            </div>

            {/* Nacionalidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nacionalidad <span className="text-red-500">*</span>
              </label>
              <select
                value={nacionalidad}
                onChange={(e) => {
                  setNacionalidad(e.target.value);
                  setErrors({ ...errors, nacionalidad: '' });
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.nacionalidad ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona tu nacionalidad</option>
                <option value="PE">🇵🇪 Peruana</option>
                <option value="AR">🇦🇷 Argentina</option>
                <option value="BO">🇧🇴 Boliviana</option>
                <option value="BR">🇧🇷 Brasileña</option>
                <option value="CL">🇨🇱 Chilena</option>
                <option value="CO">🇨🇴 Colombiana</option>
                <option value="EC">🇪🇨 Ecuatoriana</option>
                <option value="MX">🇲🇽 Mexicana</option>
                <option value="PY">🇵🇾 Paraguaya</option>
                <option value="UY">🇺🇾 Uruguaya</option>
                <option value="VE">🇻🇪 Venezolana</option>
                <option value="ES">🇪🇸 Española</option>
                <option value="US">🇺🇸 Estadounidense</option>
                <option value="OT">🌍 Otra</option>
              </select>
              <ErrorMessage message={errors.nacionalidad} />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">¿Por qué pedimos esto?</p>
                  <p className="text-blue-700">
                    Tu documento nos ayuda a verificar tu identidad y mantener la plataforma segura para todos.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contacto y Pagos (Solo Creadores) */}
        {currentStep === 3 && registrationData?.tipoUsuario === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto y Métodos de Pago</h2>
              <p className="text-gray-600">Para que puedan contactarte y enviarte pagos</p>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setErrors({ ...errors, whatsapp: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+51 999 999 999"
                />
              </div>
              <ErrorMessage message={errors.whatsapp} />
            </div>

            {/* Métodos de Pago */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Métodos de Pago (Opcional)
              </h3>

              {/* Yape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yape</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Banknote className="w-5 h-5 text-purple-600" />
                  </div>
                  <input
                    type="tel"
                    value={numeroYape}
                    onChange={(e) => {
                      setNumeroYape(e.target.value);
                      setErrors({ ...errors, yape: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white ${
                      errors.yape ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="999 999 999"
                  />
                </div>
                <ErrorMessage message={errors.yape} />
              </div>

              {/* Plin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plin</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Banknote className="w-5 h-5 text-blue-600" />
                  </div>
                  <input
                    type="tel"
                    value={numeroPlin}
                    onChange={(e) => {
                      setNumeroPlin(e.target.value);
                      setErrors({ ...errors, plin: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${
                      errors.plin ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="999 999 999"
                  />
                </div>
                <ErrorMessage message={errors.plin} />
              </div>

              {/* Banco */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banco <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bancoNombre}
                    onChange={(e) => {
                      setBancoNombre(e.target.value);
                      setErrors({ ...errors, banco: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white ${
                      errors.banco ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un banco</option>
                    <option value="BCP">BCP</option>
                    <option value="Interbank">Interbank</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Scotiabank">Scotiabank</option>
                    <option value="BanBif">BanBif</option>
                    <option value="Pichincha">Pichincha</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <ErrorMessage message={errors.banco} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cuenta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => {
                      setNumeroCuenta(e.target.value);
                      setErrors({ ...errors, numeroCuenta: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white ${
                      errors.numeroCuenta ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="19412345678901"
                  />
                  <ErrorMessage message={errors.numeroCuenta} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biografía / Descripción</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Cuéntales a tus seguidores sobre ti..."
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Máximo 500 caracteres</span>
                <span>{bio.length} / 500</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 4 (Creadores) / Step 2 (Consumidores): Crear Contraseña */}
        {((currentStep === 2 && registrationData?.tipoUsuario === 1) || 
          (currentStep === 4 && registrationData?.tipoUsuario === 2)) && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Contraseña</h2>
              <p className="text-gray-600">Protege tu cuenta con una contraseña segura</p>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <ErrorMessage message={errors.password} />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmarPassword}
                  onChange={(e) => {
                    setConfirmarPassword(e.target.value);
                    setErrors({ ...errors, confirmarPassword: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.confirmarPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <ErrorMessage message={errors.confirmarPassword} />
            </div>

            {/* Requisitos de Contraseña */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">Tu contraseña debe tener:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordRequirements.minLength ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {passwordRequirements.minLength && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordRequirements.hasUpperCase ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {passwordRequirements.hasUpperCase && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span>Al menos una letra mayúscula</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordRequirements.hasNumber ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {passwordRequirements.hasNumber && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span>Al menos un número</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordRequirements.hasSpecial ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {passwordRequirements.hasSpecial && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span>Al menos un carácter especial</span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(registrationData?.tipoUsuario === 1 ? 1 : 3)}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 5 (Creadores) / Step 3 (Consumidores): Verificación */}
        {((currentStep === 3 && registrationData?.tipoUsuario === 1) || 
          (currentStep === 5 && registrationData?.tipoUsuario === 2)) && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación de Identidad</h2>
              <p className="text-gray-600">Último paso para completar tu registro</p>
            </div>

            {/* Foto de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sube una foto Clara <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="foto-Documento"
                  onChange={(e) => setFotoDocumento(e.target.files?.[0] || null)}
                />
                <label htmlFor="foto-Documento" className="cursor-pointer">
                  {fotoDocumento ? (
                    <div>
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-sm text-green-600 font-medium mb-1">✓ {fotoDocumento.name}</p>
                      <p className="text-xs text-gray-500">Haz clic para cambiar</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Sube una foto donde se vea claramente tu rostro</p>
                      <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Esta foto se comparará con la captura en vivo
              </p>
            </div>

            {/* Verificación Facial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verificación Facial en Vivo <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setMostrarCamara(true)}
                disabled={!fotoDocumento}
                className={`w-full p-6 border-2 rounded-lg transition ${
                  fotoEnVivo
                    ? 'border-green-500 bg-green-50'
                    : fotoDocumento
                    ? 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  {fotoEnVivo ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-600" />
                      <p className="font-medium text-green-700">✓ Verificación facial completada</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-500" />
                      <p className="font-medium text-gray-700">
                        {fotoDocumento ? 'Iniciar verificación facial' : 'Primero sube tu selfie'}
                      </p>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Ubicación GPS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setLatitud(position.coords.latitude);
                        setLongitud(position.coords.longitude);
                        setUbicacionObtenida(true);
                      },
                      (error) => alert('No se pudo obtener tu ubicación.')
                    );
                  }
                }}
                className={`w-full p-4 border-2 rounded-lg transition flex items-center justify-center gap-3 ${
                  ubicacionObtenida
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                }`}
              >
                <MapPin className={`w-6 h-6 ${ubicacionObtenida ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="font-medium">
                  {ubicacionObtenida ? '✓ Ubicación obtenida' : 'Obtener mi ubicación'}
                </span>
              </button>
               <p className="text-xs text-gray-500 mt-2">
                Tu ubicación nos ayuda a conectarte con personas cercanas
              </p>
            </div>

                        {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Verificación automática</p>
                  <p className="text-blue-700">
                    Comparamos tu selfie con la foto en vivo para verificar tu identidad. El proceso es automático e inmediato.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Atrás
              </button>
              
                  {/* Botón "Completar Registro" en el último paso */}
                <button
                  type="button"
                  onClick={handleCompletarClick} // ✅ CAMBIAR A handleCompletarClick
                  disabled={!fotoDocumento || !fotoEnVivo || !ubicacionObtenida || cargando}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? 'Procesando...' : 'Completar Registro'}
                </button>
            </div>
          </div>
        )}

        {/* Diálogo de Confirmación Previo */}
        {showConfirmDialog && (
          <ConfirmationDialog
            onConfirm={handleConfirmRegistro}
            onCancel={handleCancelRegistro}
          />
        )}

        {/* Modal de Confirmación */}
        {showConfirmModal && (
          <ConfirmModal
            isLoading={cargando}
            isSuccess={registroExitoso}
            onClose={() => {
              setShowConfirmModal(false);
              navigate('/dashboard');
            }}
          />
        )}

        {/* Toast de Notificaciones */}
        {toast?.show && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
        
        {/* Modal de Cámara */}
        {mostrarCamara && (
          <LiveCameraCapture
            onCapture={(blob) => {
              setFotoEnVivo(blob);
              setMostrarCamara(false);
            }}
            onClose={() => setMostrarCamara(false)}
          />
        )}
      </div>
    </div>
  );
};