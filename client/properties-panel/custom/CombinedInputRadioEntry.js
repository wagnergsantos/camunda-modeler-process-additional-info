import { h } from 'preact';
import {
  TextFieldEntry,
  Description
} from '@bpmn-io/properties-panel';
import RadioEntry from '../custom/RadioEntry';
import { useService } from 'bpmn-js-properties-panel';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';
import classNames from 'classnames';

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

  const textFieldGetValue = () => getFixedProperty(element, textFieldPropertyName);
  const textFieldSetValue = (value) => {
    setFixedProperty(element, textFieldPropertyName, value, modeling, bpmnFactory);
  };

  const radioGetValue = () => getFixedProperty(element, radioPropertyName);
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