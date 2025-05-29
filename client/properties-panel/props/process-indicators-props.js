import { useService } from 'bpmn-js-properties-panel';
import { ListGroup } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getCamundaProperties } from '../helper/extensions-helper';
import { GenericTextFieldEntry } from './generic-entries';
import { setFixedProperty, getFixedProperty } from '../helper/fixed-properties-helper';
import Ids from 'ids';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} Element Representa um elemento do diagrama BPMN.
 */

/**
 * @typedef {Object} Injector O injetor de dependências do Camunda Modeler.
 */

/**
 * @typedef {Object} PropertyItemConfig
 * @property {string} id - ID único do item de propriedade
 * @property {string} label - Rótulo exibido para o item
 * @property {Function} remove - Função para remover o item
 * @property {Array<EntryConfig>} entries - Lista de entradas do item
 * @property {string} autoFocusEntry - ID da entrada que deve receber foco automático
 */

/**
 * @typedef {Object} EntryConfig
 * @property {string} id - ID único da entrada
 * @property {Function} component - Componente React/Preact para renderizar a entrada
 */

/**
 * @typedef {Object} IndicatorGroupConfig
 * @property {string} id - ID do grupo de indicadores
 * @property {string} label - Rótulo do grupo
 * @property {Function} component - Componente para renderizar o grupo
 * @property {Function} add - Função para adicionar novo indicador
 * @property {Array<PropertyItemConfig>} items - Lista de itens de indicadores
 */

const ids = new Ids([16, 36, 1]);

/**
 * Helper robusto para encontrar o elemento <definitions> na hierarquia do modelo BPMN.
 * Percorre a árvore de elementos até encontrar o elemento raiz bpmn:Definitions.
 * 
 * @param {Element} element - Elemento BPMN a partir do qual iniciar a busca
 * @returns {ModdleElement|null} Elemento bpmn:Definitions ou null se não encontrado
 */
function getDefinitions(element) {
    const bo = getBusinessObject(element);
    if (!bo) return null;
    let current = bo;
    while (current.$parent && current.$type !== 'bpmn:Definitions') {
        current = current.$parent;
    }
    return current;
}

/**
 * Helper para extrair os IDs dos indicadores existentes no elemento BPMN.
 * Analisa as propriedades Camunda do elemento para encontrar IDs de indicadores
 * usando um padrão regex específico.
 * 
 * @param {Element} element - Elemento BPMN para extrair os IDs dos indicadores
 * @returns {Array<string>} Lista de IDs únicos dos indicadores encontrados
 */
function getIndicatorIds(element) {
    const definitions = getDefinitions(element);
    if (!definitions) return [];

    const camundaProperties = getCamundaProperties(definitions);
    if (!camundaProperties || !camundaProperties.get('values')) return [];

    const regex = /^processo:indicadores:(.*?):/;
    const indicatorIds = new Set();
    for (const prop of camundaProperties.get('values')) {
        const match = prop.name.match(regex);
        if (match && match[1]) {
            indicatorIds.add(match[1]);
        }
    }
    return Array.from(indicatorIds);
}

/**
 * Cria o grupo de indicadores do processo para o painel de propriedades.
 * Este grupo permite gerenciar indicadores do processo, incluindo:
 * - Adicionar novos indicadores
 * - Remover indicadores existentes
 * - Editar propriedades dos indicadores (nome, objetivo, fórmula, etc.)
 * 
 * @param {Element} element - Elemento BPMN (tipicamente bpmn:Definitions)
 * @param {Injector} injector - Injetor de dependências do Camunda Modeler
 * @returns {IndicatorGroupConfig} Configuração do grupo de indicadores
 */
export function IndicatorsGroup(element, injector) {
    const translate = injector.get('translate');
    const modeling = injector.get('modeling');
    const bpmnFactory = injector.get('bpmnFactory');
    const eventBus = injector.get('eventBus');

    /**
     * Manipulador para adicionar um novo indicador.
     * Gera um novo ID único e cria um indicador com nome padrão.
     * 
     * @param {Event} event - Evento do DOM
     */
    function add(event) {
        event.stopPropagation();
        const newId = ids.next();
        setFixedProperty(element, `processo:indicadores:${newId}:nome`, '[Novo Indicador]', modeling, bpmnFactory);
        eventBus.fire('elements.changed', {
            elements: [element]
        });
    }

    const indicatorIds = getIndicatorIds(element);

    return {
        id: 'process-indicators-group',
        label: translate('Indicadores do Processo'),
        component: ListGroup,
        add,
        items: indicatorIds.map(id => PropertyItem({
            element,
            indicatorId: id,
            injector
        }))
    };
}

/**
 * Cria um item de propriedade para um indicador específico.
 * Cada item contém campos para editar as propriedades do indicador:
 * - Nome (obrigatório)
 * - Objetivo
 * - Fórmula
 * - Meta
 * - Última Medição
 * - Resultado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Element} props.element - Elemento BPMN
 * @param {string} props.indicatorId - ID do indicador
 * @param {Injector} props.injector - Injetor de dependências
 * @returns {PropertyItemConfig} Configuração do item de propriedade
 */
function PropertyItem(props) {
    const { element, indicatorId, injector } = props;
    const modeling = injector.get('modeling');
    const eventBus = injector.get('eventBus');
    
    const nameProp = `processo:indicadores:${indicatorId}:nome`;
    const actualIndicatorName = getFixedProperty(element, nameProp);
    const label = `${actualIndicatorName || ''} (Indicador #${indicatorId})`;

    /**
     * Remove o indicador e todas as suas propriedades associadas.
     * 
     * @param {Event} event - Evento do DOM
     */
    function remove(event) {
        event.stopPropagation();
        const definitions = getDefinitions(element);
        const camundaProperties = getCamundaProperties(definitions);

        if (camundaProperties && camundaProperties.get('values')) {
            const prefix = `processo:indicadores:${indicatorId}:`;
            const values = camundaProperties.get('values').filter(p => !p.name.startsWith(prefix));
            modeling.updateModdleProperties(element, camundaProperties, { values });
            eventBus.fire('elements.changed', {
                elements: [element]
            });
        }
    }

    /**
     * Valida o nome do indicador.
     * 
     * @param {string} value - Valor do campo nome
     * @returns {string|null} Mensagem de erro ou null se válido
     */
    const validateName = (value) => {
        if (!value || !value.trim()) {
            return 'O nome do indicador é obrigatório.';
        }
        return null;
    };

    /**
     * Cria uma entrada de propriedade com configurações específicas.
     * 
     * @param {string} field - Nome do campo
     * @param {string} labelText - Texto do rótulo
     * @param {Function} [validateFn] - Função de validação opcional
     * @returns {EntryConfig} Configuração da entrada
     */
    const createEntry = (field, labelText, validateFn) => {
        const id = `indicator-${indicatorId}-${field}`;
        const propertyName = `processo:indicadores:${indicatorId}:${field}`;
        
        return {
            id,
            component: (props) => GenericTextFieldEntry({ 
                ...props, 
                element, 
                id, 
                propertyName, 
                label: labelText,
                validate: validateFn
            }),
        };
    };

    return {
        id: `indicator-${indicatorId}`,
        label,
        remove,
        entries: [
            createEntry('nome', 'Nome', validateName),
            createEntry('objetivo', 'Objetivo'),
            createEntry('formula', 'Fórmula'),
            createEntry('meta', 'Meta'),
            createEntry('ultimaMedicao', 'Última Medição'),
            createEntry('resultado', 'Resultado'),
        ],
        autoFocusEntry: `indicator-${indicatorId}-nome`
    };
}
