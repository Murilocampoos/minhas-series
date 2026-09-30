# Projeto Prático — "Minhas Séries"

**Tipo:** individual
**Pré-requisito:** Aulas 1, 2 e 3 concluídas
**Conteúdo coberto:** componentes básicos, estado, Expo Router, NativeWind, SQLite, TypeScript e Repository Pattern

---

## Objetivos

Ao final do projeto o aluno deve ter construído, sozinho e com a IA como copiloto, um app que:

- Registra as séries que a pessoa assistiu ou está assistindo.
- Guarda tudo em SQLite e mantém os dados depois de fechar o app.
- Tem três telas conectadas pelo Expo Router, com passagem de parâmetros.
- Separa tela, repositório e conexão, do mesmo jeito que fizemos na Aula 3.

---

## Parte 1 — O que o app faz

O usuário abre o app e vê a lista das séries que cadastrou. Pode filtrar entre **todas**, **assistindo** e **concluídas**. Tocar em uma série abre o detalhe, onde ele marca como concluída, edita ou exclui. Um botão na lista abre o formulário de cadastro.

```
[ Lista ]  →  toca na série  →  [ Lista ][ Detalhe ]  →  "Editar"  →  [ Lista ][ Detalhe ][ Form ]
    ↓
 "+ Nova série"  →  [ Lista ][ Form ]
```

### Os dados de uma série

| Campo       | Tipo no SQLite        | Tipo no TypeScript | Observação                               |
| ----------- | --------------------- | ------------------ | ---------------------------------------- |
| `id`        | `INTEGER PRIMARY KEY` | `number`           | Gerado pelo banco (`AUTOINCREMENT`)      |
| `titulo`    | `TEXT NOT NULL`       | `string`           | Obrigatório                              |
| `plataforma`| `TEXT NOT NULL`       | `string`           | Ex.: Netflix, Max, Prime Video           |
| `temporadas`| `INTEGER NOT NULL`    | `number`           | Quantas temporadas a pessoa já assistiu  |
| `nota`      | `INTEGER`             | `number \| null`   | De 1 a 5. Pode ficar sem nota (`NULL`)   |
| `concluida` | `INTEGER NOT NULL`    | `number`           | 0 ou 1 — SQLite não tem booleano         |
| `createdAt` | `TEXT NOT NULL`       | `string`           | ISO 8601, gerado no repositório          |

> Repare no `nota: number | null`. É a primeira vez que um campo pode não existir. O TypeScript vai obrigar você a tratar o caso `null` na tela — e isso é bom.

---

## Parte 2 — Etapas

Faça **um commit ao final de cada etapa**. O histórico de commits faz parte da avaliação.

### ETAPA 1 — Projeto e configuração

- Crie o projeto com `npx create-expo-app@latest minhas-series --template blank-typescript`.
- Instale as dependências com `npx expo install` (Router, SQLite) e o NativeWind com `npm install nativewind@^4.1 tailwindcss@^3.4 --legacy-peer-deps`.
- Configure o Expo Router (`"main"` e `"scheme"`) e os 5 arquivos do NativeWind.
- Prove que funciona com a tela "Configuração OK", como na lição de casa da Aula 2.

Commit: `Etapa 1 - projeto, Expo Router e NativeWind configurados`

### ETAPA 2 — Tipos

Crie `src/types/serie.ts` com:

- `Serie` — a entidade completa, como está no banco.
- `CreateSerieInput` — o que o usuário informa ao cadastrar (sem `id`, sem `createdAt`, sem `concluida`: toda série nova começa como "assistindo").
- `UpdateSerieInput` — os campos editáveis no formulário.
- `SerieFilter` — um union type com `'todas' | 'assistindo' | 'concluidas'`.

Validação: `npx tsc --noEmit` sem erros.

Commit: `Etapa 2 - tipos TypeScript`

### ETAPA 3 — Banco

Crie `src/database/database.ts` com:

- `getDatabase()` usando o **singleton** da conexão.
- `runMigrations()` com `PRAGMA journal_mode = WAL` e `CREATE TABLE IF NOT EXISTS series (...)`.

Commit: `Etapa 3 - conexão e tabela SQLite`

### ETAPA 4 — Repositório

Crie `src/database/serieRepository.ts` com estas 6 funções:

```ts
getSeries(filtro: SerieFilter): Promise<Serie[]>
getSerieById(id: number): Promise<Serie | null>
createSerie(input: CreateSerieInput): Promise<Serie>
updateSerie(id: number, input: UpdateSerieInput): Promise<void>
toggleSerieConcluida(id: number): Promise<void>
deleteSerie(id: number): Promise<void>
```

