import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';

// Entradas do grupo
export function CurrentSituationGroup(element, injector) {
  const translate = injector.get('translate');

  const entries = [
    {
      id: 'process-periodicity',
      component: props => GenericSelectEntry({
        ...props,
        element,
        id: 'process-periodicity',
        propertyName: 'processo:periodicidade',
        label: 'Periodicidade',
        options: [
          { value: 'diaria', label: 'Diária' },
          { value: 'semanal', label: 'Semanal' },
          { value: 'quinzenal', label: 'Quinzenal' },
          { value: 'mensal', label: 'Mensal' },
          { value: 'bimestral', label: 'Bimestral' },
          { value: 'trimestral', label: 'Trimestral' },
          { value: 'quadrimestral', label: 'Quadrimestral' },
          { value: 'semestral', label: 'Semestral' },
          { value: 'anual', label: 'Anual' },
          { value: 'sob_demanda', label: 'Por demanda' },
          { value: 'outro', label: 'Outro' }
        ]
      })
    },
    {
      id: 'time-execution',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'time-execution',
        propertyName: 'processo:tempoExecucao',
        label: 'Tempo de execução do processo'
      })
    },
    {
      id: 'time-execution-type',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'time-execution-type',
        propertyName: 'processo:tempoExecucaoTipo',
        options: [
          { value: 'estimado', label: 'Estimado' },
          { value: 'mensurado', label: 'Mensurado' }
        ]
      })
    },
    {
      id: 'demands',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'demands',
        propertyName: 'processo:quantidadeDemandas',
        label: 'Quantidade de demandas recebidas'
      })
    },
    {
      id: 'demands-type',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'demands-type',
        propertyName: 'processo:quantidadeDemandasTipo',
        options: [
          { value: 'estimado', label: 'Estimado' },
          { value: 'mensurado', label: 'Mensurado' }
        ]
      })
    },
    {
      id: 'capacity',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'capacity',
        propertyName: 'processo:capacidadeExecucao',
        label: 'Capacidade aproximada de execução do processo'
      })
    },
    {
      id: 'capacity-type',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'capacity-type',
        propertyName: 'processo:capacidadeExecucaoTipo',
        options: [
          { value: 'estimado', label: 'Estimado' },
          { value: 'mensurado', label: 'Mensurado' }
        ]
      })
    },
    {
      id: 'executors-quantity',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'executors-quantity',
        propertyName: 'processo:quantidadeExecutores',
        label: 'Quantidade de executores do processo',
        onlyInt: true
      })
    },
    {
      id: 'executors-profile',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'executors-profile',
        propertyName: 'processo:perfilExecutores',
        label: 'Perfil'
      })
    },
    {
      id: 'activities-manual',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'activities-manual',
        propertyName: 'processo:atividadeManualQtd',
        label: 'Atividade manual (Qtd)'
      })
    },
    {
      id: 'activities-user',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'activities-user',
        propertyName: 'processo:atividadeUsuarioQtd',
        label: 'Atividade de usuário (Qtd)'
      })
    },
    {
      id: 'activities-automated',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'activities-automated',
        propertyName: 'processo:atividadeAutomatizadaQtd',
        label: 'Atividade automatizada (Qtd)'
      })
    },
    {
      id: 'performance-indicator',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'performance-indicator',
        propertyName: 'processo:possuiIndicador',
        label: 'O processo possui indicador de desempenho?',
        options: [
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' }
        ]
      })
    }
  ];

  return {
    id: 'current-situation',
    label: translate('Dados da situação atual'),
    component: Group,
    entries
  };
}