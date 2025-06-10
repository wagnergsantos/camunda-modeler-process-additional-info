import { Group, ListGroup } from '@bpmn-io/properties-panel';
import { h } from 'preact';
import classNames from 'classnames';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';
import Ids from 'ids';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';
import { getCamundaProperties } from '../helper/extensions-helper';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';


/**
 * @typedef {Object} ModdleElement Represents an element in the underlying BPMN model (moddle).
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} Injector The didi dependency injector.
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
 * @typedef {Object} Translate The bpmn-js translation service.
 */

/**
 * @typedef {Object} EntryOption
 * @property {string} value - O valor interno da opção
 * @property {string} label - O rótulo exibido para o usuário
 */

/**
 * @typedef {Object} CombinedEntryProps
 * @property {string} id - ID único do componente combinado
 * @property {string} label - Rótulo do campo
 * @property {string} textFieldId - ID do campo de texto
 * @property {string} textFieldPropertyName - Nome da propriedade para o campo de texto
 * @property {string} radioId - ID do grupo de radio buttons
 * @property {string} radioPropertyName - Nome da propriedade para os radio buttons
 * @property {Array<EntryOption>} radioOptions - Opções para os radio buttons
 * @property {Injector} injector - Injetor de dependências
 */

/**
 * @typedef {Object} ActivityFieldsetProps
 * @property {ModdleElement} element - Elemento BPMN
 * @property {string} id - ID do fieldset
 * @property {string} propertyName - Nome da propriedade
 * @property {string} label - Rótulo do campo
 */

/**
 * Instância para gerar IDs únicos para as demandas.
 */
const demandIds = new Ids([16, 36, 2]); // Usando um seed diferente para evitar colisões com indicadores

/**
 * Helper para encontrar o elemento <definitions> na hierarquia do modelo BPMN.
 * @param {ModdleElement} el - Elemento BPMN a partir do qual iniciar a busca
 * @returns {ModdleElement|null} Elemento bpmn:Definitions ou null se não encontrado
 */
function getDefinitions(el) {
  const bo = getBusinessObject(el);
  if (!bo) return null;
  let current = bo;
  while (current.$parent && current.$type !== 'bpmn:Definitions') {
    current = current.$parent;
  }
  return current.$type === 'bpmn:Definitions' ? current : null;
}

/**
 * Extrai os IDs das demandas existentes no elemento BPMN (Definitions).
 * @param {ModdleElement} el - Elemento bpmn:Definitions
 * @returns {Array<string>} Lista de IDs únicos das demandas encontradas
 */
function getDemandIds(el) {
  const definitions = getDefinitions(el) || el;
  if (!definitions || definitions.$type !== 'bpmn:Definitions') return [];

  const camundaProps = getCamundaProperties(definitions);
  if (!camundaProps || !camundaProps.get('values')) return [];

  const regex = /^processo:situacao:demandas:(.*?):/; // Mudança aqui - removido ':valor'
  const demandIdsSet = new Set();
  for (const prop of camundaProps.get('values')) {
    const match = prop.name.match(regex);
    if (match && match[1]) {
      demandIdsSet.add(match[1]);
    }
  }
  return Array.from(demandIdsSet);
}

/**
 * Cria o grupo de propriedades "Dados da situação atual" para o painel de propriedades.
 * Este grupo contém campos para documentar a situação atual do processo, incluindo:
 * - Periodicidade do processo
 * - Tempo de execução
 * - Quantidade de demandas
 * - Capacidade de execução
 * - Informações sobre executores
 * - Contagem de atividades por tipo
 * - Indicador de desempenho
 *
 * @param {ModdleElement} element - Elemento BPMN (espera-se `bpmn:Definitions`).
 * @param {Injector} injector - Injetor de dependências do Camunda Modeler.
 * @returns {PropertyGroup} Grupo de propriedades configurado para o painel.
 */
