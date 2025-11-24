import React, { useState, useEffect, useRef } from 'react';
import { Camera, Check, X, User, CreditCard, Shield, AlertTriangle, Video, Scan, FileText, Brain, Eye, Fingerprint, CheckCircle, XCircle } from 'lucide-react';

// Base de datos simulada con características biométricas
const identidadesDB = {
  "1025520829": {
    nombre: "Karen Torres",
    cedula: "1025520829",
    edad: 26,
    ciudad: "Bogotá",
    caracteristicasBiometricas: {
      distanciaOjos: 6.2,
      anchoNariz: 3.8,
      largoBoca: 4.5,
      formaCara: "ovalada",
      colorOjos: "cafe",
      tonoPiel: "medio"
    },
    foto: "KT"
  },
  "1234567890": {
    nombre: "María González",
    cedula: "1234567890",
    edad: 28,
    ciudad: "Medellín",
    caracteristicasBiometricas: {
      distanciaOjos: 5.8,
      anchoNariz: 3.5,
      largoBoca: 4.2,
      formaCara: "redonda",
      colorOjos: "verde",
      tonoPiel: "claro"
    },
    foto: "MG"
  },
  "9876543210": {
    nombre: "Juan Pérez",
    cedula: "9876543210",
    edad: 35,
    ciudad: "Cali",
    caracteristicasBiometricas: {
      distanciaOjos: 6.5,
      anchoNariz: 4.1,
      largoBoca: 4.8,
      formaCara: "cuadrada",
      colorOjos: "cafe",
      tonoPiel: "oscuro"
    },
    foto: "JP"
  },
  "5555666677": {
    nombre: "Ana Rodríguez",
    cedula: "5555666677",
    edad: 42,
    ciudad: "Barranquilla",
    caracteristicasBiometricas: {
      distanciaOjos: 5.9,
      anchoNariz: 3.6,
      largoBoca: 4.3,
      formaCara: "ovalada",
      colorOjos: "cafe",
      tonoPiel: "medio"
    },
    foto: "AR"
  }
};

