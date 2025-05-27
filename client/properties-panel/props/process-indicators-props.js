/**
 * Provedor de propriedades para o painel de indicadores do processo.
 * Permite criar, visualizar e editar indicadores customizados em elementos do tipo processo.
 * Cada indicador possui os campos: ID (somente leitura), Nome, Objetivo, Fórmula, Meta, Última medição e Resultado.
 */

import { useService } from 'bpmn-js-properties-panel';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { ListGroup, TextFieldEntry } from '@bpmn-io/properties-panel';
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

/**
 * Cria o grupo de indicadores do processo para o painel de propriedades.
 */
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

/**
 * Factory para adicionar um novo indicador ao processo.
 */
function addPropertyFactory(propertyType, element, injector) {
  const bpmnFactory = injector.get('bpmnFactory'),
        modeling = injector.get('modeling');

  function add(event) {
    event.stopPropagation();

    // Garante que o id nunca será undefined
    const newId = `id_${ids.next()}`;

    // Cria um novo indicador com ID único e campos vazios
    const property = createIndicatorProperty(bpmnFactory, {
      type: propertyType,
      name: newId, // sempre definido
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

/**
 * Factory para remover um indicador do processo.
 */
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

/**
 * Cria o item de propriedade para cada indicador, com todos os campos editáveis.
 */
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
    // Exibe o nome do indicador ou o ID caso o nome esteja vazio
    label: parsed.nome || parsed.id || '',
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

/**
 * Função utilitária para parsear os campos do indicador.
 * Espera value no formato: nome;objetivo;formula;meta;ultimaMedicao;resultado
 */
function parseIndicatorPropertyWrapper(property) {
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

/**
 * Atualiza os campos do indicador no model.
 */
function updateIndicatorPropertyWrapper(element, property, newProps, modeling) {
  const current = parseIndicatorPropertyWrapper(property);
  const updated = { ...current, ...newProps };

  return updateIndicatorProperty(element, property, {
    id: updated.id,
    nome: updated.nome,
    objetivo: updated.objetivo,
    formula: updated.formula,
    meta: updated.meta,
    ultimaMedicao: updated.ultimaMedicao,
    resultado: updated.resultado
  }, modeling);
}

// Componentes de entrada para cada campo do indicador

/**
 * Campo ID (somente leitura).
 */
function IndicatorId(props) {
  const { id, element, property } = props;
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const getValue = () => parseIndicatorPropertyWrapper(property).id || '';
  return TextFieldEntry({
    element: property,
    id,
    label: translate('ID'),
    getValue,
    debounce,
    disabled: true
  });
}

/**
 * Campo Nome.
 */
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

/**
 * Campo Objetivo.
 */
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

/**
 * Campo Fórmula.
 */
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

/**
 * Campo Meta.
 */
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

/**
 * Campo Última medição.
 */
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

/**
 * Campo Resultado.
 */
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

// Helpers

/**
 * Retorna o business object do processo a partir do elemento ou participante.
 */
function getProcessBo(element) {
  const bo = getBusinessObject(element);
  if (is(element, 'bpmn:Participant')) {
    return bo.processRef;
  }
  return bo;
}

/**
 * Retorna as propriedades de indicadores do processo.
 */
function getIOSpecificationProperties(type, processBo) {
  const camundaProperties = getCamundaProperties(processBo);
  if (!camundaProperties) {
    return [];
  }
  return camundaProperties.get('values')
    .filter(property => isIndicatorProperty(property))
    .filter(property => parseIndicatorProperty(property).type === type);
}
