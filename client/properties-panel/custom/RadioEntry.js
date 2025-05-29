import { h } from 'preact';
import { Description, Tooltip } from '@bpmn-io/properties-panel';
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
 * @property {boolean} [disabled] - Indica se a opção está desabilitada
 */

/**
 * @typedef {Object} RadioEntryProps
 * @property {ModdleElement} element - Elemento BPMN associado
 * @property {string} id - Identificador único do componente
 * @property {string} [description] - Descrição adicional do campo
 * @property {string} label - Rótulo do grupo de radio buttons
 * @property {function(): string} getValue - Função para obter o valor atual
 * @property {function(string): void} setValue - Função para definir o novo valor
 * @property {function(ModdleElement): Array<RadioOption>} getOptions - Função que retorna as opções disponíveis
 * @property {boolean} [disabled] - Indica se todo o grupo está desabilitado
 * @property {function(): void} [onFocus] - Handler para evento de foco
 * @property {function(): void} [onBlur] - Handler para evento de perda de foco
 * @property {string} [tooltip] - Texto de ajuda
 */

/**
 * Componente personalizado de entrada por radio buttons.
 * Renderiza um grupo de opções mutuamente exclusivas usando radio buttons,
 * seguindo o estilo visual do painel de propriedades do BPMN.
 * 
 * @param {RadioEntryProps} props - Propriedades do componente
 * @returns {Object} Elemento virtual do Preact
 * 
 * @example
 * // Uso básico
 * <RadioEntry
 *   element={element}
 *   id="my-radio-group"
 *   label="Escolha uma opção"
 *   getValue={() => getProperty(element, 'myProperty')}
 *   setValue={value => setProperty(element, 'myProperty', value)}
 *   getOptions={() => [
 *     { value: 'option1', label: 'Opção 1' },
 *     { value: 'option2', label: 'Opção 2' }
 *   ]}
 * />
 */
export default function RadioEntry(props) {
  const {
    element,
    id,
    description,
    label,
    getValue,
    setValue,
    getOptions,
    disabled,
    onFocus,
    onBlur,
    tooltip
  } = props;

  const options = getOptions(element);
  const value = getValue(element) || '';

  /**
   * Manipula a mudança de valor do radio button selecionado.
   * @param {Event} event - Evento de mudança do input
   */
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    h('div', { class: classNames('bio-properties-panel-entry'), 'data-entry-id': id },
      label && h('label', { class: 'bio-properties-panel-label' },
        h(Tooltip, { value: tooltip, forId: id, element: element }, label)
      ),
      h('div', { class: 'bio-properties-panel-radio-group' },
        options.map((option, idx) =>
          h('label', { key: idx, class: 'bio-properties-panel-radio' },
            h('input', {
              type: 'radio',
              name: id,
              value: option.value,
              checked: value === option.value,
              disabled: disabled || option.disabled,
              onInput: handleChange,
              onFocus,
              onBlur
            }),
            option.label
          )
        )
      ),
      h(Description, { forId: id, element: element, value: description })
    )
  );
}
