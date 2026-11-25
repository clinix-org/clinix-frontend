# Test IDs do módulo de medicamentos

## Convenção e escopo

O módulo expõe atributos `data-testid` para automação com Cypress, Playwright,
Selenium e Robot Framework. Use esses atributos sem depender de classes CSS,
traduções ou posição visual.

- Prefixo: `medications-`.
- Os atributos permanecem disponíveis nos builds de desenvolvimento e produção.
- Playwright usa `getByTestId`; as demais ferramentas podem usar o seletor CSS
  `[data-testid="valor"]`.
- Labels, roles e IDs HTML existentes foram preservados.
- Componentes compartilhados recebem seletores opcionais, ativados pelo módulo.
- Atributos de teste não substituem autenticação, permissões ou validação.

Este catálogo descreve seletores; não adiciona comportamentos novos aos filtros
ou à listagem.

## Navegação e listagem

| Test ID | Elemento / condição |
| --- | --- |
| `medications-nav-link` | Entrada Medicamentos no menu lateral, expandido ou recolhido |
| `medications-tab-item` | Contêiner da aba Medicamentos |
| `medications-tab` | Botão para ativar a aba |
| `medications-tab-close` | Fechar a aba; existe somente quando ela está inativa |
| `medications-page` | Superfície principal da página |
| `medications-toolbar` | Barra de ações e busca |
| `medications-search-input` | Campo de busca da listagem |
| `medications-filter-button` | Botão Filtrar existente |
| `medications-create-button` | Novo Medicamento; ausente para USER, desabilitado enquanto faltam as opções |
| `medications-options-error` | Erro no carregamento dos catálogos |
| `medications-options-retry-button` | Tentar novamente as opções |
| `medications-table` | Tabela; expõe também `data-state` |
| `medications-table-head` | Cabeçalho |
| `medications-column-name` | Cabeçalho Medicamento |
| `medications-column-category` | Cabeçalho Categoria |
| `medications-column-dosage` | Cabeçalho Dosagem / Unidade |
| `medications-column-quantity` | Cabeçalho Quantidade |
| `medications-column-status` | Cabeçalho Status |
| `medications-table-body` | Corpo da tabela |
| `medications-row-{id}` | Linha persistida, identificada pelo ID do backend |
| `medications-cell-name` | Nome comercial, dentro da linha |
| `medications-cell-composition` | Princípios ativos, dentro da linha |
| `medications-cell-category` | Categoria, dentro da linha |
| `medications-cell-dosage` | Dosagens/unidades, dentro da linha |
| `medications-cell-quantity` | Quantidade, dentro da linha |
| `medications-cell-status` | Status, dentro da linha |
| `medications-loading` | Mensagem de carregamento |
| `medications-list-error` | Erro da listagem |
| `medications-empty-state` | Mensagem de lista sem resultados |

`medications-table` apresenta `data-state="loading"`, `"ready"`, `"empty"` ou
`"error"`. Aguarde o estado esperado antes de conferir os dados.

As linhas também expõem `data-medication-id`. Capture o ID do POST ou da massa de
QA e use, por exemplo, `medications-row-123`. Não fixe IDs incidentais de outros
ambientes nem use o índice da linha como identidade.

As células repetem seus Test IDs entre linhas. Sempre consulte a célula dentro
de `medications-row-{id}`.

**Pendências existentes:** adicionar seletores não corrige o rótulo de categoria
exibido por `OutlinePill` nem o texto da busca. O módulo ainda não fornece
conteúdo ao botão Filtrar. O seletor compartilhado `medications-filter-panel` só
aparecerá quando houver conteúdo de filtro; hoje não há painel a automatizar.

## Paginação

| Test ID | Elemento |
| --- | --- |
| `medications-pagination` | Contêiner |
| `medications-page-size-select` | Quantidade de itens por página |
| `medications-page-size-option-{value}` | Opções 5, 10, 20 e 50 |
| `medications-total-count` | Total exibido |
| `medications-previous-page` | Página anterior; verificar `disabled` |
| `medications-next-page` | Próxima página; verificar `disabled` |
| `medications-page-{number}` | Botão da página, a partir de 1 |

A página atual possui `aria-current="page"`. Nem todos os números são renderizados
quando há muitas páginas, conforme a janela de navegação existente.

## Modal de cadastro

