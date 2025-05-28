import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Retorna o extensionElements do businessObject do elemento.
 * Lida tanto com elementos de diagrama quanto com businessObjects diretamente.
 * @param {ModdleElement|djs.model.Base} element
 * @returns {ModdleElement|null}
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
 * @param {ModdleElement} element
 * @param {string|string[]} types
 * @returns {Array<ModdleElement>}
 */
export function findExtensions(element, types) {
  const extensionElements = getExtensionElements(element);
  if (!extensionElements) return [];
  return extensionElements.get('values').filter((value) => isAny(value, [].concat(types)));
}

/**
 * Retorna o elemento camunda:Properties, se existir.
 * @param {ModdleElement} element
 * @returns {ModdleElement|null}
 */
export function getCamundaProperties(element) {
  const bo = getBusinessObject(element);
  const properties = findExtensions(bo, 'camunda:Properties') || [];
  return properties.length ? properties[0] : null;
}

/**
 * Cria um novo bpmn:ExtensionElements vazio.
 * @param {ModdleElement} element
 * @param {BpmnFactory} bpmnFactory
 * @returns {ModdleElement}
 */
export function createExtensionElements(element, bpmnFactory) {
  const bo = getBusinessObject(element);
  return createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
}

/**
 * Cria um novo camunda:Properties com as propriedades informadas.
 * @param {ModdleElement} extensionElements
 * @param {BpmnFactory} bpmnFactory
 * @param {Object} properties
 * @returns {ModdleElement}
 */
export function createCamundaProperties(extensionElements, bpmnFactory, properties) {
  return createElement('camunda:Properties', properties, extensionElements, bpmnFactory);
}

/**
 * Cria um novo elemento moddle e define o parent.
 * @param {string} elementType
 * @param {Object} properties
 * @param {ModdleElement} parent
 * @param {BpmnFactory} factory
 * @returns {ModdleElement}
 */
export function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);
  element.$parent = parent;
  return element;
}
