// client/properties-panel/helper/fixed-properties-helper.js
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import {
  createExtensionElements,
  createCamundaProperties,
  getExtensionElements,
  getCamundaProperties
} from './extensions-helper';

/**
 * Sobe na hierarquia até encontrar o definitions.
 * @param {ModdleElement} element
 * @returns {ModdleElement|null}
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
 * @param {object} element O elemento definitions do diagrama.
 * @param {string} propertyName O nome da propriedade (ex: 'processo:codigo').
 * @returns {string} O valor da propriedade ou string vazia.
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
 * Cria extensionElements/camunda:Properties se necessário.
 * Remove a propriedade se o valor for vazio/undefined/null.
 * @param {object} element O elemento definitions do diagrama.
 * @param {string} propertyName O nome da propriedade.
 * @param {string} propertyValue O valor da propriedade.
 * @param {object} modeling Serviço de modelagem do bpmn-js.
 * @param {object} bpmnFactory Fábrica de elementos BPMN do bpmn-js.
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
 * Retorna true se o valor for vazio, undefined ou null.
 * @param {any} value
 * @returns {boolean}
 */
function shouldRemoveProperty(value) {
  return value === undefined || value === null || value === '';
}