# Sistema-de-Aluguel-de-Carros

Link deploy: https://sistema-de-aluguel-de-carros-production.up.railway.app

## Descrição

Este projeto consiste no desenvolvimento de um Sistema Aluguel de Carros web desenvolvido em Java, seguindo a arquitetura MVC, para apoiar a gestão de pedidos e contratos de aluguel.

## Integrantes

- Breno de Oliveira Brandão
- Nicolas Almeida Prado da Silva
- Pedro Augusto Santos Seabra

## Professor

- João Paulo Carneiro Aramuni

## Tecnologias

<img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg" /> <img width="60px" height="60px" src="https://cdn.simpleicons.org/drizzle" /> <img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" /> <img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" />
<img width="60px" height="60px" src="https://railway.app/brand/logo-dark.svg" />

- Svelte
- Drizzle ORM
- PostgreSQL
- TailwindCSS
- Railway (DEPLOY)

## Deploy

Deploy foi realizado na plataforma Railway

## Estrutura de diretórios do projeto

```
src/
  app.html
  app.css
  routes/
    +layout.svelte   ← layout base (header/nav/main/footer)
    +page.svelte     ← landing page
    /(auth)
      /login ← Realizar login
      /signup ← Realizar cadastro
      /finalizar-cadastro ← Página pra cliente terminar registro de suas informações (CPF, RG, endereço, etc...) após sign up
    /(authenticated) ← Rota após usuario estar autenticado
      /customer
         /solicitar ← Rota pra cliente solicitar pedido
         /pedidos ← Rota pra cliente visualizar seus pedidos
      /admin
         /clientes ← Rota pra administrador gerenciar os clientes
         /pedidos ← Rota pra administrador gerenciar status dos pedidos
  lib/

```

## Instruções de instalação e execução local

1. Clonar o repositório
2. Instalar dependências
   - `cd codigo`
   - `npm install`
3. Ambiente de desenvolvimento
   - `npm run dev`

## Arquitetura

- Nosso software foi desenvolvido seguindo o padrão MVC (Model-View-Controller), uma arquitetura que garante organização, escalabilidade e clareza no código.
  Esse modelo permite separar de forma elegante as responsabilidades: o Model concentra as regras de negócio e os dados, a View cuida da experiência visual do usuário e o Controller atua como intermediário inteligente entre ambos.
