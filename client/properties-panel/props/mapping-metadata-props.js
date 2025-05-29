import { Group } from '@bpmn-io/properties-panel';
import {
  GenericTextFieldEntry,
  GenericTextAreaEntry,
  GenericRadioEntry,
  GenericDateFieldEntry
} from './generic-entries';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} Injector O injetor de dependências do Camunda Modeler.
 */

/**
 * @typedef {Object} PropertyGroup
 * @property {string} id - O ID único do grupo.
 * @property {string} label - O rótulo do grupo exibido na interface.
 * @property {Function} component - O componente React/Preact para renderizar o grupo.
 * @property {Array<EntryConfig>} entries - Lista de entradas de propriedade para o grupo.
 */

/**
 * @typedef {Object} EntryConfig
 * @property {string} id - ID único da entrada
 * @property {Function} component - Função que retorna o componente React/Preact para renderizar a entrada
 */

/**
 * @typedef {Object} EntryOption
 * @property {string} value - O valor interno da opção
 * @property {string} label - O rótulo exibido para o usuário
 */

/**
 * Valida o formato do Número do OS.
 * O formato esperado é OS<numero>/<ano> (ex: OS123/2023).
 * 
 * @param {string} value - O valor a ser validado
 * @returns {string|null} Mensagem de erro se inválido, null se válido ou vazio
 */
function validateOsNumber(value) {
  if (!value) return null; // Permite campo vazio, se for opcional

  const osPattern = /^OS\d+\/\d{4}$/;
  if (!osPattern.test(value)) {
    return 'Formato inválido. Use OS<numero>/<ano> (ex: OS123/2023).';
  }
  return null; // Formato válido
}

/**
 * Cria o grupo de propriedades "Metadados do Mapeamento" para o painel de propriedades.
 * Este grupo contém campos para documentar informações sobre o mapeamento do processo, incluindo:
 * - Número do OS
 * - Versão do documento
 * - Data do mapeamento
 * - Tipo de mapeamento (AS-IS/TO-BE)
 * - Equipe responsável pelo mapeamento
 * 
 * Este grupo só é exibido para elementos do tipo 'bpmn:Definitions'.
 * 
 * @param {ModdleElement} element - Elemento BPMN ao qual as propriedades pertencem.
 * @param {Injector} injector - Injetor de dependências do Camunda Modeler.
 * @returns {PropertyGroup|null} Grupo de propriedades configurado para o painel, ou null se não aplicável.
 */
export function MappingMetadataGroup(element, injector) {
  const translate = injector.get('translate');

  // Só exibe o grupo se o elemento for do tipo Definitions
  if (!element || element.$type !== 'bpmn:Definitions') {
    return null;
  }

  /**
   * Lista de entradas (fields) exibidas no grupo "Metadados do Mapeamento".
   * Cada entrada representa um campo ou conjunto de campos relacionados.
   * @type {Array<EntryConfig>}
   */
  const entries = [
    /**
     * Campo para o número da OS.
     * Inclui validação de formato e tooltip explicativo.
     */
    {
      id: 'mapping-osNumber',
      component: props => GenericTextFieldEntry({
        ...props,
        element,
        id: 'mapping-osNumber',
        propertyName: 'metaMapeamento:osNumber',
        label: 'Número do OS',
        tooltip: 'Use o formato OS<numero>/<ano> (ex: OS123/2023)',
        validate: validateOsNumber
      })
    },
    /**
     * Campo para a versão do documento de mapeamento.
     */
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
    /**
     * Campo de data do mapeamento.
     * Utiliza formato brasileiro de data (DD/MM/YYYY).
     */
    {
      id: 'mapping-date',
      component: props => GenericDateFieldEntry({
        ...props,
        element,
        id: 'mapping-date',
        propertyName: 'metaMapeamento:dataDocumento',
        label: 'Data do Mapeamento',
        dateFormat: 'DD/MM/YYYY',
        tooltip: 'Use o formato DD/MM/YYYY',
        disableDebounce: true
      })
    },
    /**
     * Campo de seleção do tipo de mapeamento.
     * Permite escolher entre mapeamento da situação atual (AS-IS) 
     * ou situação futura (TO-BE).
     */
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
    /**
     * Campo para o gestor do processo na equipe de mapeamento.
     */
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
    /**
     * Campo para o gerente de processos na equipe de mapeamento.
     */
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
    /**
     * Campo de texto multilinha para listar os consultores 
     * envolvidos no mapeamento do processo.
     */
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
