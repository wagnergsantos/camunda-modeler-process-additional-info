import { SelectEntry, TextAreaEntry, Group, TextFieldEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { getFixedProperty, setFixedProperty } from '../helper/fixed-properties-helper';
import MultiSelectEntry from '../custom/MultiSelectEntry';
import RadioEntry from '../custom/RadioEntry';

// Componente para "Periodicidade"
function PeriodicityEntry(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnFactory = useService('bpmnFactory');

  const propertyName = 'processo:periodicidade';

  const getValue = () => {
    return getFixedProperty(element, propertyName);
  };

  const setValue = (value) => {
    setFixedProperty(element, propertyName, value, modeling, bpmnFactory);
  };

  const getOptions = () => {
    return [
      { value: 'diaria', label: translate('Diária') },
      { value: 'semanal', label: translate('Semanal') },
      { value: 'quinzenal', label: translate('Quinzenal') },
      { value: 'mensal', label: translate('Mensal') },
      { value: 'bimestral', label: translate('Bimestral') },
      { value: 'trimestral', label: translate('Trimestral') },
      { value: 'quadrimestral', label: translate('Quadrimestral') },
      { value: 'semestral', label: translate('Semestral') },
      { value: 'anual', label: translate('Anual') },
      { value: 'sob_demanda', label: translate('Por demanda') },
      { value: 'outro', label: translate('Outro') }
    ];
  };

  return SelectEntry({
    element,
    id: id + '-periodicity',
    label: translate('Periodicidade'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}

// Função para criar as entradas de tempo de execução
function createTimeExecutionEntries(element) {
  return [
    {
      id: 'time-execution',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');

        return TextFieldEntry({
          ...props,
          element,
          label: translate('Tempo de execução do processo'),
          getValue: () => getFixedProperty(element, 'processo:tempoExecucao'),
          setValue: value => setFixedProperty(element, 'processo:tempoExecucao', value, modeling, bpmnFactory),
          debounce
        });
      }
    },
    {
      id: 'time-execution-type',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const bpmnFactory = useService('bpmnFactory');

        return RadioEntry ({
          ...props,
          element,
          getValue: () => getFixedProperty(element, 'processo:tempoExecucaoTipo'),
          setValue: value => setFixedProperty(element, 'processo:tempoExecucaoTipo', value, modeling, bpmnFactory),
          getOptions: () => [
            { value: 'estimado', label: translate('Estimado') },
            { value: 'mensurado', label: translate('Mensurado') }
          ]
        });
      }
    }
  ];
}

function createQtdDemandsEntries(element) {
  return [
    {
      id: 'demands',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');

        return TextFieldEntry({
          ...props,
          element,
          label: translate('Quantidade de demandas recebidas'),
          getValue: () => getFixedProperty(element, 'processo:quantidadeDemandas'),
          setValue: value => setFixedProperty(element, 'processo:quantidadeDemandas', value, modeling, bpmnFactory),
          debounce
        });
      }
    },
    {
      id: 'demands-type',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const bpmnFactory = useService('bpmnFactory');

        return RadioEntry({
          ...props,
          element,
          getValue: () => getFixedProperty(element, 'processo:quantidadeDemandasTipo'),
          setValue: value => setFixedProperty(element, 'processo:quantidadeDemandasTipo', value, modeling, bpmnFactory),
          getOptions: () => [
            { value: 'estimado', label: translate('Estimado') },
            { value: 'mensurado', label: translate('Mensurado') }
          ]
        });
      }
    }
  ];
}

function createCapacityEntries(element) {
  return [
    {
      id: 'capacity',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');

        return TextFieldEntry({
          ...props,
          element,
          label: translate('Capacidade aproximada de execução do processo'),
          getValue: () => getFixedProperty(element, 'processo:capacidadeExecucao'),
          setValue: value => setFixedProperty(element, 'processo:capacidadeExecucao', value, modeling, bpmnFactory),
          debounce
        });
      }
    },
    {
      id: 'capacity-type',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const bpmnFactory = useService('bpmnFactory');

        return RadioEntry({
          ...props,
          element,
          getValue: () => getFixedProperty(element, 'processo:capacidadeExecucaoTipo'),
          setValue: value => setFixedProperty(element, 'processo:capacidadeExecucaoTipo', value, modeling, bpmnFactory),
          getOptions: () => [
            { value: 'estimado', label: translate('Estimado') },
            { value: 'mensurado', label: translate('Mensurado') }
          ]
        });
      }
    }
  ];
}

