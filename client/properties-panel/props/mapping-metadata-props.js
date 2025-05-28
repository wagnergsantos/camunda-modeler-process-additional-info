import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry
} from './generic-entries';

export function MappingMetadataGroup(element, injector) {
  const translate = injector.get('translate');

  // Só exibe o grupo se o elemento for do tipo Definitions
  if (!element || element.$type !== 'bpmn:Definitions') {
    return null;
  }

  const entries = [
    {
      id: 'mapping-version',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'mapping-version',
        propertyName: 'metaMapeamento:versaoDocumento',
        label: 'Versão do Mapeamento'
      })
    },
    {
      id: 'mapping-date',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'mapping-date',
        propertyName: 'metaMapeamento:dataDocumento',
        label: 'Data do Mapeamento'
      })
    },
    {
      id: 'process-mapping-type',
      component: props => GenericRadioEntry({
        ...props,
        element,
        id: 'process-mapping-type',
        propertyName: 'metaMapeamento:tipoMapeamento',
        label: 'Tipo de mapeamento',
        options: [
          { value: 'AS-IS', label: 'Situação Atual' },
          { value: 'TO-BE', label: 'Situação Futura' }
        ]
      })
    },
    {
      id: 'team-process-manager',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'team-process-manager',
        propertyName: 'metaMapeamento:equipeGestor',
        label: 'Equipe de Mapeamento - Gestor de Processo'
      })
    },
    {
      id: 'team-bpm-manager',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'team-bpm-manager',
        propertyName: 'metaMapeamento:equipeGerente',
        label: 'Equipe de Mapeamento - Gerente de Processos'
      })
    },
    {
      id: 'team-consultants',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'team-consultants',
        propertyName: 'metaMapeamento:equipeConsultores',
        label: 'Equipe de Mapeamento - Consultores'
      })
    }
  ];

  return {
    id: 'mapping-metadata',
    label: translate('Metadados do Mapeamento'),
    component: Group,
    entries
  };
}
