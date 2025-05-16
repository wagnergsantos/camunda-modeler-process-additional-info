import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';

// Entradas do grupo

/**
 * Cria o grupo de propriedades "Dados da situação atual" para o painel de propriedades.
 * @param {ModdleElement} element - Elemento BPMN ao qual as propriedades pertencem.
 * @param {Object} injector - Injetor de dependências do Camunda Modeler.
 * @returns {Object} Grupo de propriedades configurado para o painel.
 */
export function CurrentSituationGroup(element, injector) {
  const translate = injector.get('translate');

  // Lista de entradas (fields) exibidas no grupo "Dados da situação atual"
  const entries = [
    // Periodicidade do processo (dropdown)
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
    // Tempo de execução do processo (campo texto)
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
    // Tipo do tempo de execução (radio)
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
    // Quantidade de demandas recebidas (campo texto)
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
    // Tipo da quantidade de demandas (radio)
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
    // Capacidade aproximada de execução (campo texto)
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
    // Tipo da capacidade de execução (radio)
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
    // Quantidade de executores (campo texto, apenas inteiros)
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
    // Perfil dos executores (área de texto)
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
    // Quantidade de atividades manuais (campo texto)
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
    // Quantidade de atividades de usuário (campo texto)
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
    // Quantidade de atividades automatizadas (campo texto)
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
    // Indicador de desempenho (radio)
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

  // Retorna o grupo configurado para ser exibido no painel de propriedades
  return {
    id: 'current-situation',
    label: translate('Dados da situação atual'),
    component: Group,
    entries
  };
}