export function CurrentSituationGroup(element, injector) {
  const modeling = injector.get('modeling');
  const bpmnFactory = injector.get('bpmnFactory');
  const eventBus = injector.get('eventBus');
  const translate = injector.get('translate');

  /**
   * Manipulador para adicionar uma nova demanda.
   * @param {Event} event - Evento do DOM
   */
  function addDemand(event) {
    event.stopPropagation();
    const newId = demandIds.next();
    
    const definitions = getDefinitions(element) || element;
    const bpmnFactory = injector.get('bpmnFactory');
    
    // Get or create camunda:Properties
    let camundaProps = getCamundaProperties(definitions);
    if (!camundaProps) {
      const extensionElements = bpmnFactory.create('bpmn:ExtensionElements');
      camundaProps = bpmnFactory.create('camunda:Properties');
      extensionElements.get('values').push(camundaProps);
      modeling.updateProperties(definitions, {
        extensionElements: extensionElements
      });
    }

    // Create new property objects using bpmnFactory
    const valorProp = bpmnFactory.create('camunda:Property', {
      name: `processo:situacao:demandas:${newId}:valor`,
      value: '0'
    });
    
    const tipoProp = bpmnFactory.create('camunda:Property', {
      name: `processo:situacao:demandas:${newId}:tipo`,
      value: 'estimado'
    });

    // Update properties
    const currentValues = camundaProps.get('values') || [];
    modeling.updateModdleProperties(definitions, camundaProps, {
      values: [...currentValues, valorProp, tipoProp]
    });

    // Force panel update by firing multiple events
    eventBus.fire('elements.changed', { elements: [definitions] });
    eventBus.fire('propertiesPanel.changed');
    // Force element selection refresh to trigger panel update
    const selection = injector.get('selection');
    const elementRegistry = injector.get('elementRegistry');
    const currentSelection = selection.get();
    selection.select(null);
    setTimeout(() => {
      selection.select(currentSelection);
    }, 0);
  }

  /**
   * Lista de entradas (fields) exibidas no grupo "Dados da situação atual".
   * Cada entrada representa um campo ou conjunto de campos relacionados.
   * @type {Array<Object>}
   */
  const entries = [
    /**
     * Campo de seleção para a periodicidade do processo.
     * Permite escolher entre diferentes intervalos de tempo ou sob demanda.
     */
    {
      id: 'process-periodicity',
      component: props => GenericSelectEntry({
        ...props,
        element,
        id: 'process-periodicity',
        propertyName: 'processo:situacao:periodicidade',
        label: 'Periodicidade',
        options: [
          { value: 'diaria', label: 'Diária' },
          { value: 'semanal', label: 'Semanal' },
          { value: 'quinzenal', label: 'Quinzenal' },
          { value: 'mensal', label: 'Mensal' },
          { value: 'bimestral', label: 'Bimestral' },
          { value: 'trimestral', label: 'Trimestral' },
          { value: 'quadrimestral', label: 'Quadrimestral' },
          { value: 'semestral', label: 'Semestral' },
          { value: 'anual', label: 'Anual' },
          { value: 'sob_demanda', label: 'Por demanda' },
          { value: 'outro', label: 'Outro' }
        ]
      })
    },
    /**
     * Fieldset para Tempo de execução do processo.
     */
    {
      id: 'time-execution-fieldset',
      component: props => (
        h('div', { class: classNames('bio-properties-panel-entry', 'bio-properties-panel-combined-entry') },
          h('fieldset', { class: 'custom-thin-rounded-fieldset', style: 'margin-bottom: 12px;' },
            h('legend', { class: 'custom-thin-rounded-legend' }, 'Tempo de execução do processo'),
            h(GenericTextFieldEntry, {
              ...props,
              element,
              id: 'time-execution-textfield',
              propertyName: 'processo:situacao:tempoExecucao',
              label: 'Valor',
            }),
            h(GenericRadioEntry, {
              ...props,
              element,
              id: 'time-execution-type-radio',
              propertyName: 'processo:situacao:tempoExecucaoTipo',
              label: '',
              options: [
                { value: 'estimado', label: 'Estimado' },
                { value: 'mensurado', label: 'Mensurado' }
              ]
            })
          )
        )
      )
    },
    /**
     * Fieldset para Quantidade de demandas recebidas.
     * Usando ListGroup como em process-indicators-props.js
     */
    {
      id: 'demands-list-group',
      label: translate('Quantidade de demandas recebidas'),
      component: ListGroup,
      add: addDemand,
      items: getDemandIds(element).map(demandId => DemandPropertyItem({
        element,
        demandId,
        injector
      }))
    },
    /**
     * Fieldset para Capacidade aproximada de execução.
     */
    {
      id: 'capacity-fieldset',
      component: props => (
        h('div', { class: classNames('bio-properties-panel-entry', 'bio-properties-panel-combined-entry') },
          h('fieldset', { class: 'custom-thin-rounded-fieldset', style: 'margin-bottom: 12px;' },
            h('legend', { class: 'custom-thin-rounded-legend' }, 'Capacidade aproximada de execução do processo'),
            h(GenericTextFieldEntry, {
              ...props,
              element,
              id: 'capacity-textfield',
              propertyName: 'processo:situacao:capacidadeExecucao',
              label: 'Valor',
            }),
            h(GenericRadioEntry, {
              ...props,
              element,
              id: 'capacity-type-radio',
              propertyName: 'processo:situacao:capacidadeExecucaoTipo',
              label: '',
              options: [
                { value: 'estimado', label: 'Estimado' },
                { value: 'mensurado', label: 'Mensurado' }
              ]
            })
          )
        )
      )
    },
    /**
     * Campo de texto para quantidade de executores.
     * Aceita apenas números inteiros.
     */
    {
      id: 'executors-quantity',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'executors-quantity',
        propertyName: 'processo:situacao:quantidadeExecutores',
        label: 'Quantidade de executores do processo',
        onlyInt: true
      })
    },
    /**
     * Campo de texto multilinha para descrição do perfil dos executores.
     */
    {
      id: 'executors-profile',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'executors-profile',
        propertyName: 'processo:situacao:perfilExecutores',
        label: 'Perfil'
      })
    },
    /**
     * Grupo de campos para contagem de atividades por tipo.
     * Inclui campos para atividades manuais, de usuário e automatizadas.
     */
    {
      id: 'activities-group-fieldset',
      component: props => (
        h('div', { class: classNames('bio-properties-panel-entry', 'bio-properties-panel-combined-entry') },
          h('fieldset', { class: 'custom-thin-rounded-fieldset', style: 'margin-bottom: 12px;' },
            h('legend', { class: 'custom-thin-rounded-legend' }, 'Identificação das atividades do processo'),
            h(GenericTextFieldEntry, {
              ...props,
              element,
              id: 'activities-manual',
              propertyName: 'processo:situacao:atividadeManualQtd',
              label: h('span', { style: 'display: flex; align-items: center; gap: 4px;' },
                'Atividade manual (Qtd)',
                h('svg', { width: 16, height: 16, viewBox: 'vertical-align:middle;', xmlns: 'http://www.w3.org/2000/svg' },
                  h('g', { fill: 'none', 'fill-rule': 'evenodd' },
                    h('path', {
                      fill: '#434343',
                      d: 'M14.5,6.792 C14.11,6.599 13.653,6.703 13.477,7.023 C13.477,7.023 12.381,9.422 11.743,9.32 C11.399,9.264 11.124,8.94 11.001,8.315 L11.001,1.771 C11.001,1.345 10.562,1 10.021,1 C9.481,1 9.001,1.346 9.001,1.771 L9.001,6.938 L8.001,6.938 L8.001,0.771 C8.001,0.345 7.562,0 7.021,0 C6.481,0 6.001,0.346 6.001,0.771 L6.001,6.938 L5.001,6.938 L5.001,2.771 C5.001,2.345 4.561,2 4.02,2 C3.48,2 3.001,2.346 3.001,2.771 L3.001,11.186 C3.001,13.77 4.73,15.907 8.679,15.907 C13.562,15.907 14.884,7.719 14.884,7.719 C15.058,7.399 14.887,6.983 14.5,6.792 L14.5,6.792 Z'
                    })
                  )
                )
              )
            }),
            h(GenericTextFieldEntry, {
              ...props,
              element,
              id: 'activities-user',
              propertyName: 'processo:situacao:atividadeUsuarioQtd',
              label: h('span', { style: 'display: flex; align-items: center; gap: 4px;' },
                'Atividade de usuário (Qtd)',
                h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', style: 'vertical-align:middle;', xmlns: 'http://www.w3.org/2000/svg' },
                  h('path', { d: 'M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1Z', fill: '#000000' }),
                  h('path', { d: 'M7 14C4.23858 14 2 16.2386 2 19V22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22V19C22 16.2386 19.7614 14 17 14H7Z', fill: '#000000' })
                )
              )
            }),
            h(GenericTextFieldEntry, {
              ...props,
              element,
              id: 'activities-automated',
              propertyName: 'processo:situacao:atividadeAutomatizadaQtd',
              label: h('span', { style: 'display: flex; align-items: center; gap: 4px;' },
                'Atividade automatizada (Qtd)',
                h('svg', { width: 16, height: 16, viewBox: '0 0 17 17', style: 'vertical-align:middle;', xmlns: 'http://www.w3.org/2000/svg' },
                  h('g', { fill: 'none', 'fill-rule': 'evenodd' },
                    h('g', { transform: 'translate(1.000000, 1.000000)', fill: '#434343' },
                      h('path', { d: 'M7.887,9.025 C7.799,8.449 7.569,7.92 7.229,7.475 L7.995,6.71 L7.307,6.023 L6.536,6.794 C6.093,6.467 5.566,6.245 4.994,6.161 L4.994,5.066 L4.021,5.066 L4.021,6.155 C3.444,6.232 2.913,6.452 2.461,6.777 L1.709,6.024 L1.021,6.712 L1.761,7.452 C1.411,7.901 1.175,8.437 1.087,9.024 L0.062,9.024 L0.062,9.025 L0.062,9.998 L1.08,9.998 C1.162,10.589 1.396,11.132 1.744,11.587 L1.02,12.31 L1.708,12.997 L2.437,12.268 C2.892,12.604 3.432,12.83 4.02,12.91 L4.02,13.958 L4.993,13.958 L4.993,12.904 C5.576,12.818 6.11,12.589 6.56,12.252 L7.306,12.999 L7.994,12.311 L7.248,11.564 C7.586,11.115 7.812,10.581 7.893,10 L8.952,10 L8.952,9.998 L8.952,9.026 L7.887,9.026 L7.887,9.025 z M4.496,11.295 C3.512,11.295 2.715,10.497 2.715,9.512 C2.715,8.528 3.512,7.73 4.496,7.73 C5.481,7.73 6.28,8.528 6.28,9.512 C6.28,10.497 5.481,11.295 4.496,11.295 L4.496,11.295 z' }),
                      h('path', { d: 'M13.031,3.37 L14.121,3.089 L13.869,2.11 L12.778,2.392 C12.66,2.152 12.513,1.922 12.317,1.72 C12.125,1.524 11.902,1.376 11.67,1.256 L11.971,0.177 L10.998,-0.094 L10.699,0.978 C10.158,0.935 9.608,1.056 9.133,1.36 L8.373,0.584 L7.652,1.291 L8.408,2.061 C8.082,2.531 7.939,3.085 7.967,3.636 L6.927,3.904 L7.179,4.881 L8.217,4.613 C8.334,4.856 8.483,5.088 8.682,5.291 C8.885,5.499 9.121,5.653 9.368,5.776 L9.079,6.815 L10.05,7.086 L10.343,6.038 C10.885,6.071 11.435,5.938 11.906,5.623 L12.677,6.409 L13.397,5.702 L12.621,4.911 C12.928,4.446 13.06,3.905 13.031,3.37 L13.031,3.37 z M10.514,4.987 C9.691,4.987 9.023,4.318 9.023,3.494 C9.023,2.672 9.691,2.005 10.514,2.005 C11.336,2.005 12.004,2.672 12.004,3.494 C12.004,4.318 11.336,4.987 10.514,4.987 L10.514,4.987 z' })
                    )
                  )
                )
              )
            })
          )
        )
      )
    },
    /**
     * Campo de seleção para indicar se o processo possui indicador de desempenho.
     */
    {
      id: 'performance-indicator',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'performance-indicator',
        propertyName: 'processo:situacao:possuiIndicador',
        label: 'O processo possui indicador de desempenho?',
        options: [
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' }
        ]
      })
    }
  ];

  // Retorna o grupo configurado para ser exibido no painel de propriedades
  return {
    id: 'current-situation',
    label: translate('Dados da situação atual'),
    component: Group,
    entries
  };
}

