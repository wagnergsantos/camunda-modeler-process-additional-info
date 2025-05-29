// client/properties-panel/ProcessDocumentationPropertiesProvider.js
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { ProcessDocumentationGroup } from './props/process-documentation-props';
import { CurrentSituationGroup } from './props/current-situation-props';
import { IndicatorsGroup } from './props/process-indicators-props';
import { MappingMetadataGroup } from './props/mapping-metadata-props';

/**
 * @typedef {import('bpmn-js/lib/model/Types').Element} Element
 * @typedef {import('bpmn-js/lib/model/Types').ModdleElement} ModdleElement
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 * @typedef {import('bpmn-js/lib/features/modeling/Modeling').default} Modeling
 * @typedef {import('bpmn-js-properties-panel/lib/PropertiesPanel').default} PropertiesPanel
 * @typedef {import('didi').Injector} Injector
 * @typedef {import('bpmn-js/lib/features/translate/Translate').default} Translate
 * @typedef {import('bpmn-js/lib/features/modeling/BpmnFactory').default} BpmnFactory
 * @typedef {import('bpmn-js/lib/BaseModeler').default} Bpmnjs
 * @typedef {import('diagram-js/lib/core/ElementRegistry').default} ElementRegistry
 */

/**
 * @typedef {Object} PropertyGroup
 * @property {string} id - O ID único do grupo.
 * @property {string} label - O rótulo do grupo exibido na interface.
 * @property {Array<Object>} [entries] - Uma lista de entradas de propriedade para o grupo.
 * @property {Function} [component] - O componente React/Preact para renderizar o grupo.
 * @property {Array<PropertyGroup>} [groups] - Subgrupos, se aplicável (usado em abas).
 */

/**
 * @typedef {Object} PropertiesPanelTab
 * @property {string} id - O ID único da aba.
 * @property {string} label - O rótulo da aba exibido na interface.
 * @property {Array<PropertyGroup>} groups - Os grupos de propriedades contidos nesta aba.
 */


/**
 * Um provedor de painel de propriedades que adiciona abas e grupos personalizados
 * para documentação de processo, situação atual, indicadores e metadados de mapeamento.
 *
 * @class ProcessDocumentationPropertiesProvider
 */
export default class ProcessDocumentationPropertiesProvider {
  /**
   * @constructor
   * @param {PropertiesPanel} propertiesPanel - A instância do painel de propriedades.
   * @param {Injector} injector - O injetor de dependências.
   */
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }

  /**
   * Retorna as abas a serem adicionadas ao painel de propriedades.
   * Atualmente, adiciona uma aba "Informações gerais".
   *
   * @param {Element} element - O elemento BPMN selecionado.
   * @returns {Array<PropertiesPanelTab>} Uma lista de definições de abas.
   */
  getTabs(element) {
    // Sempre exibe a aba, independente do tipo de elemento
    const groups = [];
    // Embora ProcessDocumentationGroup seja chamado aqui, ele só é realmente usado
    // se o elemento for bpmn:Definitions. No entanto, a estrutura getTabs
    // espera grupos. Para uma aba estática, isso pode ser simplificado ou
    // os grupos podem ser condicionalmente adicionados aqui também.
    const processDocumentationGroup = ProcessDocumentationGroup(element, this._injector);
    
    if (processDocumentationGroup) {
      groups.push(processDocumentationGroup);
    }

    return [
      {
        id: 'generalInfo',
        label: 'Informações gerais', // Idealmente, usar translate aqui
        groups
      }
    ];
  }

  /**
   * Retorna uma função que modifica a lista de grupos de propriedades.
   * Adiciona grupos para Metadados do Mapeamento, Documentação do Processo,
   * Situação Atual e Indicadores.
   *
   * @param {Element} element - O elemento BPMN selecionado.
   * @returns {(groups: Array<PropertyGroup>) => Array<PropertyGroup>} Uma função que recebe e retorna uma lista de grupos.
   */
  getGroups(element) {
    return (groups) => {
      groups = groups.slice();

      const definitionsElement = findDefinitionsElement(this._injector);

      if (!definitionsElement) {
        // Se não houver definitionsElement, não podemos adicionar os grupos que dependem dele.
        // O IndicatorsGroup ainda pode ser adicionado se não depender estritamente do definitionsElement
        // para sua lógica principal, mas sim do 'element' fornecido.
        // No entanto, a lógica atual em IndicatorsGroup usa getDefinitions(element),
        // que pode ou não ser o mesmo que o definitionsElement global.
        // Por segurança e consistência, é melhor retornar os grupos originais se definitionsElement não for encontrado.
        console.warn('Elemento bpmn:Definitions não encontrado. Alguns grupos de propriedades podem não ser exibidos.');
        
        // Adiciona o grupo de Indicadores se ele for aplicável ao 'element' atual
        // e não depender exclusivamente do 'definitionsElement' global.
        // A função IndicatorsGroup já lida com a obtenção das definições a partir do 'element'.
        const indicatorsGroup = IndicatorsGroup(element, this._injector);
        if (indicatorsGroup) {
          groups.push(indicatorsGroup);
        }
        return groups;
      }

      // Grupo de Metadados do Mapeamento (aplicado ao bpmn:Definitions)
      const metadataGroup = MappingMetadataGroup(definitionsElement, this._injector);
      if (metadataGroup) {
        groups.push(metadataGroup);
      }

      // Grupo de Documentação do Processo (aplicado ao bpmn:Definitions)
      const processDocumentationGroup = ProcessDocumentationGroup(definitionsElement, this._injector);
      if (processDocumentationGroup) {
        // Nota: ProcessDocumentationGroup retorna um grupo completo, não apenas entradas.
        // Se a intenção era adicionar suas entradas a um grupo 'generalInfo' existente,
        // a lógica precisaria ser ajustada.
        // Atualmente, ele será adicionado como um grupo separado.
        groups.push(processDocumentationGroup);
      }

      // Grupo de Situação Atual (aplicado ao bpmn:Definitions)
      const currentSituationGroup = CurrentSituationGroup(definitionsElement, this._injector);
      if (currentSituationGroup) {
        groups.push(currentSituationGroup);
      }
      
      // Grupo de Indicadores (aplicado ao 'element' selecionado, mas armazena dados em bpmn:Definitions)
      // É importante que IndicatorsGroup seja chamado com o 'element' correto
      // para o qual os indicadores são relevantes, mesmo que os dados sejam armazenados globalmente.
      const indicatorsGroupInstance = IndicatorsGroup(element, this._injector);
      if (indicatorsGroupInstance) {
        groups.push(indicatorsGroupInstance);
      }

      return groups;
    };
  }
}

