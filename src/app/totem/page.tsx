'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceOrb from '../components/VoiceOrb';
import Image from 'next/image';

export default function TotemPage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    // Redireciona para o app principal com o agente correto
    const params = new URLSearchParams();
    params.set('agentConfig', 'totemMercado');
    
    // Abre em uma janela invisível para manter a conexão
    const appWindow = window.open(
      `/?${params.toString()}`,
      'realtime-app',
      'width=1,height=1,left=-1000,top=-1000'
    );

    // Simula estados (em produção, isso viria via postMessage)
    setTimeout(() => setIsConnected(true), 2000);
    
    // Cleanup
    return () => {
      if (appWindow) appWindow.close();
    };
  }, []);

  // Simula conversação
  const startConversation = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
        setShowProducts(true);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex flex-col items-center justify-center p-8">
      {/* Logo Lacta */}
      <div className="absolute top-8 left-8">
        <h1 className="text-white text-4xl font-bold">Lacta</h1>
        <p className="text-purple-200">Assistente Virtual</p>
      </div>

      {/* Orb Container */}
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <VoiceOrb 
            isListening={isListening}
            isSpeaking={isSpeaking}
            isConnected={isConnected}
          />
        </div>

        {/* Start button */}
        {isConnected && !isListening && !isSpeaking && (
          <button
            onClick={startConversation}
            className="px-8 py-4 bg-white text-purple-700 rounded-full font-semibold text-xl hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Falar com Marina
          </button>
        )}
      </div>

      {/* Products showcase */}
      {showProducts && (
        <div className="absolute bottom-8 left-0 right-0 px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white text-xl mb-4">Promoções de Hoje:</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <p className="text-white font-bold">Bis</p>
                <p className="text-purple-200">3 por R$ 9,00</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <p className="text-white font-bold">Diamante Negro</p>
                <p className="text-purple-200">R$ 5,90</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <p className="text-white font-bold">Sonho de Valsa</p>
                <p className="text-purple-200">R$ 12,90</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}