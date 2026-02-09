# 🎨 Guia de Implementação - Scanner PDF Frontend

## 📁 Arquivos Criados

Todos os arquivos necessários estão em `/frontend_files/`:

1. **ScannerPDF.tsx** - Componente principal
2. **dashboard-page-updated.tsx** - Dashboard atualizado
3. **CotacaoForm-props-update.tsx** - Props para atualização
4. **api-pdf-extension.ts** - Extensão da API

---

## 🚀 Como Implementar no Seu Projeto Next.js

### Passo 1: Criar Projeto Next.js (se ainda não criou)

```bash
cd "/Users/helciomattos/Desktop/HUMANO SAUDE SITE"
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd frontend
```

### Passo 2: Instalar ShadcnUI

```bash
npx shadcn-ui@latest init
```

Escolha:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### Passo 3: Instalar Componentes Necessários

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add label
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress
npm install lucide-react
```

### Passo 4: Criar Estrutura de Pastas

```bash
mkdir -p app/components
mkdir -p app/services
mkdir -p app/dashboard
```

### Passo 5: Copiar Arquivos

#### 1. **ScannerPDF.tsx**
Copie o conteúdo de `frontend_files/ScannerPDF.tsx` para:
```
app/components/ScannerPDF.tsx
```

#### 2. **Atualizar api.ts**
Adicione ao arquivo `app/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PDFExtraido {
  idades: number[];
  operadora: string | null;
  valor_atual: number | null;
  tipo_plano: string | null;
  nome_beneficiarios: string[];
  observacoes: string | null;
  confianca: string;
  texto_extraido_preview: string | null;
  total_caracteres: number;
}

// Adicione ao objeto apiService existente:
export const apiService = {
  // ... métodos existentes ...

  async extrairPDF(file: File): Promise<PDFExtraido> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/pdf/extrair`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao extrair dados do PDF');
    }

    return response.json();
  },
};
```

#### 3. **Atualizar CotacaoForm.tsx**

Adicione as props ao componente:

```typescript
interface CotacaoFormProps {
  onCalculate: (result: any) => void;
  onLoading: (loading: boolean) => void;
  idadesIniciais?: number[];
  operadoraInicial?: string;
  tipoInicial?: string;
}

export default function CotacaoForm({ 
  onCalculate, 
  onLoading,
  idadesIniciais = [],
  operadoraInicial = '',
  tipoInicial = 'ADESAO'
}: CotacaoFormProps) {
  // ... código existente ...

  // Adicione estes useEffects:
  useEffect(() => {
    if (idadesIniciais && idadesIniciais.length > 0) {
      setIdades(idadesIniciais.map(String));
    }
  }, [idadesIniciais]);

  useEffect(() => {
    if (operadoraInicial) {
      setOperadora(operadoraInicial);
    }
  }, [operadoraInicial]);

  useEffect(() => {
    if (tipoInicial) {
      setTipo(tipoInicial);
    }
  }, [tipoInicial]);

  // ... resto do código ...
}
```

#### 4. **Atualizar Dashboard**

Substitua `app/dashboard/page.tsx` com o conteúdo de `frontend_files/dashboard-page-updated.tsx`

### Passo 6: Criar Arquivo .env.local

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

---

## 🎯 Fluxo de Funcionamento

```
1. Usuário faz upload do PDF
   ↓
2. ScannerPDF valida arquivo (tipo e tamanho)
   ↓
3. Envia para backend: POST /api/v1/pdf/extrair
   ↓
4. Backend processa com IA (GPT-4o-mini)
   ↓
5. Retorna dados estruturados
   ↓
6. ScannerPDF notifica Dashboard via callback
   ↓
7. Dashboard preenche CotacaoForm automaticamente
   ↓
8. Usuário pode ajustar e calcular cotação
```

---

## 🎨 Recursos do Componente

### ScannerPDF.tsx

✅ **Drag and Drop** - Arraste e solte PDFs  
✅ **Upload por botão** - Clique para selecionar  
✅ **Validação** - Tipo (.pdf) e tamanho (10MB)  
✅ **Progress bar** - Indica progresso  
✅ **Loading states** - Feedback visual  
✅ **Mensagens de erro** - Clear error messages  
✅ **Mensagens de sucesso** - Mostra dados extraídos  
✅ **Reset** - Botão para novo upload  
✅ **Observações** - Exibe informações adicionais  
✅ **Integração** - Callback para Dashboard  

---

## 🧪 Testando

### 1. Iniciar Backend

```bash
cd backend
source venv/bin/activate
python main.py
```

Backend estará em: `http://localhost:8000`

### 2. Iniciar Frontend

```bash
cd frontend
npm run dev
```

Frontend estará em: `http://localhost:3000`

### 3. Testar Fluxo

1. Acesse: `http://localhost:3000/dashboard`
2. Faça upload de um PDF de apólice
3. Aguarde processamento
4. Veja dados extraídos
5. Formulário será preenchido automaticamente
6. Ajuste se necessário
7. Clique em "Calcular Cotação"

---

## 🎨 Personalização

### Cores e Estilos

O componente usa as classes do Tailwind CSS e tokens do ShadcnUI:

```tsx
// Alterar cor primária
className="border-primary bg-primary/5"

// Alterar espaçamento
className="space-y-4 p-8"

// Alterar tamanho
className="h-12 w-12"
```

### Tamanho Máximo do Arquivo

```typescript
const maxSize = 10 * 1024 * 1024; // 10MB
```

### URL da API

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

---

## 🔧 Solução de Problemas

### Erro: "Cannot find module 'react'"
```bash
npm install react react-dom @types/react @types/react-dom
```

### Erro: "Cannot find module '@/components/ui/card'"
```bash
npx shadcn-ui@latest add card
```

### Erro: CORS no Backend
O backend já está configurado com CORS. Verifique se está rodando.

### PDF não está sendo processado
1. Verifique se o backend está rodando
2. Verifique se a chave OpenAI está no `.env`
3. Verifique o console do navegador para erros

---

## 📊 Exemplo de Dados Retornados

```json
{
  "idades": [30, 28, 5],
  "operadora": "AMIL",
  "valor_atual": 1250.50,
  "tipo_plano": "ADESAO",
  "nome_beneficiarios": ["João Silva", "Maria Silva", "Pedro Silva"],
  "observacoes": "Plano com cobertura nacional",
  "confianca": "alta",
  "texto_extraido_preview": "PROPOSTA DE ADESÃO...",
  "total_caracteres": 2543
}
```

---

## 🚀 Próximos Passos

- [ ] Adicionar preview do PDF
- [ ] Suporte a múltiplos PDFs
- [ ] Histórico de uploads
- [ ] Comparação de apólices
- [ ] Export de dados
- [ ] OCR para PDFs escaneados

---

## 📚 Documentação de Referência

- [Next.js 14 Docs](https://nextjs.org/docs)
- [ShadcnUI Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**🏥 Humano Saúde - Frontend com Scanner de PDF integrado com IA**