/**
 * @static
 * @type {Array<string>}
 * @description Lista de dependências a serem injetadas na classe.
 */
ProcessDocumentationPropertiesProvider.$inject = [
  'propertiesPanel',
  'injector'
];

/**
 * Função utilitária para encontrar o primeiro elemento bpmn:Process no diagrama.
 * Nota: Esta função parece não estar sendo utilizada ativamente no fluxo principal de `getGroups` ou `getTabs`.
 *
 * @param {Element} _element - O elemento BPMN atual (não usado diretamente na lógica de busca do processo).
 * @param {Injector} injector - O injetor de dependências.
 * @returns {ModdleElement|null} O elemento bpmn:Process encontrado ou null.
 */
// eslint-disable-next-line no-unused-vars
function findProcessElement(_element, injector) {
  const elementRegistry = injector.get('elementRegistry', false);
  if (!elementRegistry) return null;

  const allElements = elementRegistry.getAll();
  const processElement = allElements.find(el => is(el, 'bpmn:Process'));
  return processElement ? getBusinessObject(processElement) : null;
}

/**
 * Função utilitária para obter a referência `processRef` de um elemento,
 * tipicamente de um `bpmn:Participant`.
 * Nota: Esta função parece não estar sendo utilizada ativamente.
 *
 * @param {Element} element - O elemento BPMN.
 * @returns {ModdleElement|undefined} A referência ao processo ou undefined.
 */
// eslint-disable-next-line no-unused-vars
function getProcessRef(element) {
  const bo = getBusinessObject(element);
  return bo.processRef;
}

/**
 * Encontra o elemento raiz `bpmn:Definitions` do diagrama.
 *
 * @param {Injector} injector - O injetor de dependências.
 * @returns {ModdleElement|null} O elemento `bpmn:Definitions` ou null se não encontrado.
 */
function findDefinitionsElement(injector) {
  const modeler = injector.get('bpmnjs', false);
  if (!modeler) {
    console.error('Serviço bpmnjs não encontrado no injetor.');
    return null;
  }

  const definitions = modeler.getDefinitions();
  // console.debug('definitions type:', definitions && definitions.$type); // DEBUG
  if (!definitions || !is(definitions, 'bpmn:Definitions')) {
     console.warn('Elemento bpmn:Definitions não é do tipo esperado ou não foi encontrado:', definitions);
     return null;
  }
  return definitions;
}
