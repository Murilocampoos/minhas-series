# 📺 Minhas Séries

## 📑 Sobre o Projeto

Aplicativo mobile desenvolvido para o gerenciamento de séries, permitindo o cadastro de títulos, plataforma de streaming, quantidade de temporadas assistidas e avaliação por estrelas. O sistema permite filtrar o catálogo entre séries em andamento e concluídas, garantindo a persistência local de todos os dados no dispositivo.

Este projeto prático consolida a aplicação de componentes nativos, gerenciamento de estado avançado e estruturação de dados através do Repository Pattern.

## 🖥️ Tecnologias Utilizadas

- **React Native & Expo:** Estrutura base de componentes e ambiente de execução.
- **Expo Router:** Navegação em pilha (Stack) baseada no sistema de arquivos.
- **SQLite (`expo-sqlite`):** Persistência de dados local (SDK 57) utilizando modo WAL.
- **NativeWind (Tailwind CSS):** Estilização de interface via classes utilitárias.
- **TypeScript:** Tipagem estrita de entidades, inputs e filtros.

## ⚙️ Como Executar

1. Instale as dependências essenciais do projeto:

```bash
   npm install
```

2. Inicie o servidor do Expo limpando o cache (necessário para processar o CSS do NativeWind corretamente):

```bash
   npx expo start -c
```

3. Abra o aplicativo **Expo Go** no seu smartphone e escaneie o QR Code exibido no terminal.

## 📸 Teste de Persistência (Etapa 8)

Abaixo estão as capturas de tela demonstrando que os dados e o estado dos filtros permanecem intactos após o encerramento e reabertura do aplicativo.
### Página Inicial
> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/66a0d5c4-bcf9-4cf0-aa13-d28e7da2fa58" />

## Cadastrar nova Série
> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/07d1c44e-f220-477d-9b9b-f2e1f616a1ac" />

### Filtros
> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/b5fb36ea-5862-42ed-8b76-a1e261a8848f" />

> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/0ad0f437-7735-40f1-8f39-06ed7d68935d" />

### Detalhes da Série
> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/fbf96c38-9e3b-488e-8727-07515bcecb50" />

### Confirmação de exclusão
> <img width="195" height="434" alt="image" src="https://github.com/user-attachments/assets/672f8f08-3d7a-4eb6-bfbe-f82ab64ab554" />


## 🤖 Diário do copiloto

### Registro 1 — Etapa 5 (Estrutura base do `_layout`)

- **O que eu pedi:** Como montar a estrutura básica do arquivo `_layout.tsx` usando Stack no Expo Router.
- **O que a IA sugeriu (resumo):** Sugeriu o boilerplate padrão importando `<Stack>` do `expo-router` e declarando as telas `index`, `form` e `detalhe` com configurações de `headerStyle`.
- **O que eu fiz:** Aceitei. A estrutura veio correta e alinhada com o que vimos na Aula 2, facilitando a configuração inicial de navegação sem precisar digitar toda a base do zero.

### Registro 2 — Etapa 5 (Renderização dos cards da lista)

- **O que eu pedi:** Uma estrutura padrão para renderizar a lista de séries cadastradas na tela principal.
- **O que a IA sugeriu (resumo):** Sugeriu usar a função `.map()` nativa do JavaScript dentro de um `<ScrollView>` para iterar sobre o array de séries e criar os cards.
- **O que eu fiz:** Rejeitei totalmente. Como vimos na Aula 1, usar `.map()` para listas grandes causa problemas de performance. Corrigi substituindo por uma `<FlatList>`, usando as propriedades `data`, `keyExtractor` e `renderItem`, e apliquei as condicionais visuais exigidas.

### Registro 3 — Etapa 6 (Estrutura repetitiva do formulário)

- **O que eu pedi:** Um código base para os inputs de texto da tela de formulário (título, plataforma e temporadas).
- **O que a IA sugeriu (resumo):** Gerou os três componentes `<TextInput>`, mas estilizou todos eles usando `StyleSheet.create` no final do arquivo. Além disso, deixou o input de temporadas com o teclado padrão de texto.
- **O que eu fiz:** Rejeitei e adaptei. A rubrica exige o uso do NativeWind para estilo. Apaguei o `StyleSheet` gerado pela IA e apliquei as propriedades `className="..."` em todos os inputs. Também adicionei manualmente a prop `keyboardType="numeric"` no campo de temporadas, como exigido na Etapa 6.

### Registro 4 — Etapa 6 (Lógica repetitiva das estrelas de avaliação)

- **O que eu pedi:** Como estruturar os 5 botões de estrela sem precisar repetir o bloco de código do `<TouchableOpacity>` cinco vezes no JSX.
- **O que a IA sugeriu (resumo):** Sugeriu criar um array fixo `[1, 2, 3, 4, 5]` e usar um `.map()` para renderizar as estrelas dinamicamente.
- **O que eu fiz:** Elaborei a estrutura visual do loop, pois deixou o código muito mais limpo. Porém, adaptei a lógica do `onPress`: implementei a regra para que, se o usuário clicar na mesma nota já selecionada, o estado volte para `null` (tratando o campo opcional).

### Registro 5 — Parte 3 (Investigação do recarregamento da lista)

- **O que eu pedi:** Como fazer a lista de séries atualizar automaticamente ao voltar da tela de formulário.
- **O que a IA sugeriu (resumo):** Explicou o funcionamento da pilha de navegação e sugeriu a implementação do hook `useFocusEffect` em conjunto com `useCallback`.
- **O que eu fiz:** Aceitei e apliquei na tela principal. O `useCallback` garantiu que a função de busca no SQLite não fosse recriada desnecessariamente a cada renderização, atualizando os dados de forma limpa sempre que a tela retoma o foco.
