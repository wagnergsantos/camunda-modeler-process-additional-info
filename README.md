# camunda-modeler-process-additional-info

Plugin para o Camunda Modeler que permite documentar informações adicionais sobre processos BPMN, como dados gerais, situação atual, fornecedores, clientes, regras de negócio, entre outros.

## Funcionalidades

- Adiciona uma aba "Informações gerais" ao painel de propriedades do Camunda Modeler.
- Permite registrar:
  - Código e nome do processo
  - Tipo de mapeamento (AS-IS/TO-BE)
  - Entradas, saídas, fornecedores, clientes
  - Objetivo, regras de negócio, donos do processo
  - Indicadores, periodicidade, capacidade, perfil dos executores
  - Outras informações relevantes para documentação de processos

## Exemplo de uso

### Informações gerais do processo

![Exemplo - Informações gerais](docs/exemplo-informacoes-gerais.png)

### Dados da situação atual

![Exemplo - Situação atual](docs/exemplo-situacao-atual.png)

## Instalação

1. Clone este repositório ou baixe os arquivos.
2. Execute `npm install` para instalar as dependências.
3. Gere o bundle do plugin:
   ```sh
   npm run bundle
   ```
4. Copie a pasta do projeto para a pasta de plugins do Camunda Modeler ou registre o plugin conforme a [documentação oficial](https://docs.camunda.io/docs/components/modeler/desktop-modeler/plugins/).

## Uso

1. Abra o Camunda Modeler.
2. Importe ou crie um diagrama BPMN.
3. Selecione o elemento raiz (Definitions) para visualizar e preencher as informações adicionais no painel de propriedades.

## Estrutura do Projeto

- `client/` - Código-fonte do plugin (componentes, helpers, estilos)
- `client/styles/custom-panel.css` - Estilos customizados do painel
- `index.js` - Arquivo de entrada do plugin para o Camunda Modeler
- `webpack.config.js` - Configuração de build
- `package.json` - Dependências e scripts

## Desenvolvimento

Para desenvolvimento, utilize:
```sh
npm run bundle:watch
```
Assim, o bundle será atualizado automaticamente a cada alteração.

## Licença

MIT

---

> Imagens acima: exemplos reais do plugin em funcionamento no Camunda Modeler.