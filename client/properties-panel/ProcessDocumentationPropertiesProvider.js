// client/properties-panel/ProcessDocumentationPropertiesProvider.js
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { ProcessDocumentationGroup } from './props/process-documentation-props';
import { CurrentSituationGroup } from './props/current-situation-props';
import { createInputSpecificationGroup, createOutputSpecificationGroup } from './props/process-indicators-props';

export default class ProcessDocumentationPropertiesProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }

  getTabs(element) {
    // Sempre exibe a aba, independente do tipo de elemento
    const groups = [];
    const processDocumentationGroup = ProcessDocumentationGroup(element, this._injector);
    
    if (processDocumentationGroup) {
      groups.push(processDocumentationGroup);
    }

    return [
      {
        id: 'generalInfo',
        label: 'Informações gerais',
        groups
      }
    ];
  }

  getGroups(element) {
    return (groups) => {
      groups = groups.slice();

      const definitionsElement = findDefinitionsElement(this._injector);

      if (!definitionsElement) {
        return groups;
      }

      // Grupo de Informações gerais
      const infoGroup = {
        id: 'generalInfo',
        label: 'Informações gerais',
        entries: []
      };

      const processDocumentationGroup = ProcessDocumentationGroup(definitionsElement, this._injector);

      if (processDocumentationGroup && processDocumentationGroup.entries) {
        infoGroup.entries.push(...processDocumentationGroup.entries);
      }

      // Adiciona o novo grupo de situação atual
      const currentSituationGroup = CurrentSituationGroup(definitionsElement, this._injector);

      groups.push(infoGroup);
      groups.push(currentSituationGroup);
      groups.push(createInputSpecificationGroup(element, this._injector));

      return groups;
    };
  }
}

ProcessDocumentationPropertiesProvider.$inject = [
  'propertiesPanel',
  'injector'
];

// Função utilitária para encontrar o elemento bpmn:Process do diagrama
function findProcessElement(element, injector) {
  const modeling = injector.get('elementRegistry', false);
  if (!modeling) return null;

  // Procura o primeiro elemento do tipo bpmn:Process
  const allElements = modeling.getAll ? modeling.getAll() : modeling._elements ? Object.values(modeling._elements).map(e => e.element) : [];
  const processElement = allElements.find(el => is(el, 'bpmn:Process'));
  return processElement || null;
}

function getProcessRef(element) {
  const bo = getBusinessObject(element);
  return bo.processRef;
}

// Nova implementação para encontrar o elemento definitions
function findDefinitionsElement(injector) {
  const modeler = injector.get('bpmnjs', false);
  if (!modeler) return null;

  // Garantir que pegamos o definitions
  const definitions = modeler.getDefinitions();
  console.debug('definitions type:', definitions && definitions.$type); // DEBUG
  return definitions;
}