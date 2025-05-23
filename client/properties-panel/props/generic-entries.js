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
 * Cria um campo de seleção múltipla genérico para o painel de propriedades.
 * @param {Object} params
 * @param {ModdleElement} params.element - Elemento BPMN.
 * @param {string} params.id - Identificador único do campo.
 * @param {string} params.propertyName - Nome da propriedade a ser manipulada.
 * @param {string} params.label - Rótulo exibido.
 * @param {Array<{value: string, label: string}>} params.options - Opções disponíveis.
 */
export function GenericMultiSelectEntry({ element, id, propertyName, label, options, description, tooltip, disabled }) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  // Get value as array
  const getValue = () => {
    const rawValue = getFixedProperty(element, propertyName);
    if (Array.isArray(rawValue)) {
      return rawValue;
    }
    if (typeof rawValue === 'string') {
      return rawValue.split(',').map(v => v.trim()).filter(Boolean);
    }
    return [];
  };

  // Set value from array
  const setValue = (selected) => {
    setFixedProperty(element, propertyName, selected.join(','), modeling, bpmnFactory);
  };

  const handleChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    setValue(selected);
  };

  const value = getValue();

  return h('div', { class: classNames('bio-properties-panel-entry'), 'data-entry-id': id },
    h('label', { for: id, class: 'bio-properties-panel-label' },
      h(Tooltip, { value: tooltip, forId: id, element: element }, translate(label))
    ),
    h('select', {
      id,
      name: id,
      class: 'bio-properties-panel-input',
      multiple: true,
      onInput: handleChange,
      value: value.length ? value : [''],
      disabled
    },
      options.map((option, idx) =>
        h('option', {
          key: idx,
          value: option.value,
          disabled: option.disabled,
          selected: value.includes(option.value)
        }, translate(option.label))
      )
    ),
    description && h(Description, { forId: id, element: element, value: description })
  );
}