| Test ID | Elemento |
| --- | --- |
| `medications-create-dialog` | Diálogo; verificar visibilidade/estado aberto |
| `medications-dialog-title` | Título |
| `medications-create-form` | Formulário, com `data-state` e `data-ingredient-count` |
| `medications-create-fields` | Fieldset; desabilitado durante gravação |
| `medications-name-input` | Nome comercial |
| `medications-manufacturer-input` | Fabricante |
| `medications-category-select` | Categoria |
| `medications-presentation-select` | Apresentação |
| `medications-add-ingredient-button` | Adicionar princípio ativo; desabilitado com 30 itens |
| `medications-create-error` | Alerta da aplicação para validação, precisão e demais erros |
| `medications-cancel-button` | Cancelar |
| `medications-submit-button` | Cadastrar / Cadastrando..., com o mesmo Test ID |

O formulário apresenta `data-state="idle"` ou `"saving"` e o total de itens em
`data-ingredient-count`. Os controles mantêm `required`, `min`, `max`, `step` e
`disabled`.

Os balões de validação nativa do navegador não pertencem ao DOM da aplicação e
não recebem Test IDs. Consulte o campo e confira `validity`, `validationMessage`
ou o bloqueio do POST. O alerta da aplicação usa `medications-create-error`.

### Linhas dinâmicas dos princípios ativos

| Test ID / atributo | Elemento |
| --- | --- |
| `medications-ingredient-row` | Coleção de linhas |
| `data-ingredient-key` | Chave imutável da linha enquanto o modal está aberto |
| `medications-ingredient-name-input` | Nome, dentro da linha |
| `medications-ingredient-dosage-input` | Dosagem, dentro da linha |
| `medications-ingredient-unit-select` | Unidade, dentro da linha |
| `medications-remove-ingredient-button` | Remover a linha; existe somente nas adicionais |

Os campos repetem seus Test IDs intencionalmente. Use a linha como escopo.

`data-ingredient-key` reutiliza a chave interna existente e não muda quando outra
linha é removida. Capture-a em execução e use:

```css
[data-testid="medications-ingredient-row"][data-ingredient-key="CHAVE_CAPTURADA"]
```

Não fixe UUIDs no teste: uma nova abertura cria novas chaves. Essa chave local
não é um ID persistido de princípio ativo. A primeira linha não pode ser removida,
conforme o comportamento já existente.

### Opções dos selects

Cada select de categoria, apresentação ou unidade expõe:

- `{testIdDoSelect}-placeholder` para “Selecione”.
- `{testIdDoSelect}-option-{value}` para cada opção recebida da API.

Exemplos: `medications-category-select-option-ANALGESIC`,
`medications-presentation-select-option-TABLET` e
`medications-ingredient-unit-select-option-mg/mL`.

Prefira selecionar pelo valor nativo: `ANALGESIC`, `TABLET`, `mg`, `mg/mL` etc.
Unidades e suas opções são repetidas entre linhas; mantenha o escopo.
Em CSS, coloque aspas no valor do atributo, inclusive se houver `/` ou `%`.

## Notificações

| Test ID | Elemento |
| --- | --- |
| `medications-success-toast` | Conteúdo da confirmação |
| `medications-success-toast-message` | Mensagem de sucesso |
| `medications-success-toast-close` | Fechar a confirmação |
| `medications-duplicate-toast` | Toast amarelo ao receber HTTP 409 / RESOURCE_CONFLICT |
| `medications-duplicate-toast-message` | Mensagem exata: Medicamento já cadastrado. |
| `medications-duplicate-toast-close` | Fechar o aviso de duplicidade |
| `medications-page-location-warning` | Aviso de cadastro salvo cuja página não pôde ser localizada |

A confirmação continua usando `SuccessToast`, compartilhado com usuários, com
identificador fornecido apenas por medicamentos. Cadastros consecutivos podem
deixar várias notificações por alguns segundos: selecione a mais recente ou
identifique a mensagem dentro da notificação desejada.
Aguarde a notificação em vez de usar uma pausa fixa de 5 segundos.

A mensagem apresenta os dados retornados pelo cadastro:
`Medicamento ANADOR (gotas, 10 mg) cadastrado com sucesso.`
Nome, apresentação e dosagens ficam em negrito. A apresentação usa o rótulo das
opções da API em minúsculas; números usam formato pt-BR com até 6 casas decimais.
Composição com vários princípios ativos exibe as dosagens separadas por ` + `,
como `500 mg + 0,25 g`. Validar o texto completo em
`medications-success-toast-message`, mesmo com os trechos em elementos diferentes.
Nomes longos devem quebrar linha sem ultrapassar a largura da tela.

## Exemplos para o projeto de automação do QA

Os exemplos pressupõem sessão ADMIN válida e a página de medicamentos aberta.
As bibliotecas pertencem ao projeto de automação do time e não foram adicionadas
à aplicação. Os snippets de preenchimento cancelam o modal sem persistir dados.

