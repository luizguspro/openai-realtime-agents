// Base de dados mock para testes locais
interface Produto {
  nome: string;
  corredor: number;
  prateleira: string;
  preco: number;
  estoque: number;
}

interface Promocao {
  produto: string;
  desconto: string;
  categoria: string;
}

interface Receita {
  nome: string;
  ingredientes: string[];
  preparo: string;
}

const PRODUTOS_DB: Record<string, Produto> = {
  'leite': { nome: 'Leite Integral', corredor: 3, prateleira: 'B', preco: 4.50, estoque: 120 },
  'pão': { nome: 'Pão Francês', corredor: 1, prateleira: 'A', preco: 0.50, estoque: 200 },
  'arroz': { nome: 'Arroz Branco 5kg', corredor: 5, prateleira: 'C', preco: 22.90, estoque: 45 },
  'feijão': { nome: 'Feijão Carioca 1kg', corredor: 5, prateleira: 'C', preco: 8.90, estoque: 60 },
  'café': { nome: 'Café Torrado 500g', corredor: 4, prateleira: 'A', preco: 15.90, estoque: 80 },
  'açúcar': { nome: 'Açúcar Cristal 5kg', corredor: 4, prateleira: 'B', preco: 19.90, estoque: 55 },
  'óleo': { nome: 'Óleo de Soja', corredor: 5, prateleira: 'D', preco: 7.90, estoque: 90 },
  'macarrão': { nome: 'Macarrão Espaguete', corredor: 5, prateleira: 'B', preco: 4.90, estoque: 150 },
  'molho': { nome: 'Molho de Tomate', corredor: 5, prateleira: 'B', preco: 3.50, estoque: 100 },
  'queijo': { nome: 'Queijo Mussarela', corredor: 2, prateleira: 'A', preco: 35.90, estoque: 30 },
  'presunto': { nome: 'Presunto Cozido', corredor: 2, prateleira: 'A', preco: 32.90, estoque: 25 },
  'manteiga': { nome: 'Manteiga 200g', corredor: 2, prateleira: 'B', preco: 12.90, estoque: 40 },
  'ovos': { nome: 'Ovos Brancos Dúzia', corredor: 2, prateleira: 'C', preco: 9.90, estoque: 60 },
  'frango': { nome: 'Frango Congelado', corredor: 7, prateleira: 'A', preco: 15.90, estoque: 50 },
  'carne': { nome: 'Carne Bovina', corredor: 7, prateleira: 'B', preco: 45.90, estoque: 30 }
};

const PROMOCOES_DB: Promocao[] = [
  { produto: 'Leite Integral', desconto: '20%', categoria: 'laticínios' },
  { produto: 'Pão Francês', desconto: 'Leve 10 pague 8', categoria: 'padaria' },
  { produto: 'Café Torrado', desconto: '15%', categoria: 'mercearia' },
  { produto: 'Frango Congelado', desconto: 'R$ 12,90/kg', categoria: 'carnes' }
];

const RECEITAS_DB: Receita[] = [
  {
    nome: 'Macarrão à Bolonhesa',
    ingredientes: ['macarrão', 'molho', 'carne'],
    preparo: 'Cozinhe o macarrão, refogue a carne moída e misture com molho'
  },
  {
    nome: 'Café com Leite',
    ingredientes: ['café', 'leite', 'açúcar'],
    preparo: 'Prepare o café, aqueça o leite e misture com açúcar a gosto'
  },
  {
    nome: 'Arroz com Feijão',
    ingredientes: ['arroz', 'feijão', 'óleo'],
    preparo: 'Cozinhe o arroz e o feijão separadamente, tempere e sirva'
  },
  {
    nome: 'Sanduíche Natural',
    ingredientes: ['pão', 'queijo', 'presunto'],
    preparo: 'Monte o sanduíche com pão, queijo e presunto'
  }
];

// Tipagem das funções
interface ToolImplementations {
  buscar_produto: (params: { nome: string }) => Promise<string>;
  listar_promocoes: (params: { categoria?: string }) => Promise<string>;
  sugerir_receita: (params: { ingredientes: string[] }) => Promise<string>;
  chamar_atendente: (params: { motivo: string }) => Promise<string>;
}

// Implementação das ferramentas
export const toolImplementations: ToolImplementations = {
  buscar_produto: async ({ nome }: { nome: string }): Promise<string> => {
    const produtoKey = nome.toLowerCase();
    const produto = PRODUTOS_DB[produtoKey];
    
    if (!produto) {
      // Busca parcial
      const encontrados = Object.entries(PRODUTOS_DB)
        .filter(([key, prod]) => 
          key.includes(produtoKey) || prod.nome.toLowerCase().includes(produtoKey)
        )
        .map(([_, prod]) => prod.nome);
      
      if (encontrados.length > 0) {
        return `Encontrei: ${encontrados.join(', ')}. Qual você procura?`;
      }
      return 'Produto não encontrado. Posso chamar um atendente para ajudar?';
    }
    
    return `${produto.nome} - Corredor ${produto.corredor}, Prateleira ${produto.prateleira}. Preço: R$ ${produto.preco}${produto.estoque < 20 ? ' (Últimas unidades!)' : ''}`;
  },

  listar_promocoes: async ({ categoria }: { categoria?: string }): Promise<string> => {
    let promocoes = PROMOCOES_DB;
    
    if (categoria) {
      promocoes = promocoes.filter(p => p.categoria === categoria.toLowerCase());
    }
    
    if (promocoes.length === 0) {
      return 'Não há promoções nesta categoria hoje.';
    }
    
    const lista = promocoes
      .map(p => `${p.produto}: ${p.desconto}`)
      .join(', ');
    
    return `Promoções de hoje: ${lista}`;
  },

  sugerir_receita: async ({ ingredientes }: { ingredientes: string[] }): Promise<string> => {
    const ingredientesLower = ingredientes.map(i => i.toLowerCase());
    
    const receitasPossiveis = RECEITAS_DB.filter(receita =>
      receita.ingredientes.every(ing => 
        ingredientesLower.some(i => i.includes(ing) || ing.includes(i))
      )
    );
    
    if (receitasPossiveis.length === 0) {
      return 'Não encontrei receitas com esses ingredientes. Quer ver o que mais temos no mercado?';
    }
    
    const receita = receitasPossiveis[0];
    return `Que tal ${receita.nome}? ${receita.preparo}`;
  },

  chamar_atendente: async ({ motivo }: { motivo: string }): Promise<string> => {
    console.log(`[TOTEM] Chamando atendente - Motivo: ${motivo}`);
    
    // Em produção, isso enviaria uma notificação real
    return 'Atendente foi notificado e chegará em instantes. Aguarde no local.';
  }
};