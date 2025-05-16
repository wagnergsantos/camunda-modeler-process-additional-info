import { h } from 'preact';
import { Description, Tooltip } from '@bpmn-io/properties-panel';
import classNames from 'classnames';

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
