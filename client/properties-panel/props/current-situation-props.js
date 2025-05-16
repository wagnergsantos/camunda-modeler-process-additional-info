import { Group } from '@bpmn-io/properties-panel';
import { h } from 'preact';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';
import CombinedInputRadioEntry from '../custom/CombinedInputRadioEntry';

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
    // Tempo de execução do processo (input + radio)
    {
      id: 'time-execution-combined',
      component: props => (
        h(CombinedInputRadioEntry, {
          ...props,
          element: element,
          id: "time-execution-combined-entry",
          label: "Tempo de execução do processo",
          textFieldId: "time-execution-textfield",
          textFieldPropertyName: "processo:tempoExecucao",
          radioId: "time-execution-type-radio",
          radioPropertyName: "processo:tempoExecucaoTipo",
          radioOptions: [
            { value: 'estimado', label: 'Estimado' },
            { value: 'mensurado', label: 'Mensurado' }
          ],
          injector: injector
        })
      ),
    },
    // Quantidade de demandas recebidas (input + radio)
    {
      id: 'demands-combined',
      component: props => (
        h(CombinedInputRadioEntry, {
          ...props,
          element: element,
          id: "demands-combined-entry",
          label: "Quantidade de demandas recebidas",
          textFieldId: "demands-textfield",
          textFieldPropertyName: "processo:quantidadeDemandas",
          radioId: "demands-type-radio",
          radioPropertyName: "processo:quantidadeDemandasTipo",
          radioOptions: [
            { value: 'estimado', label: 'Estimado' },
            { value: 'mensurado', label: 'Mensurado' }
          ],
          injector: injector
        })
      ),
    },
    // Capacidade aproximada de execução (input + radio)
    {
      id: 'capacity-combined',
      component: props => (
        h(CombinedInputRadioEntry, {
          ...props,
          element: element,
          id: "capacity-combined-entry",
          label: "Capacidade aproximada de execução do processo",
          textFieldId: "capacity-textfield",
          textFieldPropertyName: "processo:capacidadeExecucao",
          radioId: "capacity-type-radio",
          radioPropertyName: "processo:capacidadeExecucaoTipo",
          radioOptions: [
            { value: 'estimado', label: 'Estimado' },
            { value: 'mensurado', label: 'Mensurado' }
          ],
          injector: injector
        })
      ),
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