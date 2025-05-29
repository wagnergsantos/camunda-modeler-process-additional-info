import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericMultiSelectEntry,
  GenericMultiRadioButtonEntry
} from './generic-entries';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} Injector O injetor de dependências do Camunda Modeler.
 */

/**
 * @typedef {Object} PropertyGroup
 * @property {string} id - O ID único do grupo.
 * @property {string} label - O rótulo do grupo exibido na interface.
 * @property {Array<Object>} [entries] - Uma lista de entradas de propriedade para o grupo.
 * @property {Function} [component] - O componente React/Preact para renderizar o grupo.
 * @property {Array} [groups] - Subgrupos, se aplicável (usado em abas).
 */

/**
 * Valida o formato do código do processo.
 * C1: formato C1.Nxx.PAIxxxxx ou C1.Nxx.PTBxxxxx
 * C2: formato C2.Nxx.Mxx.PAIxxxxx ou C2.Nxx.Mxx.PTBxxxxx
 * 
 * @param {string} code - Código do processo a ser validado
 * @returns {string|null} Mensagem de erro ou null se válido
 */
function validateProcessCode(code) {
  if (!code) return null; // Permite campo vazio

  // Padrões de validação
  const c1Pattern = /^C1\.N\d{2}\.(PAI|PTB)\d{5}$/;
  const c2Pattern = /^C2\.N\d{2}\.M\d{2}\.(PAI|PTB)\d{5}$/;

  if (code.startsWith('C1')) {
    if (!c1Pattern.test(code)) {
      return 'Formato inválido para C1. Use o padrão: C1.Nxx.PAIxxxxx ou C1.Nxx.PTBxxxxx';
    }
  } else if (code.startsWith('C2')) {
    if (!c2Pattern.test(code)) {
      return 'Formato inválido para C2. Use o padrão: C2.Nxx.Mxx.PAIxxxxx ou C2.Nxx.Mxx.PTBxxxxx';
    }
  } else {
    return 'O código deve começar com C1 ou C2';
  }

  return null; // Código válido
}

/**
 * Cria o grupo de propriedades "Documentação do Processo" para o painel de propriedades.
 * Este grupo só é exibido para elementos do tipo 'bpmn:Definitions'.
 * 
 * @param {ModdleElement} element - Elemento BPMN ao qual as propriedades pertencem.
 * @param {Injector} injector - Injetor de dependências do Camunda Modeler.
 * @returns {PropertyGroup|null} Grupo de propriedades configurado para o painel, ou null se não aplicável.
 */
export function ProcessDocumentationGroup(element, injector) {
  const translate = injector.get('translate');

  if (!element || element.$type !== 'bpmn:Definitions') {
    return null;
  }

  /**
   * Lista de entradas (fields) exibidas no grupo "Documentação do Processo".
   * Cada entrada representa um campo ou conjunto de campos relacionados.
   * @type {Array<Object>}
   */
  const entries = [
    // Código do Processo
    {
      id: 'process-code',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-code',
        propertyName: 'processo:documentacao:codigo',
        label: 'Código do Processo',
        validate: validateProcessCode,
        tooltip: translate(
          'Formato esperado:\n' +
          'Para C1: C1.Nxx.PAIxxxxx ou C1.Nxx.PTBxxxxx\n' +
          'Para C2: C2.Nxx.Mxx.PAIxxxxx ou C2.Nxx.Mxx.PTBxxxxx\n' +
          'Onde x são números'
        )
      })
    },
    // Nome do Processo
    {
      id: 'process-name',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-name',
        propertyName: 'processo:documentacao:nome',
        label: 'Nome do Processo'
      })
    },
    // Entrada do processo (Insumo)
    {
      id: 'definitions-prop-entrada',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-entrada',
        propertyName: 'processo:documentacao:entradaInsumo',
        label: 'Entrada do processo (Insumo)'
      })
    },
    // Fornecedores (área de texto)
    {
      id: 'definitions-prop-fornecedores',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-fornecedores',
        propertyName: 'processo:documentacao:fornecedores',
        label: 'Fornecedores'
      })
    },
    // Objetivo do Processo
    {
      id: 'process-objective',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-objective',
        propertyName: 'processo:documentacao:objetivo',
        label: 'Objetivo do Processo'
      })
    },
    // Saída do processo (Resultado / Produto)
    {
      id: 'definitions-prop-saida',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-saida',
        propertyName: 'processo:documentacao:saidaResultado',
        label: 'Saída do processo (Resultado / Produto)'
      })
    },
    // Clientes (área de texto)
    {
      id: 'definitions-prop-clientes',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-clientes',
        propertyName: 'processo:documentacao:clientes',
        label: 'Clientes'
      })
    },
    // Interface com outros processos (área de texto)
    {
      id: 'definitions-prop-interface',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-interface',
        propertyName: 'processo:documentacao:interfaceProcessos',
        label: 'Interface com outros processos',
        tooltip: translate('Liste os processos que fornecem entradas para este ou recebem saídas deste.')
      })
    },
    // Principais regras de negócio do processo (área de texto)
    {
      id: 'definitions-prop-regras',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-regras',
        propertyName: 'processo:documentacao:regrasNegocio',
        label: 'Principais regras de negócio do processo'
      })
    },
    // Dono do processo (Área)
    {
      id: 'definitions-prop-donoArea',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-donoArea',
        propertyName: 'processo:documentacao:donoProcessoArea',
        label: 'Dono do processo (Área)'
      })
    },
    // Dono do processo (Gestor(a))
    {
      id: 'definitions-prop-donoGestor',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-donoGestor',
        propertyName: 'processo:documentacao:donoProcessoGestor',
        label: 'Dono do processo (Gestor(a))'
      })
    },
    // Atores envolvidos (área de texto)
    {
      id: 'definitions-prop-atores',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-atores',
        propertyName: 'processo:documentacao:atoresEnvolvidos',
        label: 'Atores envolvidos'
      })
    },
    // Sistemas utilizados (área de texto)
    {
      id: 'definitions-prop-sistemas',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-sistemas',
        propertyName: 'processo:documentacao:sistemasUtilizados',
        label: 'Sistemas utilizados'
      })
    },
    // Legislação / Normativos aplicáveis (área de texto)
    {
      id: 'definitions-prop-legislacao',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-legislacao',
        propertyName: 'processo:documentacao:legislacaoNormativos',
        label: 'Legislação / Normativos aplicáveis'
      })
    },
    // Análise Preliminar
    {
      id: 'definitions-prop-analisePreliminar',
      component: props => GenericMultiRadioButtonEntry({
        ...props,
        element,
        id: 'definitions-prop-analisePreliminar',
        propertyName: 'processo:documentacao:analisePreliminar',
        label: 'Necessidades identificadas no mapeamento dos processos',
        options: [
          { value: 'alinhamento-estrategico', label: 'Análise de alinhamento estratégico' },
          { value: 'melhorias-processo', label: 'Análise de melhorias em processos e sistemas' },
          { value: 'capacidade-rh', label: 'Análise da capacidade de recursos humanos' },
          { value: 'simulacao', label: 'Avaliar possibilidade para simulação de processos' },
          { value: 'melhorias-rapidas', label: 'Avaliar possibilidade para melhorias rápidas' },
          { value: 'automatizacao', label: 'Avaliar possibilidade de Automatização de processos' }
        ]
      })
    }
  ];

  return {
    id: 'process-documentation',
    label: translate('Documentação do Processo'),
    component: Group,
    entries
  };
}
