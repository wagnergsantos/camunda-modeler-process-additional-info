// client/properties-panel/props/process-documentation-props.js
import { TextFieldEntry, TextAreaEntry, Group } from '@bpmn-io/properties-panel'; // Group para agrupar as entradas
import { useService } from 'bpmn-js-properties-panel';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';

// Generic Text Field Entry Component
function GenericTextFieldEntry(props) {
  const { element, id, propertyName, label } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  return TextFieldEntry({
    element,
    id,
    label: translate(label),
    getValue: () => getFixedProperty(element, propertyName),
    setValue: value => setFixedProperty(element, propertyName, value, modeling, bpmnFactory),
    debounce
  });
}

// Generic Text Area Entry Component
function GenericTextAreaEntry(props) {
  const { element, id, propertyName, label } = props;
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

// Componente para "Código do Processo"
function ProcessCodeEntry(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  const propertyName = 'processo:codigo'; // Nome da propriedade no XML

  const getValue = () => {
    return getFixedProperty(element, propertyName);
  };

  const setValue = (value) => {
    setFixedProperty(element, propertyName, value, modeling, bpmnFactory);
  };

  return TextFieldEntry({
    element: element, // O elemento do diagrama, não a propriedade moddle diretamente
    id: id + '-processCode',
    label: translate('Código do Processo'),
    getValue,
    setValue,
    debounce
  });
}

// Componente para "Nome do Processo"
function ProcessNameEntry(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  const propertyName = 'processo:nome';

  const getValue = () => {
    return getFixedProperty(element, propertyName);
  };

  const setValue = (value) => {
    setFixedProperty(element, propertyName, value, modeling, bpmnFactory);
  };

  return TextFieldEntry({
    element: element,
    id: id + '-processName',
    label: translate('Nome do Processo'),
    getValue,
    setValue,
    debounce
  });
}

// Componente para "Objetivo do Processo"
function ProcessObjectiveEntry(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  const propertyName = 'processo:objetivo';

  const getValue = () => {
    return getFixedProperty(element, propertyName);
  };

  const setValue = (value) => {
    setFixedProperty(element, propertyName, value, modeling, bpmnFactory);
  };

  return TextFieldEntry({
    element: element,
    id: id + '-processObjective',
    label: translate('Objetivo do Processo'),
    getValue,
    setValue,
    debounce,
    // Se quiser um campo de texto maior:
    // component: TextAreaEntry // Importar TextAreaEntry de @bpmn-io/properties-panel
  });
}

// Função que cria o grupo
export function ProcessDocumentationGroup(element, injector) {
  const translate = injector.get('translate');
  
  console.log('Creating group with element:', element); // DEBUG

  // Garantir que temos o elemento definitions
  if (!element || element.$type !== 'bpmn:Definitions') {
    console.warn('Invalid element type for documentation group:', element && element.$type);
    return null;
  }

  const entries = [
    {
      id: 'process-code',
      component: ProcessCodeEntry,
      element: element // Passando o elemento definitions
    },
    {
      id: 'process-name',
      component: ProcessNameEntry,
      element: element // Passando o elemento definitions
    },
    {
      id: 'definitions-prop-entrada',
      component: GenericTextFieldEntry,
      element,
      propertyName: 'processo:entradaInsumo',
      label: 'Entrada do processo (Insumo)'
    },
    {
      id: 'definitions-prop-fornecedores',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:fornecedores',
      label: 'Fornecedores'
    },
    {
      id: 'process-objective',
      component: ProcessObjectiveEntry,
      element: element // Passando o elemento definitions
    },
    {
      id: 'definitions-prop-saida',
      component: GenericTextFieldEntry,
      element,
      propertyName: 'processo:saidaResultado',
      label: 'Saída do processo (Resultado / Produto)'
    },
    {
      id: 'definitions-prop-clientes',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:clientes',
      label: 'Clientes'
    },
    {
      id: 'definitions-prop-interface',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:interfaceProcessos',
      label: 'Interface com outros processos'
    },
    {
      id: 'definitions-prop-regras',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:regrasNegocio',
      label: 'Principais regras de negócio do processo'
    },
    {
      id: 'definitions-prop-donoArea',
      component: GenericTextFieldEntry,
      element,
      propertyName: 'processo:donoProcessoArea',
      label: 'Dono do processo (Área)'
    },
    {
      id: 'definitions-prop-donoGestor',
      component: GenericTextFieldEntry,
      element,
      propertyName: 'processo:donoProcessoGestor',
      label: 'Dono do processo (Gestor(a))'
    },
    {
      id: 'definitions-prop-atores',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:atoresEnvolvidos',
      label: 'Atores envolvidos'
    },
    {
      id: 'definitions-prop-sistemas',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:sistemasUtilizados',
      label: 'Sistemas utilizados'
    },
    {
      id: 'definitions-prop-legislacao',
      component: GenericTextAreaEntry,
      element,
      propertyName: 'processo:legislacaoNormativos',
      label: 'Legislação / Normativos aplicáveis'
    }
  ];

  // Só retorna o grupo se houver entradas (boa prática)
  if (!entries.length) {
    return null;
  }

  return {
    id: 'process-documentation', // ID único para o grupo
    label: translate('Documentação do Processo'),
    component: Group, // Usando o componente Group para encapsular as entradas
    entries: entries
  };
}