Regras:

- **Nenhum** `import` do React neste arquivo.
- **Todos** os valores vindos de variável entram com `?`. Sem exceção.
- `createSerie` devolve a série criada usando `result.lastInsertRowId`.
- `getSeries` resolve o filtro **no SQL** (`WHERE`), não com `.filter()` no JavaScript.
- A lista vem ordenada da mais recente para a mais antiga.

Validação: `npx tsc --noEmit` sem erros.

Commit: `Etapa 4 - repositório de séries`

### ETAPA 5 — Layout e lista

`app/_layout.tsx` com um `Stack` declarando as três rotas e títulos: `index`, `form`, `detalhe`.

`app/index.tsx`:

- Três botões de filtro no topo; o ativo fica visualmente destacado.
- `FlatList` com `keyExtractor` usando o `id` e `ListEmptyComponent`.
- Cada card mostra título, plataforma, temporadas e a nota (ou "Sem nota").
- Séries concluídas têm aparência diferente das que estão em andamento.
- Botão "+ Nova série" que leva para `/form`.

Commit: `Etapa 5 - layout e tela de lista`

### ETAPA 6 — Formulário (criar e editar)

`app/form.tsx` é **uma tela só** para os dois casos:

- Sem parâmetro (`/form`) → cadastro.
- Com parâmetro (`/form?id=3`) → carrega a série e edita.

Requisitos:

- `TextInput` para título, plataforma e temporadas (use `keyboardType="numeric"` em temporadas).
- Nota escolhida tocando em 5 botões (★ 1 a 5). Tocar na nota já selecionada remove a nota.
- Não salvar com título ou plataforma vazios; temporadas precisa ser um número ≥ 0.
- Depois de salvar, `router.back()`.

Commit: `Etapa 6 - formulário de cadastro e edição`

### ETAPA 7 — Detalhe

`app/detalhe.tsx` recebe `?id=` e mostra todos os dados da série, com três ações:

- **Marcar como concluída / voltar para assistindo** (usa `toggleSerieConcluida`).
- **Editar** → `router.push('/form?id=...')`.
- **Excluir** → pede confirmação com `Alert.alert` e depois volta para a lista.

Commit: `Etapa 7 - tela de detalhe`

### ETAPA 8 — O teste que importa

1. Cadastre 3 séries, conclua uma, edite outra.
2. **Feche o app completamente** e abra de novo.
3. Tudo precisa estar lá, inclusive o filtro funcionando.

Grave um vídeo curto (ou prints) desse teste e coloque no README.

Commit: `Etapa 8 - README e teste de persistência`

---

## Parte 3 — Um conceito novo, para você investigar

Na Aula 3 a lista carregava com `useEffect(() => { carregar(); }, [])`. Aqui isso **não basta**: quando você volta do formulário para a lista, a tela de lista não é montada de novo — ela estava só "embaixo" na pilha. O `useEffect` com `[]` não roda outra vez e a série nova não aparece.

O Expo Router tem um hook para isso: `useFocusEffect`. Descubra com o copiloto como ele funciona, por que ele pede um `useCallback` e use-o nas telas que precisam recarregar ao voltar. Registre essa conversa no diário do copiloto.

---

## Parte 4 — Como usar a IA neste projeto

A IA aqui é **copiloto**, não piloto. Você dirige; ela ajuda.

### ✅ Use a IA para

- Explicar um erro que apareceu no terminal.
- Explicar um conceito ("o que o `useCallback` faz dentro do `useFocusEffect`?").
- Revisar um arquivo que **você** escreveu ("tem algo errado nesse repositório?").
- Gerar uma parte pequena e específica (um componente de estrelas, uma query com `WHERE`), que você lê e entende antes de aceitar.
- Sugerir classes do NativeWind para deixar um card mais bonito.

### ❌ Não use a IA para

- Gerar o projeto inteiro, ou uma etapa inteira, de uma vez.
- Colar este enunciado e pedir "faça".
- Aceitar código que você não sabe explicar.

### Cuidado: a IA erra — e erra de jeitos previsíveis

Fique atento a sugestões que contrariam o que vimos em aula. Exemplos comuns:

- Montar SQL com template string (`` `... WHERE id = ${id}` ``) em vez de `?`.
- Usar `boolean` para `concluida`.
- Mandar instalar pacote do Expo com `npm install` em vez de `npx expo install`.
- Sugerir a API antiga do `expo-sqlite` (`openDatabase`, `transaction`) ou uma versão do NativeWind diferente da 4.
- Colocar chamadas ao banco direto no componente, ignorando o repositório.

Quando pegar um desses, **registre no diário**. Encontrar o erro da IA vale mais do que não ter errado.

