// client/properties-panel/props/process-documentation-props.js
import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericSelectEntry
} from './generic-entries';

/**
 * Cria o grupo de propriedades "Documentação do Processo" para o painel de propriedades.
 * Este grupo só é exibido para elementos do tipo 'bpmn:Definitions'.
 * @param {ModdleElement} element - Elemento BPMN ao qual as propriedades pertencem.
 * @param {Object} injector - Injetor de dependências do Camunda Modeler.
 * @returns {Object|null} Grupo de propriedades configurado para o painel, ou null se não aplicável.
 */
export function ProcessDocumentationGroup(element, injector) {
  const translate = injector.get('translate');

  // Só exibe o grupo se o elemento for do tipo Definitions (processo raiz)
  if (!element || element.$type !== 'bpmn:Definitions') {
    return null;
  }

  // Lista de entradas (fields) exibidas no grupo "Documentação do Processo"
  const entries = [
    // Código do Processo
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
    // Nome do Processo
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
    // Entrada do processo (Insumo)
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
    // Fornecedores (área de texto)
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
    // Objetivo do Processo
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
    // Saída do processo (Resultado / Produto)
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
    // Clientes (área de texto)
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
    // Interface com outros processos (área de texto)
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
    // Principais regras de negócio do processo (área de texto)
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
    // Dono do processo (Área)
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
    // Dono do processo (Gestor(a))
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
    // Atores envolvidos (área de texto)
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
    // Sistemas utilizados (área de texto)
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
    // Legislação / Normativos aplicáveis (área de texto)
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

  // Retorna o grupo configurado para ser exibido no painel de propriedades
  return {
    id: 'process-documentation',
    label: translate('Documentação do Processo'),
    component: Group,
    entries
  };
}