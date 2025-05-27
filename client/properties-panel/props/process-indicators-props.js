import { useService } from 'bpmn-js-properties-panel';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { ListGroup, SelectEntry, TextAreaEntry, TextFieldEntry } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  createIndicatorProperty,
  isIndicatorProperty,
  parseIndicatorProperty,
  updateIndicatorProperty
} from '../helper/process-indicator-helper'; 

import {
  createExtensionElements,
  createCamundaProperties,
  getExtensionElements,
  getCamundaProperties
} from '../helper/extensions-helper';

import Ids from 'ids';

const ids = new Ids([ 16, 36, 1 ]);

export function createInputSpecificationGroup(element, injector) {
  const translate = injector.get('translate');

  const processBo = getProcessBo(element);

  const properties = getIOSpecificationProperties('processo:indicadores', processBo);

  const inputSpecificationGroup = {
    id: 'process-indicators-group',
    label: translate('Indicadores do Processo'),
    component: ListGroup,
    add: addPropertyFactory('processo:indicadores', element, injector),
    items: properties.map(function(property, index) {
      const id = `${element.id}-process-indicators-${index}`;

      return PropertyItem({
        id,
        element,
        property,
        injector
      });
    })
  };

  return inputSpecificationGroup;
}


function addPropertyFactory(propertyType, element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    const property = createIndicatorProperty(bpmnFactory, {
      type: propertyType,
      name: `id_${ids.next()}`,
      objetivo: '',
      formula: '',
      meta: '',
      ultimaMedicao: '',
      resultado: '',
      description: ''
    });

    const businessObject = getBusinessObject(element);

    const extensionElements = getExtensionElements(element),
          camundaProperties = getCamundaProperties(businessObject);

    let updatedBusinessObject, update;

    if (!extensionElements) {
      updatedBusinessObject = businessObject;

      const extensionElements = createExtensionElements(businessObject, bpmnFactory),
            camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, { values: [ property ] });
      extensionElements.values.push(camundaProperties);
      property.$parent = camundaProperties;

      update = { extensionElements };
    } else if (!camundaProperties) {
      updatedBusinessObject = extensionElements;

      const camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, { values: [ property ] });
      property.$parent = camundaProperties;

      update = { values: extensionElements.get('values').concat(camundaProperties) };
    } else {
      updatedBusinessObject = camundaProperties;
      property.$parent = camundaProperties;

      update = { values: camundaProperties.get('values').concat(property) };
    }

    modeling.updateModdleProperties(element, updatedBusinessObject, update);
  }

  return add;
}

function removeFactory(element, property, modeling) {
  return function(event) {
    event.stopPropagation();

    const businessObject = getBusinessObject(element);

    const camundaProperties = getCamundaProperties(businessObject);

    modeling.updateModdleProperties(element, camundaProperties, {
      values: camundaProperties.get('values').filter(value => value !== property)
    });
  };
}

function PropertyItem(props) {
  const {
    id,
    element,
    property,
    injector
  } = props;

  const parsed = parseIndicatorProperty(property);

  return {
    id,
    label: parsed.nome || parsed.id || '', // agora pode usar parsed.id com consistência
    entries: [
      {
        id: `${id}-id`,
        component: IndicatorId,
        property,
        element
      },
      {
        id: `${id}-nome`,
        component: IndicatorNome,
        property,
        element
      },
      {
        id: `${id}-objetivo`,
        component: IndicatorObjetivo,
        property,
        element
      },
      {
        id: `${id}-formula`,
        component: IndicatorFormula,
        property,
        element
      },
      {
        id: `${id}-meta`,
        component: IndicatorMeta,
        property,
        element
      },
      {
        id: `${id}-ultima-medicao`,
        component: IndicatorUltimaMedicao,
        property,
        element
      },
      {
        id: `${id}-resultado`,
        component: IndicatorResultado,
        property,
        element
      }
    ],
    autoFocusEntry: id + '-id',
    remove: removeFactory(element, property, injector.get('modeling'))
  };
}

// Função utilitária para parsear e atualizar os campos extras
function parseIndicatorPropertyWrapper(property) {
  // Espera value no formato: nome;objetivo;formula;meta;ultimaMedicao;resultado
  const parsed = parseIndicatorProperty(property);
  return {
    id: parsed.id || '',
    nome: parsed.nome || '',
    objetivo: parsed.objetivo || '',
    formula: parsed.formula || '',
    meta: parsed.meta || '',
    ultimaMedicao: parsed.ultimaMedicao || '',
    resultado: parsed.resultado || ''
  };
}

function updateIndicatorPropertyWrapper(element, property, newProps, modeling) {
  const current = parseIndicatorPropertyWrapper(property);
  const updated = { ...current, ...newProps };

  // Garante que name nunca será undefined ao atualizar
  const safeName = updated.id || current.id || property.name?.replace(/^processo:indicadores:/, '') || `id_${ids.next()}`;

  return updateIndicatorProperty(element, property, {
    name: safeName, // sempre use name, nunca id
    nome: updated.nome,
    objetivo: updated.objetivo,
    formula: updated.formula,
    meta: updated.meta,
    ultimaMedicao: updated.ultimaMedicao,
    resultado: updated.resultado
  }, modeling);
}

// ID
function IndicatorId(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  // Não precisa mais de setValue nem validate, pois será somente leitura
  const getValue = () => parseIndicatorPropertyWrapper(property).id || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('ID'),
    getValue,
    debounce,
    disabled: true // torna o campo somente leitura
  });
}

// Nome
function IndicatorNome(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { nome: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).nome || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Nome'),
    getValue,
    setValue,
    debounce
  });
}

// Objetivo
function IndicatorObjetivo(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { objetivo: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).objetivo || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Objetivo'),
    getValue,
    setValue,
    debounce
  });
}

// Fórmula
function IndicatorFormula(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { formula: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).formula || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Fórmula'),
    getValue,
    setValue,
    debounce
  });
}

// Meta
function IndicatorMeta(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { meta: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).meta || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Meta'),
    getValue,
    setValue,
    debounce
  });
}

// Última medição
function IndicatorUltimaMedicao(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { ultimaMedicao: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).ultimaMedicao || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Última medição'),
    getValue,
    setValue,
    debounce
  });
}

// Resultado
function IndicatorResultado(props) {
  const { id, element, property } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => updateIndicatorPropertyWrapper(element, property, { resultado: value || '' }, modeling);
  const getValue = () => parseIndicatorPropertyWrapper(property).resultado || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('Resultado'),
    getValue,
    setValue,
    debounce
  });
}


// helper

/**
 * Get process business object from process element or participant.
 */
function getProcessBo(element) {
  const bo = getBusinessObject(element);

  if (is(element, 'bpmn:Participant')) {
    bo = bo.processRef;
  }

  return bo;
}

function getIOSpecificationProperties(type, processBo) {
  const camundaProperties = getCamundaProperties(processBo);

  if (!camundaProperties) {
    return [];
  }

  return camundaProperties.get('values')
    .filter(property => isIndicatorProperty(property))
    .filter(property => parseIndicatorProperty(property).type === type);
}