/**
 * Cria um item de propriedade para uma demanda específica.
 * Cada item contém campos para editar as propriedades da demanda:
 * - Valor (numérico)
 * - Tipo (Estimado/Mensurado)
 *
 * @param {Object} props - Propriedades do componente
 * @param {ModdleElement} props.element - Elemento BPMN (bpmn:Definitions)
 * @param {string} props.demandId - ID da demanda
 * @param {Injector} props.injector - Injetor de dependências
 * @returns {Object} Configuração do item de propriedade para ListGroup
 */
function DemandPropertyItem(props) {
  const { element, demandId, injector } = props;
  const modeling = injector.get('modeling');
  const eventBus = injector.get('eventBus');
  const translate = injector.get('translate');
  const bpmnFactory = injector.get('bpmnFactory');

  const valuePropName = `processo:situacao:demandas:${demandId}:valor`;
  const typePropName = `processo:situacao:demandas:${demandId}:tipo`;
  
  const definitions = getDefinitions(element) || element;
  const actualDemandValue = getFixedProperty(definitions, valuePropName) || '0';
  const itemLabel = `${translate('Demanda')} #${demandId}${actualDemandValue ? ' - ' + actualDemandValue : ''}`;

  function handleRemove(event) {
    event.stopPropagation();
    const camundaProps = getCamundaProperties(definitions);
    if (camundaProps && camundaProps.get('values')) {
      const prefix = `processo:situacao:demandas:${demandId}:`;
      const values = camundaProps.get('values').filter(p => !p.name.startsWith(prefix));
      modeling.updateModdleProperties(definitions, camundaProps, { values });
      eventBus.fire('elements.changed', { elements: [definitions] });
    }
  }

  function updateProperty(propertyName, value) {
    const definitions = getDefinitions(element) || element;
    const bpmnFactory = injector.get('bpmnFactory');
    
    let camundaProps = getCamundaProperties(definitions);
    if (!camundaProps) {
      const extensionElements = bpmnFactory.create('bpmn:ExtensionElements');
      camundaProps = bpmnFactory.create('camunda:Properties');
      extensionElements.get('values').push(camundaProps);
      modeling.updateProperties(definitions, {
        extensionElements: extensionElements
      });
    }

    const currentValues = camundaProps.get('values') || [];
    const existingPropIndex = currentValues.findIndex(p => p.name === propertyName);
    
    if (existingPropIndex >= 0) {
      // Update existing property
      const updatedValues = [...currentValues];
      updatedValues[existingPropIndex] = bpmnFactory.create('camunda:Property', {
        name: propertyName,
        value: value
      });
      modeling.updateModdleProperties(definitions, camundaProps, {
        values: updatedValues
      });
    } else {
      // Add new property
      const newProp = bpmnFactory.create('camunda:Property', {
        name: propertyName,
        value: value
      });
      modeling.updateModdleProperties(definitions, camundaProps, {
        values: [...currentValues, newProp]
      });
    }

    eventBus.fire('elements.changed', { elements: [definitions] });
  }

  return {
    id: `demand-item-${demandId}`,
    label: itemLabel,
    remove: handleRemove,
    entries: [
      {
        id: `demand-value-${demandId}`,
        component: (entryProps) => GenericTextFieldEntry({
          ...entryProps,
          element: definitions,
          id: `demand-value-${demandId}`,
          propertyName: valuePropName,
          label: translate('Valor'),
          onlyInt: true,
          getValue: () => getFixedProperty(definitions, valuePropName) || '0',
          setValue: (value) => updateProperty(valuePropName, value)
        })
      },
      {
        id: `demand-type-${demandId}`,
        component: (entryProps) => GenericRadioEntry({
          ...entryProps,
          element: definitions,
          id: `demand-type-${demandId}`,
          propertyName: typePropName,
          label: '',
          options: [
            { value: 'estimado', label: translate('Estimado') },
            { value: 'mensurado', label: translate('Mensurado') }
          ],
          getValue: () => getFixedProperty(definitions, typePropName) || 'estimado',
          setValue: (value) => updateProperty(typePropName, value)
        })
      }
    ],
    autoFocusEntry: `demand-value-${demandId}`
  };
}