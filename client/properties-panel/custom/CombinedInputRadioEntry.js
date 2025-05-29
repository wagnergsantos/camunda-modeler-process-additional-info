import { h } from 'preact';
import {
  TextFieldEntry,
  Description
} from '@bpmn-io/properties-panel';
import RadioEntry from '../custom/RadioEntry';
import { useService } from 'bpmn-js-properties-panel';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';
import classNames from 'classnames';

/**
 * @typedef {Object} ModdleElement
 * @description Representa um elemento no modelo BPMN subjacente.
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} RadioOption
 * @property {string} value - Valor interno da opção
 * @property {string} label - Rótulo exibido para o usuário
 */

/**
 * @typedef {Object} CombinedInputRadioEntryProps
 * @property {ModdleElement} element - Elemento BPMN associado
 * @property {string} id - Identificador único do componente combinado
 * @property {string} label - Rótulo do grupo combinado
 * @property {string} textFieldId - ID do campo de texto
 * @property {string} textFieldPropertyName - Nome da propriedade para o campo de texto
 * @property {string} radioId - ID do grupo de radio buttons
 * @property {string} radioPropertyName - Nome da propriedade para os radio buttons
 * @property {Array<RadioOption>} radioOptions - Opções para os radio buttons
 * @property {string} [description] - Descrição adicional do campo
 * @property {Object} injector - Injetor de dependências do Camunda Modeler
 */

/**
 * Componente combinado que renderiza um campo de texto e um grupo de radio buttons lado a lado.
 * Usado para entradas que possuem um valor textual e uma seleção entre opções mutuamente exclusivas.
 * 
 * @param {CombinedInputRadioEntryProps} props - Propriedades do componente
 * @returns {Object} Elemento virtual do Preact
 * 
 * @example
 * <CombinedInputRadioEntry
 *   element={element}
 *   id="combined-entry"
 *   label="Tempo de execução do processo"
 *   textFieldId="time-execution-textfield"
 *   textFieldPropertyName="processo:situacao:tempoExecucao"
 *   radioId="time-execution-type-radio"
 *   radioPropertyName="processo:situacao:tempoExecucaoTipo"
 *   radioOptions={[
 *     { value: 'estimado', label: 'Estimado' },
 *     { value: 'mensurado', label: 'Mensurado' }
 *   ]}
 *   injector={injector}
 * />
 */
export default function CombinedInputRadioEntry(props) {
  const {
    element,
    id,
    label,
    textFieldId,
    textFieldPropertyName,
    radioId,
    radioPropertyName,
    radioOptions,
    description,
    injector
  } = props;

  const translate = useService('translate');
  const modeling = useService('modeling');
  const bpmnFactory = useService('bpmnFactory');
  const debounce = useService('debounceInput');

  /**
   * Obtém o valor atual do campo de texto.
   * @returns {string} Valor atual do campo
   */
  const textFieldGetValue = () => getFixedProperty(element, textFieldPropertyName);

  /**
   * Define o novo valor do campo de texto.
   * @param {string} value - Novo valor
   */
  const textFieldSetValue = (value) => {
    setFixedProperty(element, textFieldPropertyName, value, modeling, bpmnFactory);
  };

  /**
   * Obtém o valor atual do radio button.
   * @returns {string} Valor atual selecionado
   */
  const radioGetValue = () => getFixedProperty(element, radioPropertyName);

  /**
   * Define o novo valor do radio button.
   * @param {string} value - Novo valor selecionado
   */
  const radioSetValue = (value) => {
    setFixedProperty(element, radioPropertyName, value, modeling, bpmnFactory);
  };

  return (
    h('div', { class: classNames('bio-properties-panel-entry', 'bio-properties-panel-combined-entry'), 'data-entry-id': id },
      h('fieldset', { class: 'bio-properties-panel-fieldset custom-thin-rounded-fieldset' },
        h('legend', { class: 'bio-properties-panel-legend custom-thin-rounded-legend' }, translate(label)),
        h('div', { class: 'bio-properties-panel-panel' },
            h(TextFieldEntry, {
              element,
              id: textFieldId,
              label: '',
              getValue: textFieldGetValue,
              setValue: textFieldSetValue,
              debounce,
              description: '',
            }),
            h(RadioEntry, {
              element,
              id: radioId,
              label: '',
              getValue: radioGetValue,
              setValue: radioSetValue,
              getOptions: () => radioOptions.map(opt => ({ ...opt, label: translate(opt.label) })),
              description: '',
            })
          ,
          description && h(Description, { forId: id, element: element, value: description })
        )
      )
    )
  );
}
