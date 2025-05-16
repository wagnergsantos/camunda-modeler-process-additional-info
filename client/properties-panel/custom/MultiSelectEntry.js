// Use Preact explicitamente para evitar erro "React is not defined"
import { h } from 'preact';
import { Description, Tooltip } from '@bpmn-io/properties-panel';
import classNames from 'classnames';

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

  // Corrige: sempre retorna array de strings, mesmo se vier undefined ou string vazia
  let rawValue = getValue(element);
  let value;
  if (Array.isArray(rawValue)) {
    value = rawValue;
  } else if (typeof rawValue === 'string') {
    value = rawValue.split(',').map(v => v.trim()).filter(Boolean);
  } else if (rawValue == null) {
    value = [];
  } else {
    value = [String(rawValue)];
  }

  const handleChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    setValue(selected);
  };

  // Corrige: sempre passa value como array (mesmo se vazio)
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
      h(Description, { forId: id, element: element, value: description })
    )
  );
}
