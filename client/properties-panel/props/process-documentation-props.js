// client/properties-panel/props/process-documentation-props.js
import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';


export function ProcessDocumentationGroup(element, injector) {
  const translate = injector.get('translate');

  if (!element || element.$type !== 'bpmn:Definitions') {
    return null;
  }

  const entries = [
    {
      id: 'process-code',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-code',
        propertyName: 'processo:codigo',
        label: 'Código do Processo'
      })
    },
    {
      id: 'process-name',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-name',
        propertyName: 'processo:nome',
        label: 'Nome do Processo'
      })
    },
    {
      id: 'definitions-prop-entrada',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-entrada',
        propertyName: 'processo:entradaInsumo',
        label: 'Entrada do processo (Insumo)'
      })
    },
    {
      id: 'definitions-prop-fornecedores',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-fornecedores',
        propertyName: 'processo:fornecedores',
        label: 'Fornecedores'
      })
    },
    {
      id: 'process-objective',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'process-objective',
        propertyName: 'processo:objetivo',
        label: 'Objetivo do Processo'
      })
    },
    {
      id: 'definitions-prop-saida',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-saida',
        propertyName: 'processo:saidaResultado',
        label: 'Saída do processo (Resultado / Produto)'
      })
    },
    {
      id: 'definitions-prop-clientes',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-clientes',
        propertyName: 'processo:clientes',
        label: 'Clientes'
      })
    },
    {
      id: 'definitions-prop-interface',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-interface',
        propertyName: 'processo:interfaceProcessos',
        label: 'Interface com outros processos'
      })
    },
    {
      id: 'definitions-prop-regras',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-regras',
        propertyName: 'processo:regrasNegocio',
        label: 'Principais regras de negócio do processo'
      })
    },
    {
      id: 'definitions-prop-donoArea',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-donoArea',
        propertyName: 'processo:donoProcessoArea',
        label: 'Dono do processo (Área)'
      })
    },
    {
      id: 'definitions-prop-donoGestor',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'definitions-prop-donoGestor',
        propertyName: 'processo:donoProcessoGestor',
        label: 'Dono do processo (Gestor(a))'
      })
    },
    {
      id: 'definitions-prop-atores',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-atores',
        propertyName: 'processo:atoresEnvolvidos',
        label: 'Atores envolvidos'
      })
    },
    {
      id: 'definitions-prop-sistemas',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-sistemas',
        propertyName: 'processo:sistemasUtilizados',
        label: 'Sistemas utilizados'
      })
    },
    {
      id: 'definitions-prop-legislacao',
      component: props => GenericTextAreaEntry({
        ...props,
        element,
        id: 'definitions-prop-legislacao',
        propertyName: 'processo:legislacaoNormativos',
        label: 'Legislação / Normativos aplicáveis'
      })
    }
  ];

  return {
    id: 'process-documentation',
    label: translate('Documentação do Processo'),
    component: Group,
    entries
  };
}