function createExecutorsEntries(element) {
  return [
    {
      id: 'executors-quantity',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');

        return TextFieldEntry({
          ...props,
          element,
          label: translate('Quantidade de executores do processo'),
          getValue: () => getFixedProperty(element, 'processo:quantidadeExecutores'),
          setValue: value => {
            // Garante que só aceita números inteiros ou vazio
            const intValue = value.replace(/\D/g, '');
            setFixedProperty(element, 'processo:quantidadeExecutores', intValue, modeling, bpmnFactory);
          },
          debounce
        });
      }
    },
    {
      id: 'executors-profile',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');

        return TextAreaEntry({
          ...props,
          element,
          label: translate('Perfil'),
          getValue: () => getFixedProperty(element, 'processo:perfilExecutores'), 
          setValue: value => setFixedProperty(element, 'processo:perfilExecutores', value, modeling, bpmnFactory),
          debounce
        });
      }
    }
  ];
}

function createActivitiesEntries(element) {
  return [
    {
      id: 'activities-manual',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');
        return TextFieldEntry({
          ...props,
          element,
          label: translate('Atividade manual (Qtd)'),
          getValue: () => getFixedProperty(element, 'processo:atividadeManualQtd'),
          setValue: value => setFixedProperty(element, 'processo:atividadeManualQtd', value, modeling, bpmnFactory),
          debounce
        });
      }
    },
    {
      id: 'activities-user',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');
        return TextFieldEntry({
          ...props,
          element,
          label: translate('Atividade de usuário (Qtd)'),
          getValue: () => getFixedProperty(element, 'processo:atividadeUsuarioQtd'),
          setValue: value => setFixedProperty(element, 'processo:atividadeUsuarioQtd', value, modeling, bpmnFactory),
          debounce
        });
      }
    },
    {
      id: 'activities-automated',
      component: function(props) {
        const modeling = useService('modeling');
        const translate = useService('translate');
        const debounce = useService('debounceInput');
        const bpmnFactory = useService('bpmnFactory');
        return TextFieldEntry({
          ...props,
          element,
          label: translate('Atividade automatizada (Qtd)'),
          getValue: () => getFixedProperty(element, 'processo:atividadeAutomatizadaQtd'),
          setValue: value => setFixedProperty(element, 'processo:atividadeAutomatizadaQtd', value, modeling, bpmnFactory),
          debounce
        });
      }
    }
  ];
}

function createPerformanceIndicatorEntry(element) {
  return {
    id: 'performance-indicator',
    component: function(props) {
      const modeling = useService('modeling');
      const translate = useService('translate');
      const bpmnFactory = useService('bpmnFactory');
      return RadioEntry({
        ...props,
        element,
        label: translate('O processo possui indicador de desempenho?'),
        getValue: () => getFixedProperty(element, 'processo:possuiIndicador'),
        setValue: value => setFixedProperty(element, 'processo:possuiIndicador', value, modeling, bpmnFactory),
        getOptions: () => [
          { value: 'sim', label: translate('Sim') },
          { value: 'nao', label: translate('Não') }
        ]
      });
    }
  };
}

export function CurrentSituationGroup(element, injector) {
  const translate = injector.get('translate');

  const entries = [
    {
      id: 'process-periodicity',
      component: PeriodicityEntry,
      element
    },
    ...createTimeExecutionEntries(element),
    ...createQtdDemandsEntries(element),
    ...createCapacityEntries(element),
    ...createExecutorsEntries(element),
    ...createActivitiesEntries(element),
    createPerformanceIndicatorEntry(element)
  ];

  return {
    id: 'current-situation',
    label: translate('Dados da situação atual'),
    component: Group,
    entries
  };
}