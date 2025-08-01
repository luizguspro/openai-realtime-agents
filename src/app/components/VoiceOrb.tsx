import React, { useEffect, useRef } from 'react';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
}

export default function VoiceOrb({ isListening, isSpeaking, isConnected }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Glow effect
      if (isConnected) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
        
        if (isSpeaking) {
          // Purple glow when speaking
          gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        } else if (isListening) {
          // Blue glow when listening
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
          // Soft purple idle
          gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Main orb
      const baseRadius = 80;
      const pulseAmount = isSpeaking ? 20 : (isListening ? 10 : 5);
      const radius = baseRadius + Math.sin(time) * pulseAmount;
      
      // Orb gradient
      const orbGradient = ctx.createRadialGradient(
        centerX - 20, centerY - 20, 0,
        centerX, centerY, radius
      );
      
      if (!isConnected) {
        orbGradient.addColorStop(0, '#6b7280');
        orbGradient.addColorStop(1, '#374151');
      } else if (isSpeaking) {
        orbGradient.addColorStop(0, '#c084fc');
        orbGradient.addColorStop(1, '#7c3aed');
      } else if (isListening) {
        orbGradient.addColorStop(0, '#60a5fa');
        orbGradient.addColorStop(1, '#2563eb');
      } else {
        orbGradient.addColorStop(0, '#a78bfa');
        orbGradient.addColorStop(1, '#8b5cf6');
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = orbGradient;
      ctx.fill();
      
      // Inner light
      ctx.beginPath();
      ctx.arc(centerX - 20, centerY - 20, radius / 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      
      // Sound waves when speaking
      if (isSpeaking) {
        for (let i = 0; i < 3; i++) {
          const waveRadius = radius + 30 + (i * 20) + (Math.sin(time - i) * 10);
          const opacity = 0.3 - (i * 0.1);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [isListening, isSpeaking, isConnected]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full"
      />
      
      {/* Status text */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className="text-lg font-medium text-gray-700">
          {!isConnected && "Desconectado"}
          {isConnected && !isListening && !isSpeaking && "Pronta para ajudar"}
          {isListening && "Ouvindo..."}
          {isSpeaking && "Marina está falando"}
        </p>
      </div>
    </div>
  );
}