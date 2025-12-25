export const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">CitasContenido</h1>
        <p className="text-xl mb-8">Encuentra tu match perfecto</p>
        <div className="space-x-4">
          <a 
            href="/login" 
            className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-block"
          >
            Iniciar Sesión
          </a>
          <a 
            href="/register" 
            className="bg-pink-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-800 transition inline-block"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  );
};