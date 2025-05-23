import { TextFieldEntry, TextAreaEntry, SelectEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import RadioEntry from '../custom/RadioEntry';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';
import { h } from 'preact';
import { Description, Tooltip } from '@bpmn-io/properties-panel';
import classNames from 'classnames';

/**
 * Cria um campo de texto genérico para o painel de propriedades.
 * @param {Object} params
 * @param {ModdleElement} params.element - Elemento BPMN.
 * @param {string} params.id - Identificador único do campo.
 * @param {string} params.propertyName - Nome da propriedade a ser manipulada.
 * @param {string} params.label - Rótulo exibido.
 * @param {boolean} [params.onlyInt] - Se verdadeiro, permite apenas números inteiros.
 */
export function GenericTextFieldEntry({ element, id, propertyName, label, onlyInt }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  return TextFieldEntry({
    element,
    id,
    label: typeof label === 'string' ? translate(label) : label, // Corrigido: só traduz string
    getValue: () => getFixedProperty(element, propertyName),
    setValue: value => {
      let v = value;
      if (onlyInt) v = value.replace(/\D/g, '');
      setFixedProperty(element, propertyName, v, modeling, bpmnFactory);
    },
    debounce
  });
}

/**
 * Cria um campo de área de texto genérico para o painel de propriedades.
 * @param {Object} params
 * @param {ModdleElement} params.element - Elemento BPMN.
 * @param {string} params.id - Identificador único do campo.
 * @param {string} params.propertyName - Nome da propriedade a ser manipulada.
 * @param {string} params.label - Rótulo exibido.
 */
export function GenericTextAreaEntry({ element, id, propertyName, label }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  return TextAreaEntry({
    element,
    id,
    label: translate(label),
    getValue: () => getFixedProperty(element, propertyName),
    setValue: value => setFixedProperty(element, propertyName, value, modeling, bpmnFactory),
    debounce
  });
}

/**
 * Cria um campo de seleção por rádio genérico para o painel de propriedades.
 * @param {Object} params
 * @param {ModdleElement} params.element - Elemento BPMN.
 * @param {string} params.id - Identificador único do campo.
 * @param {string} params.propertyName - Nome da propriedade a ser manipulada.
 * @param {string} params.label - Rótulo exibido.
 * @param {Array<{value: string, label: string}>} params.options - Opções disponíveis.
 */
export function GenericRadioEntry({ element, id, propertyName, label, options }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const bpmnFactory = useService('bpmnFactory');

  return RadioEntry({
    element,
    id,
    label: label ? translate(label) : '', // <-- Evita erro se label for undefined
    getValue: () => getFixedProperty(element, propertyName),
    setValue: value => setFixedProperty(element, propertyName, value, modeling, bpmnFactory),
    getOptions: () => options.map(opt => ({ value: opt.value, label: translate(opt.label) }))
  });
}

/**
 * Cria um campo de seleção (dropdown) genérico para o painel de propriedades.
 * @param {Object} params
 * @param {ModdleElement} params.element - Elemento BPMN.
 * @param {string} params.id - Identificador único do campo.
 * @param {string} params.propertyName - Nome da propriedade a ser manipulada.
 * @param {string} params.label - Rótulo exibido.
 * @param {Array<{value: string, label: string}>} params.options - Opções disponíveis.
 */
export function GenericSelectEntry({ element, id, propertyName, label, options }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  return SelectEntry({
    element,
    id,
    label: translate(label),
    getValue: () => getFixedProperty(element, propertyName),
    setValue: value => setFixedProperty(element, propertyName, value, modeling, bpmnFactory),
    getOptions: () => options.map(opt => ({ value: opt.value, label: translate(opt.label) })),
    debounce
  });
}

/**
 * Cria um grupo de opções com radio buttons dentro de um fieldset.
 */
export function GenericAnalysisSectionEntry({ element, id, propertyName, label, options }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const bpmnFactory = useService('bpmnFactory');

  const getValue = (optionValue) => {
    return getFixedProperty(element, `${propertyName}:${optionValue}`) || '';
  };

  const setValue = (optionValue, value) => {
    setFixedProperty(
      element, 
      `${propertyName}:${optionValue}`, 
      value, 
      modeling, 
      bpmnFactory
    );
  };

  return h('div', { class: classNames('bio-properties-panel-entry', 'bio-properties-panel-combined-entry') },
    h('fieldset', { class: 'custom-thin-rounded-fieldset', style: 'margin-bottom: 12px;' },
      h('legend', { class: 'custom-thin-rounded-legend' }, translate(label)),
      options.map((option) => 
        h('div', { class: 'bio-properties-panel-radio-wrapper', style: 'margin-bottom: 10px;' },
          h('label', { class: 'bio-properties-panel-label' }, translate(option.label)),
          h('div', { class: 'bio-properties-panel-radio-group' },
            [
              { value: 'sim', label: 'Sim' },
              { value: 'nao', label: 'Não' }
            ].map(radio => 
              h('span', { style: 'margin-right: 15px;' },
                h('input', {
                  type: 'radio',
                  name: `${id}_${option.value}`,
                  value: radio.value,
                  checked: getValue(option.value) === radio.value,
                  onChange: (e) => setValue(option.value, e.target.value)
                }),
                h('label', { style: 'margin-left: 5px;' }, radio.label)
              )
            )
          )
        )
      )
    )
  );
}