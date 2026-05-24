# RastrIA Landing Page

Este é o projeto da Landing Page do **RastrIA**, um sistema inteligente de gestão de frotas. 

O projeto foi construído utilizando:
- **Framework:** [Astro](https://astro.build/)
- **Estilização:** CSS Puro (sem frameworks de CSS)
- **Ícones:** Lucide (SVGs inline)
- **Tema:** Suporte a Dark/Light mode com persistência local.

## 🚀 Como executar o projeto

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Desenvolvimento
Para iniciar o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

O site estará disponível em `http://localhost:4321`.

### Build para Produção
Para gerar a versão otimizada para produção:

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

## 📁 Estrutura do Projeto

- `src/layouts/Layout.astro`: Layout base com lógica de tema e variáveis CSS.
- `src/components/`: Componentes modulares (Hero, Features, HowItWorks, etc).
- `src/pages/index.astro`: Página principal da Landing Page.
- `public/`: Arquivos estáticos (imagens, favicon, etc).
