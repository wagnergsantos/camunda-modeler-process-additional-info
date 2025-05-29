import { h } from 'preact';
import { Description, Tooltip } from '@bpmn-io/properties-panel';
import classNames from 'classnames';

/**
 * @typedef {Object} ModdleElement
 * @description Representa um elemento no modelo BPMN subjacente.
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} SelectOption
 * @property {string} value - Valor interno da opção
 * @property {string} label - Rótulo exibido para o usuário
 * @property {boolean} [disabled] - Indica se a opção está desabilitada
 */

/**
 * @typedef {Object} MultiSelectEntryProps
 * @property {ModdleElement} element - Elemento BPMN associado
 * @property {string} id - Identificador único do componente
 * @property {string} [description] - Descrição adicional do campo
 * @property {string} label - Rótulo do grupo de seleção múltipla
 * @property {function(): Array<string>} getValue - Função para obter os valores selecionados
 * @property {function(Array<string>): void} setValue - Função para definir os novos valores
 * @property {function(ModdleElement): Array<SelectOption>} getOptions - Função que retorna as opções disponíveis
 * @property {boolean} [disabled] - Indica se o componente está desabilitado
 * @property {function(): void} [onFocus] - Handler para evento de foco
 * @property {function(): void} [onBlur] - Handler para evento de perda de foco
 * @property {string} [tooltip] - Texto de ajuda
 */

/**
 * Componente personalizado de seleção múltipla.
 * Renderiza um campo select com múltiplas opções selecionáveis,
 * seguindo o estilo visual do painel de propriedades do BPMN.
 * 
 * @param {MultiSelectEntryProps} props - Propriedades do componente
 * @returns {Object} Elemento virtual do Preact
 * 
 * @example
 * // Uso básico
 * <MultiSelectEntry
 *   element={element}
 *   id="my-multiselect"
 *   label="Escolha múltiplas opções"
 *   getValue={() => getProperty(element, 'myProperty')}
 *   setValue={values => setProperty(element, 'myProperty', values)}
 *   getOptions={() => [
 *     { value: 'option1', label: 'Opção 1' },
 *     { value: 'option2', label: 'Opção 2' }
 *   ]}
 * />
 */
export default function MultiSelectEntry(props) {
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

  /**
   * Normaliza o valor recebido para sempre retornar um array de strings.
   * @param {string|Array<string>|null|undefined} rawValue - Valor bruto recebido
   * @returns {Array<string>} Array de strings normalizado
   */
  const normalizeValue = (rawValue) => {
    if (Array.isArray(rawValue)) {
      return rawValue;
    }
    if (typeof rawValue === 'string') {
      return rawValue.split(',').map(v => v.trim()).filter(Boolean);
    }
    if (rawValue == null) {
      return [];
    }
    return [String(rawValue)];
  };

  const value = normalizeValue(getValue(element));

  /**
   * Manipula a mudança de valores selecionados.
   * @param {Event} event - Evento de mudança do select
   */
  const handleChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    setValue(selected);
  };

  return (
    h('div', { class: classNames('bio-properties-panel-entry'), 'data-entry-id': id },
      h('label', { for: id, class: 'bio-properties-panel-label' },
        h(Tooltip, { value: tooltip, forId: id, element: element }, label)
      ),
      h('select', {
        id,
        name: id,
        class: 'bio-properties-panel-input',
        multiple: true,
        onInput: handleChange,
        onFocus,
        onBlur,
        value: value.length ? value : [''],
        disabled
      },
        options.map((option, idx) =>
          h('option', {
            key: idx,
            value: option.value,
            disabled: option.disabled,
            selected: value.includes(option.value)
          }, option.label)
        )
      ),
      h(Description, { forId: id, element, value: description })
    )
  );
}
