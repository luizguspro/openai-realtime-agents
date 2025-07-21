export const buscar_produto = async ({ nome }: { nome: string }) => {
  // Base de dados mock
  const produtos: Record<string, any> = {
    'leite': { nome: 'Leite Integral', corredor: 3, prateleira: 'B', preco: 4.50 },
    'pão': { nome: 'Pão Francês', corredor: 1, prateleira: 'A', preco: 8.00 },
    'arroz': { nome: 'Arroz 5kg', corredor: 5, prateleira: 'C', preco: 22.90 }
  };
  
  const produto = produtos[nome.toLowerCase()];
  if (!produto) return { encontrado: false, mensagem: 'Produto não encontrado' };
  
  return {
    encontrado: true,
    ...produto,
    mensagem: `${produto.nome} está no corredor ${produto.corredor}, prateleira ${produto.prateleira}. Preço: R$ ${produto.preco}`
  };
};

export const listar_promocoes = async () => {
  return {
    promocoes: [
      'Leite 20% de desconto',
      'Pão francês - Leve 10 pague 8',
      'Café 15% de desconto'
    ]
  };
};