### Diário do copiloto (obrigatório, no README)

Uma seção `## Diário do copiloto` com **no mínimo 5 registros**, neste formato:

```md
### Registro 3 — Etapa 4
**O que eu pedi:** como fazer o filtro de concluídas no SQL
**O que a IA sugeriu (resumo):** ...
**O que eu fiz:** aceitei / adaptei / rejeitei, porque ...
```

Pelo menos **um** registro precisa ser de uma sugestão que você **rejeitou ou corrigiu**, explicando o motivo.

Você deve ser capaz de explicar qualquer linha do seu código.

---

## Erros comuns

| Sintoma                                          | Causa                                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Série nova não aparece ao voltar para a lista    | Usou `useEffect` com `[]` em vez de `useFocusEffect`                                    |
| Formulário de edição abre vazio                  | `id` do `useLocalSearchParams` é `string`; faltou converter com `Number(id)`            |
| `nota` aparece como `null` escrito na tela       | Não tratou o caso sem nota antes de renderizar                                          |
| Temporadas salva como texto ou `NaN`             | O `TextInput` sempre entrega `string`; converta e valide antes de chamar o repositório  |
| Alterou a tabela e nada mudou                    | `IF NOT EXISTS` não migra esquema. Desinstale o app do Expo Go e abra de novo           |
| `className` ignorado                             | `import '../global.css'` não é a primeira linha do `_layout.tsx`, ou faltou `-c`        |

---

## 🏁 Entregável

1. Repositório no GitHub chamado `minhas-series-mobile`.
2. Um commit por etapa, com as mensagens indicadas.
3. `README.md` com:
   - Descrição curta do app.
   - Como rodar (`npm install` e `npx expo start`).
   - Vídeo ou prints do teste de persistência (ETAPA 8).
   - A seção **Diário do copiloto**.
4. `npx tsc --noEmit` sem erros.

---

## 📊 Rubrica de avaliação (10 pontos)

| # | Critério | Pontos | Completo | Parcial | Ausente |
| - | -------- | :----: | -------- | ------- | ------- |
| 1 | **Configuração e estrutura** | 1,0 | Router e NativeWind funcionando; pastas `app/`, `src/types`, `src/database` como em aula | Funciona, mas estrutura de pastas diferente ou arquivos de configuração sobrando/faltando | Não roda |
| 2 | **Tipos TypeScript** | 1,5 | `Serie`, inputs e `SerieFilter` corretos; `nota: number \| null`; `concluida: number`; sem `any`; `tsc` limpo | Tipos existem, mas com `any`, `boolean` em `concluida` ou erros no `tsc` | Sem tipos próprios |
| 3 | **Banco e conexão** | 1,0 | Singleton, WAL, `CREATE TABLE IF NOT EXISTS` com tipos e `NOT NULL` corretos | Abre o banco mais de uma vez ou tabela com tipos errados | Sem SQLite |
| 4 | **Repositório** | 2,0 | 6 funções; `?` em todas as queries; filtro no SQL; `createSerie` devolve a série; nenhum import do React | Faltam funções, filtro feito em JS ou retorno incompleto | SQL dentro das telas, **ou** qualquer query montada com interpolação (zera o critério) |
| 5 | **Navegação** | 1,5 | 3 rotas no `Stack`; parâmetros via `?id=`; mesmo form para criar e editar; `useFocusEffect` recarregando a lista | Navega, mas lista não atualiza ao voltar, ou form duplicado para criar/editar | Uma tela só |
| 6 | **Interface e componentes** | 1,0 | `FlatList` com `keyExtractor` e estado vazio; filtro com destaque; nota por estrelas; validação do form; NativeWind em todas as telas | Funciona, mas sem estado vazio, sem validação ou misturando `StyleSheet` sem motivo | Interface quebrada |
| 7 | **Persistência comprovada** | 0,5 | Vídeo/prints mostrando dados após fechar e reabrir | Evidência incompleta | Sem evidência |
| 8 | **Diário do copiloto** | 1,0 | 5+ registros reais, com pelo menos 1 sugestão rejeitada/corrigida e justificada | Menos de 5 registros ou registros genéricos, sem justificativa | Sem diário |
| 9 | **Histórico de commits** | 0,5 | Um commit por etapa, mensagens como indicado | Poucos commits ou mensagens genéricas | Um único commit com tudo |

---

## Para ir além (opcional)

- Busca por título na lista (com `LIKE ?` — e o `%` entra no **valor**, não na query).
- Contador no topo: "12 séries · 5 concluídas", calculado com `COUNT` no SQL.
- Ordenação alternável: mais recentes / maior nota.
