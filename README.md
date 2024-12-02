# Flavor Forge

**Descrição**: O "Flavor Forge" é uma aplicação full-stack para gerenciar receitas, com funcionalidades de cadastro, listagem e visualização. A aplicação possui autenticação de usuários, 
permitindo o gerenciamento seguro de receitas. O projeto foi desenvolvido com uma arquitetura moderna e robusta, utilizando **Next.js** para o front-end, **Nest.js** para o back-end, **React native**
para mobile e **PostgreSQL** como banco de dados.

## 1. Objetivo do Projeto

O objetivo deste projeto é criar uma plataforma de gerenciamento de receitas culinárias, onde os usuários tem um CRUD completo de receitas. A aplicação oferece um sistema seguro e fácil 
de usar, com autenticação de usuários e uma interface amigável.

Principais funcionalidades:
- **Cadastro e Login de Usuários**: Sistema de autenticação para que os usuários possam ter seu espaço pessoal.
- **Cadastro de Receitas**: Os usuários podem adicionar, editar e visualizar suas receitas.
- **Listagem de Receitas**: As receitas cadastradas são listadas de forma paginada e filtrada.
- **Exclusão Lógica (Soft-Delete)**: As receitas podem ser removidas sem apagar definitivamente os dados.
  
## 2. Design System
O aplicativo foi desenvolvido com a utilização de um **Design System** para garantir uma interface de usuário consistente e de fácil interação. Foi adotada uma **paleta de cores principal**
que proporciona uma identidade visual coesa e agradável. Além disso, foram criados **componentes reutilizáveis**, como botões, formulários e cards, que ajudam a manter o código mais limpo 
e consistente, facilitando a manutenção e expansão do sistema. As **boas práticas de UI/UX** foram aplicadas para melhorar a experiência do usuário, proporcionando uma integração mais 
fluida e intuitiva entre o usuário e o sistema, otimizando a navegação e o uso de funcionalidades.


## 3. Organização das Pastas
O sistema tem 3 pastas principais : api (conteúdo do backend feito em nest) , ui (conteúdo do frontend web feito em next) e mobile (conteúdo mobile feito em react native).

## 4. Funcionalidades Principais e Diferenciais

### Funcionalidades Principais
- **Autenticação de Usuário**: Cadastro, login e proteção de rotas.
- **Gestão de Receitas**: Adicionar, visualizar e excluir receitas.
- **Listagem Paginada**: Exibição de receitas de forma paginada.
- **Exclusão Lógica**: Soft-delete para exclusão de receitas, mantendo a integridade dos dados.
 ![Soft delete](https://github.com/GBruzzi/flavor-forge/blob/main/images/Soft%20delete.png)
- **Modal de receitas**: Exibição de todos os dados das receitas criadas.

### Diferenciais
- **Home Page**: A tela inicial foi cuidadosamente projetada para oferecer uma experiência visual agradável e intuitiva, apresentando informações relevantes sobre o sistema e suas funcionalidades,
- garantindo uma navegação fluída desde o primeiro acesso.
- **JWT (JSON Web Token)**: A autenticação é realizada por meio de tokens JWT, garantindo sessões seguras e protegendo os dados dos usuários, com um sistema de autenticação moderno e eficaz.
- **Exclusão e edição de usuários**: O sistema oferece uma tela dedicada para o gerenciamento completo de usuários, permitindo a edição e exclusão de contas, tudo de forma simples e eficiente.
- **Testes unitários**: A aplicação é equipada com testes unitários abrangentes, assegurando maior confiabilidade e estabilidade, e proporcionando um ambiente robusto para o desenvolvimento contínuo.
- **Aplicação Mobile**: Em resposta ao crescente uso de dispositivos móveis, o sistema conta com uma integração total com a versão mobile desenvolvida em React Native,
- proporcionando aos usuários uma experiência impecável em smartphones.
- **Edição de receitas**: O sistema permite que o usuário edite as receitas previamente cadastradas diretamente no painel principal, facilitando o gerenciamento e a atualização de dados.
- **Ordenação de receitas**: Para otimizar a visualização e facilitar a busca, as receitas podem ser ordenadas por nome, proporcionando uma navegação mais eficiente e personalizada.
- **Proteção de rotas**: O sistema adota uma abordagem robusta de segurança, exigindo que os usuários forneçam um token de acesso para acessar as rotas protegidas (exceto no caso do POST de cadastro de usuário),
- garantindo a integridade dos dados e a proteção das informações sensíveis.

## 5. Decisões de Implementação e Boas Práticas

### Stack de Tecnologias
- **NestJS**: Framework para o back-end, utilizado pela sua modularidade e suporte a TypeScript.
- **PostgreSQL**: Banco de dados relacional utilizado pela sua robustez e desempenho.
- **TypeScript**: Usado em todo o projeto para garantir a segurança da tipagem.
- **TypeOrm**: ORM utilizado para simplificar o gerenciamento de banco de dados.
- **React Native**: Framework utilizado para desenvolvimento do aplicativo mobile.
- **Tailwind**: Framework de estilização dos componentes. 

### Boas Práticas
- **Modularização**: O código é organizado em módulos independentes, facilitando manutenção e escalabilidade.
- **Validação de Dados**: Uso de `class-validator` para garantir que os dados de entrada sejam válidos.
- **Tratamento de Erros**: Implementação de filtros de exceção personalizados para um gerenciamento eficiente de erros.
- **Código limpo**: Código organizado e autoleiturável, projetado para ser claro e compreensível sem a necessidade de muitos comentários, alinhado aos princípios da Clean Architecture.
- **Teste de rotas no Insomnia**: Visando maior testabilidade da aplicação, as rotas foram testas no insomnia .
- **Armazenamento de senha criptografadas**: Para maior segurança de dados dos usuários, as senhas são armazenadas no banco criptografadas via bcrypt .
![Insomnia](https://github.com/GBruzzi/flavor-forge/blob/main/images/insomnia.png)