### Playwright

```typescript
await page.getByTestId('medications-create-button').click();
await expect(page.getByTestId('medications-create-dialog')).toBeVisible();
await page.getByTestId('medications-name-input').fill('Medicamento QA');

const row = page.getByTestId('medications-ingredient-row').first();
await row.getByTestId('medications-ingredient-name-input').fill('Componente QA');
await row.getByTestId('medications-ingredient-dosage-input').fill('12.5');
await row.getByTestId('medications-ingredient-unit-select').selectOption('mg');
await page.getByTestId('medications-category-select').selectOption('ANALGESIC');
await page.getByTestId('medications-presentation-select').selectOption('TABLET');
await page.getByTestId('medications-manufacturer-input').fill('Fabricante QA');

await page.getByTestId('medications-cancel-button').click();
await expect(page.getByTestId('medications-create-dialog')).toHaveCount(0);
```

Em um cenário separado que criou uma massa, use o ID retornado pela API:

```typescript
const persistedRow = page.getByTestId('medications-row-123');
await expect(persistedRow.getByTestId('medications-cell-name'))
  .toHaveText('Medicamento QA');
```

### Cypress

```javascript
cy.get('[data-testid="medications-create-button"]').click();
cy.get('[data-testid="medications-create-dialog"]').should('be.visible');
cy.get('[data-testid="medications-name-input"]').type('Medicamento QA');

cy.get('[data-testid="medications-ingredient-row"]').first().within(() => {
  cy.get('[data-testid="medications-ingredient-name-input"]').type('Componente QA');
  cy.get('[data-testid="medications-ingredient-dosage-input"]').type('12.5');
  cy.get('[data-testid="medications-ingredient-unit-select"]').select('mg');
});

cy.get('[data-testid="medications-category-select"]').select('ANALGESIC');
cy.get('[data-testid="medications-presentation-select"]').select('TABLET');
cy.get('[data-testid="medications-manufacturer-input"]').type('Fabricante QA');
cy.get('[data-testid="medications-cancel-button"]').click();
cy.get('[data-testid="medications-create-dialog"]').should('not.exist');
```

### Selenium com Java

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
By createButton = By.cssSelector("[data-testid='medications-create-button']");
wait.until(ExpectedConditions.elementToBeClickable(createButton)).click();
By dialog = By.cssSelector("[data-testid='medications-create-dialog']");
wait.until(ExpectedConditions.visibilityOfElementLocated(dialog));

driver.findElement(By.cssSelector("[data-testid='medications-name-input']"))
    .sendKeys("Medicamento QA");
WebElement row = driver.findElements(
    By.cssSelector("[data-testid='medications-ingredient-row']")).get(0);
row.findElement(By.cssSelector("[data-testid='medications-ingredient-name-input']"))
    .sendKeys("Componente QA");
new Select(row.findElement(
    By.cssSelector("[data-testid='medications-ingredient-unit-select']")))
    .selectByValue("mg");

driver.findElement(By.cssSelector("[data-testid='medications-cancel-button']"))
    .click();
wait.until(ExpectedConditions.invisibilityOfElementLocated(dialog));
```

### Robot Framework com SeleniumLibrary

```robot
*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Conferir seletores de cadastro
    Wait Until Element Is Enabled    css:[data-testid="medications-create-button"]
    Click Element    css:[data-testid="medications-create-button"]
    Wait Until Element Is Visible    css:[data-testid="medications-create-dialog"]
    Input Text    css:[data-testid="medications-name-input"]    Medicamento QA
    ${row}=    Get WebElement    css:[data-testid="medications-ingredient-row"]
    ${key}=    Get Element Attribute    ${row}    data-ingredient-key
    Input Text    css:[data-ingredient-key="${key}"] [data-testid="medications-ingredient-name-input"]    Componente QA
    Select From List By Value    css:[data-ingredient-key="${key}"] [data-testid="medications-ingredient-unit-select"]    mg
    Click Element    css:[data-testid="medications-cancel-button"]
    Wait Until Page Does Not Contain Element    css:[data-testid="medications-create-dialog"]
```

## Manutenção

- Preserve Test IDs ao alterar CSS, layout ou textos.
- Coordene renomeações com QA e atualize este catálogo.
- Siga o prefixo `medications-` em novos elementos.
- Não use dados pessoais ou textos digitados pelo usuário para gerar seletores.
- Mantenha o escopo das células e dos princípios ativos.
- Seletores opcionais não devem gerar atributos `undefined-*` nas outras telas.
