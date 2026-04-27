# webFinanceiro

Frontend Angular 21 do sistema **AppFinancas** — controle financeiro pessoal com dark theme.

## Tecnologias

- Angular 21 (Standalone Components, Signals)
- TypeScript 5
- SCSS (dark theme customizado)
- JWT Auth com interceptor HTTP
- Lazy loading por rota

## Estrutura de Páginas

| Rota | Componente | Descrição |
|---|---|---|
| `/login` | LoginComponent | Autenticação email/senha |
| `/register` | RegisterComponent | Cadastro (requer aprovação admin) |
| `/home` | DashboardComponent | Resumo financeiro com cards e alertas |
| `/balanco` | BalancoComponent | Balanço 2026 detalhado (tabs) |
| `/lancamentos` | LancamentosComponent | CRUD completo de lançamentos |
| `/entradas` | EntradasComponent | CRUD de entradas/receitas |
| `/despesas` | DespesasComponent | CRUD de despesas |
| `/salario` | SalarioComponent | Cadastro e histórico de salários |
| `/admin` | AdminComponent | Aprovação de usuários (admin only) |

## Setup

```bash
npm install
ng serve            # http://localhost:4200
ng build            # dist/webFinanceiro
```

## Variáveis de Ambiente

| Arquivo | apiUrl |
|---|---|
| `src/environments/environment.ts` | `http://localhost:8080` |
| `src/environments/environment.prod.ts` | `http://76.13.69.127:8080` |

## Autenticação

- JWT armazenado em `localStorage` com chave `fn_jwt`
- Interceptor HTTP injeta `Authorization: Bearer <token>` em todas as requisições
- `authGuard`: protege rotas autenticadas (redireciona para `/login`)
- `adminGuard`: restringe rota `/admin` apenas a administradores

## API Backend

Aponta para **AppFinancas** (.NET 9 + PostgreSQL).
Documentação Swagger: `http://localhost:8080/swagger`

## Menu lateral (Navbar)

- Expansível: 220px (completo) ↔ 60px (somente ícones)
- Responsivo: oculto em mobile com botão de abertura
- Links: Home, Balanço 2026, Lançamentos, Entradas, Despesas, Salário, Admin
# Pipeline: commit → Jenkins → Deploy automático