export default function BiometricVideoVerification() {
  const [cedula, setCedula] = useState('');
  const [etapa, setEtapa] = useState('inicio');
  const [videoActivo, setVideoActivo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [frames, setFrames] = useState([]);
  const [analisisBiometrico, setAnalisisBiometrico] = useState(null);
  const [resultado, setResultado] = useState(null);
  const videoRef = useRef(null);

  const iniciarCaptura = () => {
    if (!cedula) {
      alert('Por favor ingresa una cédula');
      return;
    }

    setEtapa('capturando');
    setVideoActivo(true);
    setProgreso(0);
    setFrames([]);

    let frameCount = 0;
    const capturaInterval = setInterval(() => {
      frameCount++;
      setFrames(prev => [...prev, {
        id: frameCount,
        tiempo: frameCount * 0.5,
        calidad: 85 + Math.random() * 15
      }]);
      setProgreso((frameCount / 10) * 100);

      if (frameCount >= 10) {
        clearInterval(capturaInterval);
        setVideoActivo(false);
        iniciarAnalisis();
      }
    }, 500);
  };

  const iniciarAnalisis = () => {
    setEtapa('analizando');
    setProgreso(0);

    const identidad = identidadesDB[cedula];
    
    const analisisSteps = [
      { paso: 'Detectando rostro...', porcentaje: 20 },
      { paso: 'Extrayendo características faciales...', porcentaje: 40 },
      { paso: 'Midiendo distancia entre ojos...', porcentaje: 55 },
      { paso: 'Analizando estructura facial...', porcentaje: 70 },
      { paso: 'Comparando con base de datos...', porcentaje: 85 },
      { paso: 'Verificando autenticidad...', porcentaje: 100 }
    ];

    let stepIndex = 0;
    const analisisInterval = setInterval(() => {
      if (stepIndex < analisisSteps.length) {
        setProgreso(analisisSteps[stepIndex].porcentaje);
        stepIndex++;
      } else {
        clearInterval(analisisInterval);
        finalizarAnalisis(identidad);
      }
    }, 800);
  };

  const generarCaracteristicasVideo = () => {
    return {
      distanciaOjos: (5.5 + Math.random() * 1.5).toFixed(1),
      anchoNariz: (3.2 + Math.random() * 1.2).toFixed(1),
      largoBoca: (4.0 + Math.random() * 1.0).toFixed(1),
      formaCara: ['ovalada', 'redonda', 'cuadrada'][Math.floor(Math.random() * 3)],
      colorOjos: ['cafe', 'verde', 'azul'][Math.floor(Math.random() * 3)],
      tonoPiel: ['claro', 'medio', 'oscuro'][Math.floor(Math.random() * 3)],
      calidadImagen: (85 + Math.random() * 15).toFixed(1),
      iluminacion: (75 + Math.random() * 20).toFixed(1),
      nitidez: (80 + Math.random() * 15).toFixed(1)
    };
  };

  const calcularCoincidencia = (caracteristicasVideo, caracteristicasDB) => {
    let puntos = 0;
    let total = 0;

    const diffOjos = Math.abs(parseFloat(caracteristicasVideo.distanciaOjos) - caracteristicasDB.distanciaOjos);
    puntos += Math.max(0, 20 - (diffOjos * 40));
    total += 20;

    const diffNariz = Math.abs(parseFloat(caracteristicasVideo.anchoNariz) - caracteristicasDB.anchoNariz);
    puntos += Math.max(0, 20 - (diffNariz * 50));
    total += 20;

    const diffBoca = Math.abs(parseFloat(caracteristicasVideo.largoBoca) - caracteristicasDB.largoBoca);
    puntos += Math.max(0, 15 - (diffBoca * 37.5));
    total += 15;

    if (caracteristicasVideo.formaCara === caracteristicasDB.formaCara) puntos += 15;
    total += 15;

    if (caracteristicasVideo.colorOjos === caracteristicasDB.colorOjos) puntos += 15;
    total += 15;

    if (caracteristicasVideo.tonoPiel === caracteristicasDB.tonoPiel) puntos += 15;
    total += 15;

    return Math.round((puntos / total) * 100);
  };

  const finalizarAnalisis = (identidad) => {
    const caracteristicasVideo = generarCaracteristicasVideo();
    
    if (!identidad) {
      setResultado({
        tipo: 'error',
        mensaje: 'IDENTIDAD NO REGISTRADA',
        match: 0,
        identidad: null
      });
      setAnalisisBiometrico({
        caracteristicasVideo,
        caracteristicasDB: null,
        detalles: [
          { nombre: 'Rostro detectado', estado: true },
          { nombre: 'Cédula en base de datos', estado: false },
          { nombre: 'Match biométrico', estado: false }
        ]
      });
    } else {
      const matchPorcentaje = calcularCoincidencia(caracteristicasVideo, identidad.caracteristicasBiometricas);
      const matchFinal = Math.min(100, matchPorcentaje + (Math.random() * 10 - 5));
      const esExitoso = matchFinal >= 75;
      
      setResultado({
        tipo: esExitoso ? 'exito' : 'rechazo',
        mensaje: esExitoso ? 'IDENTIDAD VERIFICADA' : 'NO COINCIDE',
        match: Math.round(matchFinal),
        identidad: esExitoso ? identidad : null
      });

      setAnalisisBiometrico({
        caracteristicasVideo,
        caracteristicasDB: identidad.caracteristicasBiometricas,
        detalles: [
          { nombre: 'Rostro detectado', estado: true },
          { nombre: 'Cédula en base de datos', estado: true },
          { nombre: 'Match biométrico', estado: matchFinal >= 75 },
          { nombre: 'Calidad de imagen', estado: parseFloat(caracteristicasVideo.calidadImagen) >= 85 },
          { nombre: 'Iluminación adecuada', estado: parseFloat(caracteristicasVideo.iluminacion) >= 75 }
        ]
      });
    }

    setEtapa('resultado');
  };

  const reiniciar = () => {
    setCedula('');
    setEtapa('inicio');
    setVideoActivo(false);
    setProgreso(0);
    setFrames([]);
    setAnalisisBiometrico(null);
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Verificación Biométrica por Video
          </h1>
          <p className="text-gray-300">Sistema avanzado de reconocimiento facial</p>
        </div>

        {etapa === 'inicio' && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-white font-semibold mb-3">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Número de Cédula
                </label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ingresa tu cédula (ej: 1025520829)"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border-2 border-blue-400 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-500 bg-opacity-20 border-2 border-blue-400 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Instrucciones:
                </h3>
                <ul className="text-gray-200 space-y-2 text-sm">
                  <li>✓ Asegúrate de tener buena iluminación</li>
                  <li>✓ Mira directamente a la cámara</li>
                  <li>✓ Mantén el rostro centrado</li>
                  <li>✓ No uses gafas oscuras ni gorras</li>
                  <li>✓ El proceso toma aproximadamente 5 segundos</li>
                </ul>
              </div>

              <button
                onClick={iniciarCaptura}
                disabled={!cedula}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <Camera className="w-6 h-6 mr-2" />
                  Iniciar Captura de Video
                </span>
              </button>

              <div className="mt-8 bg-white bg-opacity-5 rounded-xl p-4">
                <h4 className="text-white font-bold mb-3 text-sm">📋 Cédulas de Prueba:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.values(identidadesDB).map((id) => (
                    <div key={id.cedula} className="bg-white bg-opacity-10 rounded-lg p-2">
                      <span className="text-gray-300">{id.nombre}</span>
                      <div className="text-blue-400 font-mono">{id.cedula}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {etapa === 'capturando' && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Camera className="w-32 h-32 text-white animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 animate-pulse"></div>
                  <div className="absolute inset-0 border-4 border-blue-400 rounded-2xl animate-ping opacity-50"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white">Capturando Video...</h3>
              <p className="text-gray-300">Mantén tu rostro centrado</p>

              <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                ></div>
              </div>

              <div className="text-white text-sm">
                Frames capturados: {frames.length}/10
              </div>
            </div>
          </div>
        )}

        {etapa === 'analizando' && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
            <div className="text-center space-y-6">
              <Brain className="w-24 h-24 text-purple-400 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold text-white">Analizando Biometría...</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Procesando datos faciales</span>
                  <span>{progreso}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                  <Scan className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                  <div className="text-white text-sm">Extrayendo rasgos</div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                  <Fingerprint className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                  <div className="text-white text-sm">Comparando datos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`backdrop-blur-lg rounded-2xl p-8 border-4 ${
              resultado.tipo === 'exito' ? 'bg-green-500 bg-opacity-20 border-green-400' :
              resultado.tipo === 'rechazo' ? 'bg-yellow-500 bg-opacity-20 border-yellow-400' :
              'bg-red-500 bg-opacity-20 border-red-400'
            }`}>
              <div className="text-center space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  resultado.tipo === 'exito' ? 'bg-green-500' :
                  resultado.tipo === 'rechazo' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {resultado.tipo === 'exito' ? (
                    <CheckCircle className="w-20 h-20 text-white" />
                  ) : (
                    <XCircle className="w-20 h-20 text-white" />
                  )}
                </div>

                <h2 className={`text-4xl font-black ${
                  resultado.tipo === 'exito' ? 'text-green-400' :
                  resultado.tipo === 'rechazo' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {resultado.mensaje}
                </h2>

                <div className="bg-white bg-opacity-10 rounded-xl p-6">
                  <div className="text-white text-lg mb-2">Match Biométrico</div>
                  <div className={`text-6xl font-black ${
                    resultado.match >= 75 ? 'text-green-400' :
                    resultado.match >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {resultado.match}%
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-4 mt-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        resultado.match >= 75 ? 'bg-green-500' :
                        resultado.match >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${resultado.match}%` }}
                    ></div>
                  </div>
                </div>

                {resultado.identidad && (
                  <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
                    <h3 className="text-white font-bold mb-4 text-center">Datos Verificados</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Nombre:</span>
                        <span className="text-white font-bold">{resultado.identidad.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cédula:</span>
                        <span className="text-white font-bold">{resultado.identidad.cedula}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Edad:</span>
                        <span className="text-white font-bold">{resultado.identidad.edad} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Ciudad:</span>
                        <span className="text-white font-bold">{resultado.identidad.ciudad}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analisisBiometrico && (
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <h3 className="text-white font-bold mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Análisis Biométrico Detallado
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-blue-400 font-semibold text-sm">Del Video Capturado:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Distancia ojos:</span>
                        <span className="text-white">{analisisBiometrico.caracteristicasVideo.distanciaOjos} cm</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Ancho nariz:</span>
                        <span className="text-white">{analisisBiometrico.caracteristicasVideo.anchoNariz} cm</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Largo boca:</span>
                        <span className="text-white">{analisisBiometrico.caracteristicasVideo.largoBoca} cm</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Forma cara:</span>
                        <span className="text-white capitalize">{analisisBiometrico.caracteristicasVideo.formaCara}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Color ojos:</span>
                        <span className="text-white capitalize">{analisisBiometrico.caracteristicasVideo.colorOjos}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Calidad imagen:</span>
                        <span className="text-white">{analisisBiometrico.caracteristicasVideo.calidadImagen}%</span>
                      </div>
                    </div>
                  </div>

                  {analisisBiometrico.caracteristicasDB && (
                    <div className="space-y-3">
                      <h4 className="text-green-400 font-semibold text-sm">En Base de Datos:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Distancia ojos:</span>
                          <span className="text-white">{analisisBiometrico.caracteristicasDB.distanciaOjos} cm</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Ancho nariz:</span>
                          <span className="text-white">{analisisBiometrico.caracteristicasDB.anchoNariz} cm</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Largo boca:</span>
                          <span className="text-white">{analisisBiometrico.caracteristicasDB.largoBoca} cm</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Forma cara:</span>
                          <span className="text-white capitalize">{analisisBiometrico.caracteristicasDB.formaCara}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Color ojos:</span>
                          <span className="text-white capitalize">{analisisBiometrico.caracteristicasDB.colorOjos}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="text-white font-semibold text-sm mb-3">Verificaciones:</h4>
                  <div className="space-y-2">
                    {analisisBiometrico.detalles.map((detalle, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3">
                        <span className="text-gray-300 text-sm">{detalle.nombre}</span>
                        {detalle.estado ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={reiniciar}
              className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-xl hover:from-gray-800 hover:to-black transition-all"
            >
              Nueva Verificación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
