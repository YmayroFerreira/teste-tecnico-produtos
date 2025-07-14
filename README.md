# Sistema de Gerenciamento de Produtos

Sistema completo para gerenciar produtos com Next.js e NestJS.

## Tecnologias

**Backend:**
- NestJS
- TypeScript  
- SQLite
- TypeORM

**Frontend:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand

## Como Executar

### Backend
```
cd backend
npm install
npm run start:dev
```
Servidor: http://localhost:3001

### Frontend  
```
cd frontend
npm install
npm run dev
```
Aplicação: http://localhost:3000

## Funcionalidades

- Criar produtos
- Listar produtos
- Editar produtos
- Deletar produtos
- Filtrar por nome
- Filtrar por categoria
- Ordenar por preço/nome

## API Endpoints

- GET /products - Lista produtos
- POST /products - Cria produto
- PUT /products/:id - Atualiza produto
- DELETE /products/:id - Deleta produto

## Exemplo de Produto

```json
{
  "nome": "iPhone 15",
  "categoria": "Eletrônicos",
  "descricao": "Smartphone Apple",
  "preco": 3999.99,
  "quantidade_estoque": 10
}
```

## Como Usar

1. Abra http://localhost:3000
2. Clique no botão + para criar produto
3. Preencha o formulário
4. Use os filtros para buscar
5. Clique em Editar para modificar
6. Clique na lixeira para deletar

## Estrutura

```
projeto/
├── backend/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

## Instalação Completa

1. Clone o repositório
2. Entre na pasta backend
3. Execute: npm install
4. Execute: npm run start:dev
5. Abra outro terminal
6. Entre na pasta frontend
7. Execute: npm install
8. Execute: npm run dev
9. Acesse: http://localhost:3000

## Desenvolvido com

- Backend: NestJS + TypeScript + SQLite
- Frontend: Next.js + React + Tailwind CSS
- Estado: Zustand
- Validação: Class Validator
- Ícones: Lucide React
