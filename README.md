# Forno & Festa — Pizzaria e Eventos

Projeto acadêmico de front-end para estudo de desenvolvimento web. A interface é responsiva e usa HTML, CSS e JavaScript puro, sem necessidade de instalar dependências.

## Funcionalidades demonstrativas

- Página inicial com apresentação da pizzaria e cardápio.
- Cadastro com validação básica de campos, confirmação de senha e verificação de e-mail duplicado no navegador.
- Login para contas cadastradas e botão de acesso em modo demonstração.
- Painel administrativo com navegação por seções.
- Cardápio administrativo com botão **Registrar venda**; cada clique grava uma venda fictícia no navegador.
- Cadastro de reservas de eventos com nome, data, horário, convidados, tipo e observações.
- Relatório com faturamento acumulado, ticket médio, pizza mais registrada, gráfico dos últimos sete dias e exportação CSV.
- Dados de demonstração criados na primeira abertura do painel.

## Estrutura dos arquivos

```text
forno-festa-academico/
├── index.html
├── cadastro.html
├── login.html
├── sistema.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        └── dashboard.js
```

## Como executar localmente

1. Extraia o arquivo ZIP.
2. Abra `index.html` no navegador. Para desenvolvimento, recomenda-se usar a extensão **Live Server** no Visual Studio Code.
3. Crie uma conta na tela Cadastro e entre pela tela Login, ou use **Entrar no modo demonstração**.
4. No painel, abra **Cardápio** e clique em **Registrar venda** para alterar os valores do relatório.
5. Abra **Reservas de eventos** e salve uma reserva de teste. Confira como ela aparece na lista e no resumo.
6. Em **Relatórios**, teste a opção **Exportar vendas em CSV**.

Os cadastros, vendas e reservas ficam no `localStorage` do navegador. Eles não são sincronizados entre aparelhos e podem ser apagados ao limpar os dados do navegador. A sessão de login usa `sessionStorage` e termina ao sair ou fechar a sessão do navegador.

## Publicar gratuitamente no GitHub Pages

1. Entre em [github.com](https://github.com/) e crie um repositório chamado `forno-festa-academico` (pode ser público).
2. Envie o conteúdo desta pasta para a **raiz** do repositório, preservando a pasta `assets`.
3. No repositório, acesse **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/ (root)`; clique em **Save**.
6. Aguarde a publicação e abra o endereço apresentado na área do GitHub Pages. A página inicial deve ser `index.html`.

### Atualizar o projeto

Edite os arquivos no computador, teste no navegador e envie as alterações ao GitHub. O Pages publica novamente as alterações após o processamento.

## Limitações e segurança

Este é um **protótipo acadêmico**. O login de exemplo salva senhas sem hash no armazenamento do navegador, portanto não é apropriado para contas reais. Não há backend, banco de dados remoto, controle real de permissões, pagamento, envio de pedidos à cozinha ou confirmação automática de eventos. Os pedidos e as reservas são registros locais para demonstrar a lógica da interface. Para uma aplicação real, será necessário backend, banco de dados, validação no servidor, hash seguro de senhas, controle de sessão e políticas de privacidade.

## Sugestão de apresentação do trabalho

1. Apresente o problema: organizar cardápio, vendas e eventos de uma pizzaria.
2. Mostre as páginas públicas e o fluxo de cadastro/login.
3. Registre uma venda demonstrativa e explique como o relatório é atualizado.
4. Cadastre uma reserva e mostre a lista de eventos.
5. Explique a estrutura HTML/CSS/JavaScript e as limitações do armazenamento local.
