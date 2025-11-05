# 💰 Finance App - Projeto Engenharia 2

Aplicação completa de controle financeiro com backend Flask (Python) e frontend React Native/Expo.

## 🏗️ Arquitetura do Projeto

```
Projeto_ENG_2/
├── main.py                 # Backend Flask API
├── requirements.txt        # Dependências Python
├── package.json           # Scripts e configurações principais
├── .env                   # Variáveis de ambiente
└── FinanceApp/            # Frontend React Native/Expo
    ├── App.tsx            # Componente principal
    ├── package.json       # Dependências do frontend
    └── src/
        ├── context/       # Gerenciamento de estado
        ├── screens/       # Telas da aplicação
        └── services/      # Serviços de API
```

## 🚀 Setup do Projeto

### Pré-requisitos
- Python 3.8+
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### 1. Clone e Configure o Ambiente

```bash
# Navegue para o diretório do projeto
cd "c:\Users\agric\OneDrive\Área de Trabalho\01-Henrique\project-portfolio\Projeto_ENG_2"

# Configure o ambiente virtual Python (recomendado)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Instale as dependências Python
pip install -r requirements.txt

# Instale as dependências Node.js
npm install
cd FinanceApp
npm install
cd ..
```

### 2. Configuração Automática (Alternativa)

```bash
# Use o script de setup automático
npm run setup
```

## 🎯 Como Executar

### Opção 1: Executar Backend e Frontend Separadamente

**Terminal 1 - Backend Flask:**
```bash
npm run start:backend
# ou diretamente: python main.py
```

**Terminal 2 - Frontend React Native:**
```bash
npm run start:frontend
# ou: cd FinanceApp && npm start
```

### Opção 2: Executar Tudo Junto (Recomendado)

```bash
npm run start:dev
```

## 📱 Como Testar a Aplicação

### Frontend (React Native/Expo)
1. Após executar `npm run start:frontend`, o Expo iniciará
2. **Para testar no navegador web:** Pressione `w` no terminal
3. **Para testar no celular:** Instale o app "Expo Go" e escaneie o QR code
4. **Para testar em emulador:** Pressione `a` (Android) ou `i` (iOS)

### Backend (API Flask)
- A API estará disponível em: `http://localhost:5000`
- Teste o status: `http://localhost:5000/api/status`
- Documentação das rotas abaixo ⬇️

## 🛠️ API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário

### Transações
- `GET /api/transactions` - Listar todas as transações
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Relatórios
- `GET /api/summary` - Resumo financeiro e categorias

### Sistema
- `GET /api/status` - Status da API

## 🎨 Funcionalidades

### ✅ Implementadas
- **Autenticação:** Tela de login (simulada)
- **Transações:** CRUD completo (Criar, Ler, Atualizar, Deletar)
- **Relatórios:** Gráficos e resumos financeiros
- **API REST:** Backend Flask com CORS configurado
- **Interface Responsiva:** Funciona em web, iOS e Android

### 🔄 Próximas Implementações
- Banco de dados real (SQLite/PostgreSQL)
- Autenticação JWT real
- Categorias personalizáveis
- Exportação de relatórios
- Notificações push

## 🧪 Scripts Disponíveis

```bash
# Instalar todas as dependências
npm run setup

# Executar backend Flask
npm run start:backend

# Executar frontend React Native
npm run start:frontend

# Executar ambos simultaneamente
npm run start:dev

# Instalar dependências (backend + frontend)
npm run install:all
```

## 🐛 Troubleshooting

### Problema: Erro de CORS
**Solução:** Certifique-se que o backend Flask está rodando na porta 5000

### Problema: Dependências web não instaladas
**Solução:** Execute no diretório FinanceApp:
```bash
npx expo install react-dom react-native-web
```

### Problema: Metro Bundler não inicia
**Solução:** Limpe o cache:
```bash
cd FinanceApp
npx expo start --clear
```

## 📊 Estrutura dos Dados

### Transação
```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number; // Positivo: receita, Negativo: despesa
  category: string;
  date: string; // Formato: YYYY-MM-DD
}
```

### Resumo Financeiro
```typescript
interface FinancialSummary {
  revenues: number;
  expenses: number;
  balance: number;
  categories: Record<string, number>;
}
```

## 🔧 Configurações

### Variáveis de Ambiente (.env)
- `FLASK_ENV`: Ambiente do Flask (development/production)
- `PORT`: Porta do backend (padrão: 5000)
- `EXPO_PUBLIC_API_URL`: URL base da API para o frontend

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido para o Projeto de Engenharia 2** 🎓