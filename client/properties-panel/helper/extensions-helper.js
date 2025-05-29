import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @property {ModdleElement} [extensionElements] - Elementos de extensão do BPMN
 * @property {ModdleElement} [$parent] - Referência ao elemento pai
 * @property {string} [$type] - Tipo do elemento BPMN
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} BpmnFactory Fábrica para criar elementos BPMN.
 * @property {Function} create - Função para criar novos elementos BPMN
 */

/**
 * @typedef {Object} ExtensionElements Elementos de extensão do BPMN.
 * @property {Array<ModdleElement>} values - Lista de elementos de extensão
 */

/**
 * @typedef {Object} CamundaProperties Propriedades específicas do Camunda.
 * @property {Array<Object>} values - Lista de propriedades do Camunda
 */

/**
 * Retorna o extensionElements do businessObject do elemento.
 * Lida tanto com elementos de diagrama quanto com businessObjects diretamente.
 * Este helper é robusto o suficiente para lidar com diferentes tipos de entrada,
 * seja um elemento do diagrama ou um businessObject.
 * 
 * @param {ModdleElement|Object} element - Elemento BPMN ou businessObject
 * @returns {ExtensionElements|null} Elemento extensionElements ou null se não encontrado
 * 
 * @example
 * const extensionElements = getExtensionElements(someElement);
 * if (extensionElements) {
 *   // manipular os elementos de extensão
 * }
 */
export function getExtensionElements(element) {
  const businessObject = getBusinessObject(element) || element;

  if (!businessObject) {
    return null;
  }
  
  return businessObject.get('extensionElements');
}

/**
 * Busca extensões do tipo informado dentro do extensionElements.
 * Permite buscar por um único tipo ou por múltiplos tipos de extensão.
 * 
 * @param {ModdleElement} element - Elemento BPMN para buscar extensões
 * @param {string|string[]} types - Tipo ou tipos de extensão a serem buscados
 * @returns {Array<ModdleElement>} Lista de extensões encontradas
 * 
 * @example
 * // Buscar um tipo específico
 * const customExtensions = findExtensions(element, 'custom:Extension');
 * 
 * // Buscar múltiplos tipos
 * const extensions = findExtensions(element, ['custom:Extension', 'other:Extension']);
 */
export function findExtensions(element, types) {
  const extensionElements = getExtensionElements(element);
  if (!extensionElements) return [];
  return extensionElements.get('values').filter((value) => isAny(value, [].concat(types)));
}

/**
 * Retorna o elemento camunda:Properties, se existir.
 * Este helper é específico para propriedades do Camunda e é usado para
 * acessar propriedades personalizadas armazenadas no formato do Camunda.
 * 
 * @param {ModdleElement} element - Elemento BPMN para buscar propriedades
 * @returns {CamundaProperties|null} Elemento camunda:Properties ou null se não encontrado
 * 
 * @example
 * const camundaProps = getCamundaProperties(element);
 * if (camundaProps) {
 *   const values = camundaProps.get('values');
 *   // manipular as propriedades
 * }
 */
export function getCamundaProperties(element) {
  const bo = getBusinessObject(element);
  const properties = findExtensions(bo, 'camunda:Properties') || [];
  return properties.length ? properties[0] : null;
}

/**
 * Cria um novo bpmn:ExtensionElements vazio.
 * Útil quando precisamos adicionar extensões a um elemento que ainda
 * não possui um container de extensões.
 * 
 * @param {ModdleElement} element - Elemento BPMN que receberá as extensões
 * @param {BpmnFactory} bpmnFactory - Fábrica para criar elementos BPMN
 * @returns {ExtensionElements} Novo elemento extensionElements
 * 
 * @example
 * const extensionElements = createExtensionElements(element, bpmnFactory);
 * // Agora podemos adicionar extensões ao elemento
 */
export function createExtensionElements(element, bpmnFactory) {
  const bo = getBusinessObject(element);
  return createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
}

/**
 * Cria um novo camunda:Properties com as propriedades informadas.
 * Este helper facilita a criação de propriedades personalizadas no
 * formato específico do Camunda.
 * 
 * @param {ExtensionElements} extensionElements - Container de extensões
 * @param {BpmnFactory} bpmnFactory - Fábrica para criar elementos BPMN
 * @param {Object} properties - Propriedades a serem adicionadas
 * @returns {CamundaProperties} Novo elemento camunda:Properties
 * 
 * @example
 * const props = createCamundaProperties(extensionElements, bpmnFactory, {
 *   values: [
 *     { name: 'propName', value: 'propValue' }
 *   ]
 * });
 */
export function createCamundaProperties(extensionElements, bpmnFactory, properties) {
  return createElement('camunda:Properties', properties, extensionElements, bpmnFactory);
}

/**
 * Cria um novo elemento moddle e define o parent.
 * Esta é uma função utilitária genérica para criar qualquer tipo
 * de elemento BPMN com suas propriedades e referência ao pai.
 * 
 * @param {string} elementType - Tipo do elemento BPMN a ser criado
 * @param {Object} properties - Propriedades do elemento
 * @param {ModdleElement} parent - Elemento pai
 * @param {BpmnFactory} factory - Fábrica para criar elementos BPMN
 * @returns {ModdleElement} Novo elemento BPMN criado
 * 
 * @example
 * const newElement = createElement(
 *   'bpmn:Task',
 *   { name: 'New Task' },
 *   parentElement,
 *   bpmnFactory
 * );
 */
export function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);
  element.$parent = parent;
  return element;
}
