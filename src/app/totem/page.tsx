'use client';

import { useState } from 'react';
import { toolImplementations } from '../toolLogic/totemTools';

export default function TotemPage() {
  const [status, setStatus] = useState('Clique para iniciar');
  const [messages, setMessages] = useState<string[]>([]);

  const handleClick = async () => {
    setStatus('Sistema ativo');
    setMessages(['Assistente: Olá! Bem-vindo ao supermercado. Como posso ajudar?']);
  };

  const testCommand = async (command: string, userMessage: string) => {
    setMessages(prev => [...prev, `Cliente: ${userMessage}`]);
    
    if (command === 'produto') {
      const result = await toolImplementations.buscar_produto({ nome: 'leite' });
      setMessages(prev => [...prev, `Assistente: ${result}`]);
    } else if (command === 'promocao') {
      const result = await toolImplementations.listar_promocoes({});
      setMessages(prev => [...prev, `Assistente: ${result}`]);
    } else if (command === 'receita') {
      const result = await toolImplementations.sugerir_receita({ 
        ingredientes: ['arroz', 'feijão', 'óleo'] 
      });
      setMessages(prev => [...prev, `Assistente: ${result}`]);
    } else if (command === 'atendente') {
      const result = await toolImplementations.chamar_atendente({ 
        motivo: 'Solicitado pelo cliente' 
      });
      setMessages(prev => [...prev, `Assistente: ${result}`]);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Totem de Atendimento - Supermercado
        </h1>
        
        <div className="bg-white/20 rounded-lg p-6 mb-8">
          <p className="text-2xl text-center mb-4">{status}</p>
          <button 
            onClick={handleClick}
            className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-lg text-xl font-semibold"
          >
            Iniciar Atendimento
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => testCommand('produto', 'Onde fica o leite?')}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg"
          >
            Buscar Produto
          </button>
          <button 
            onClick={() => testCommand('promocao', 'Quais as promoções?')}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg"
          >
            Ver Promoções
          </button>
          <button 
            onClick={() => testCommand('receita', 'Me sugira uma receita')}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg"
          >
            Sugerir Receita
          </button>
          <button 
            onClick={() => testCommand('atendente', 'Preciso de ajuda')}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-lg"
          >
            Chamar Atendente
          </button>
        </div>

        {messages.length > 0 && (
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Conversa:</h2>
            {messages.map((msg, idx) => (
              <p key={idx} className="mb-2">{msg}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}