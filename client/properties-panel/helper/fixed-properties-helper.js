// client/properties-panel/helper/fixed-properties-helper.js
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import {
  createExtensionElements, // Você pode precisar adaptar ou copiar de extensions-helper.js
  createCamundaProperties,   // Você pode precisar adaptar ou copiar de extensions-helper.js
  getExtensionElements,    // Você pode precisar adaptar ou copiar de extensions-helper.js
  getCamundaProperties as getCamundaPropertiesContainer // Renomeie se houver conflito
} from './extensions-helper'; // Adapte o caminho se moveu/renomeou extensions-helper.js

function getDefinitionsElement(element) {
  if (!element) return null;

  const bo = element.businessObject || element;
  
  // If we already have definitions, return it
  if (bo.$type === 'bpmn:Definitions') {
    return bo;
  }

  // Navigate up until we find definitions
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
 * @returns {string|undefined} O valor da propriedade ou undefined.
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
 * @param {object} element O elemento definitions do diagrama.
 * @param {string} propertyName O nome da propriedade.
 * @param {string} propertyValue O valor da propriedade.
 * @param {object} modeling Serviço de modelagem do bpmn-js.
 * @param {object} bpmnFactory Fábrica de elementos BPMN do bpmn-js.
 */
export function setFixedProperty(element, propertyName, propertyValue, modeling, bpmnFactory) {
  if (!element) return;

  console.log('setFixedProperty called with:', {
    element,
    propertyName,
    propertyValue
  });

  const definitions = getDefinitionsElement(element);
  
  console.log('Found definitions:', definitions); // DEBUG

  if (!definitions) {
    console.warn('No definitions found');
    return;
  }

  let extensionElements = definitions.get('extensionElements');

  // 1. Garante bpmn:ExtensionElements
  if (!extensionElements) {
    extensionElements = bpmnFactory.create('bpmn:ExtensionElements', { values: [] });
    modeling.updateModdleProperties(definitions, definitions, {
      extensionElements: extensionElements
    });
  }

  // 2. Garante camunda:Properties
  let camundaProperties = extensionElements.get('values').find(v => v.$type === 'camunda:Properties');
  if (!camundaProperties) {
    camundaProperties = bpmnFactory.create('camunda:Properties', { values: [] });
    modeling.updateModdleProperties(definitions, extensionElements, {
      values: [...extensionElements.get('values'), camundaProperties]
    });
  }

  // 3. Atualiza ou cria a propriedade
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

function shouldRemoveProperty(value) {
  return value === undefined || value === null || value === '';
}

// Adapte ou copie as funções createExtensionElements, createCamundaProperties,
// getExtensionElements, getCamundaProperties de 'extensions-helper.js' para este arquivo
// ou ajuste os imports se você reorganizar os helpers.
// É crucial que getCamundaPropertiesContainer retorne o elemento <camunda:Properties>.
// A versão original em extensions-helper.js:
// export function getCamundaProperties(element) {
//   const bo = getBusinessObject(element); // Certifique-se que 'element' aqui é o business object
//   const properties = findExtensions(bo, 'camunda:Properties') || [];
//   if (properties.length) {
//     return properties[0];
//   }
//   return null;
// }
// findExtensions também de extensions-helper.js
// export function findExtensions(element, types) {
//   const extensionElements = getExtensionElements(element); // element é o business object
//   if (!extensionElements) {
//     return [];
//   }
//   return extensionElements.get('values').filter(value => {
//     return isAny(value, [].concat(types)); // isAny de bpmn-js/lib/features/modeling/util/ModelingUtil
//   });