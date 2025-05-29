// client/properties-panel/helper/fixed-properties-helper.js
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import {
  createExtensionElements,
  createCamundaProperties,
  getExtensionElements,
  getCamundaProperties
} from './extensions-helper';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @property {string} $type - Tipo do elemento BPMN
 * @property {ModdleElement} $parent - Referência ao elemento pai
 * @property {ModdleElement} businessObject - Objeto de negócio associado
 * @property {Function} get - Função para acessar propriedades
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} BpmnFactory Fábrica para criar elementos BPMN.
 * @property {Function} create - Função para criar novos elementos BPMN
 */

/**
 * @typedef {Object} ModelingService Serviço de modelagem do bpmn-js.
 * @property {Function} updateModdleProperties - Função para atualizar propriedades de elementos
 */

/**
 * @typedef {Object} CamundaProperty
 * @property {string} name - Nome da propriedade
 * @property {string} value - Valor da propriedade
 * @property {string} $type - Tipo do elemento ('camunda:Property')
 */

/**
 * Sobe na hierarquia do modelo BPMN até encontrar o elemento definitions.
 * Este helper é fundamental para garantir que as propriedades sejam sempre
 * armazenadas no nível correto da hierarquia.
 * 
 * @param {ModdleElement} element - Elemento BPMN para iniciar a busca
 * @returns {ModdleElement|null} Elemento definitions ou null se não encontrado
 * 
 * @example
 * const definitions = getDefinitionsElement(someElement);
 * if (definitions) {
 *   // manipular o elemento definitions
 * }
 */
function getDefinitionsElement(element) {
  if (!element) return null;
  const bo = element.businessObject || element;
  if (bo.$type === 'bpmn:Definitions') return bo;
  let current = bo;
  while (current && current.$type !== 'bpmn:Definitions') {
    current = current.$parent;
  }
  return current;
}

/**
 * Obtém o valor de uma propriedade camunda:property específica.
 * Este helper navega através da estrutura de extensões do BPMN para
 * encontrar e retornar o valor de uma propriedade específica.
 * 
 * @param {ModdleElement} element - O elemento definitions do diagrama
 * @param {string} propertyName - O nome da propriedade (ex: 'processo:codigo')
 * @returns {string} O valor da propriedade ou string vazia se não encontrada
 * 
 * @example
 * const codigo = getFixedProperty(element, 'processo:codigo');
 * console.log('Código do processo:', codigo);
 */
export function getFixedProperty(element, propertyName) {
  if (!element) return '';
  const definitions = getDefinitionsElement(element);
  if (!definitions) return '';
  const extensionElements = definitions.get('extensionElements');
  if (!extensionElements) return '';
  const camundaProperties = extensionElements.get('values')
    .find(v => v.$type === 'camunda:Properties');
  if (!camundaProperties || !camundaProperties.values) return '';
  const property = camundaProperties.values.find(p => p.name === propertyName);
  return property ? property.value : '';
}

/**
 * Define o valor de uma propriedade camunda:property específica.
 * Este helper gerencia todo o ciclo de vida de uma propriedade:
 * - Cria as estruturas necessárias se não existirem
 * - Atualiza o valor se a propriedade já existir
 * - Remove a propriedade se o valor for vazio/undefined/null
 * 
 * @param {ModdleElement} element - O elemento definitions do diagrama
 * @param {string} propertyName - O nome da propriedade
 * @param {string} propertyValue - O valor da propriedade
 * @param {ModelingService} modeling - Serviço de modelagem do bpmn-js
 * @param {BpmnFactory} bpmnFactory - Fábrica de elementos BPMN
 * 
 * @example
 * setFixedProperty(
 *   element,
 *   'processo:codigo',
 *   'ABC123',
 *   modeling,
 *   bpmnFactory
 * );
 */
export function setFixedProperty(element, propertyName, propertyValue, modeling, bpmnFactory) {
  if (!element) return;
  const definitions = getDefinitionsElement(element);
  if (!definitions) return;

  let extensionElements = definitions.get('extensionElements');
  // Garante bpmn:ExtensionElements
  if (!extensionElements) {
    extensionElements = bpmnFactory.create('bpmn:ExtensionElements', { values: [] });
    modeling.updateModdleProperties(definitions, definitions, {
      extensionElements: extensionElements
    });
  }

  // Garante camunda:Properties
  let camundaProperties = extensionElements.get('values').find(v => v.$type === 'camunda:Properties');
  if (!camundaProperties) {
    camundaProperties = bpmnFactory.create('camunda:Properties', { values: [] });
    modeling.updateModdleProperties(definitions, extensionElements, {
      values: [...extensionElements.get('values'), camundaProperties]
    });
  }

  // Atualiza, cria ou remove a propriedade
  let targetProperty = camundaProperties.values?.find(p => p.name === propertyName);

  if (shouldRemoveProperty(propertyValue)) {
    if (targetProperty) {
      const newValues = camundaProperties.values.filter(p => p.name !== propertyName);
      modeling.updateModdleProperties(definitions, camundaProperties, { values: newValues });
    }
  } else {
    if (targetProperty) {
      modeling.updateModdleProperties(definitions, targetProperty, { value: propertyValue });
    } else {
      const newProperty = bpmnFactory.create('camunda:Property', {
        name: propertyName,
        value: propertyValue
      });
      const newValues = [...(camundaProperties.values || []), newProperty];
      modeling.updateModdleProperties(definitions, camundaProperties, { values: newValues });
    }
  }
}

/**
 * Verifica se um valor deve resultar na remoção da propriedade.
 * Valores vazios, undefined ou null indicam que a propriedade
 * deve ser removida do modelo.
 * 
 * @param {any} value - Valor a ser verificado
 * @returns {boolean} True se o valor indicar que a propriedade deve ser removida
 * 
 * @example
 * if (shouldRemoveProperty(value)) {
 *   // remover a propriedade
 * }
 */
function shouldRemoveProperty(value) {
  return value === undefined || value === null || value === '';
}
