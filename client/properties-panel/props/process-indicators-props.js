import { useService } from 'bpmn-js-properties-panel';
import { ListGroup } from '@bpmn-io/properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { getCamundaProperties } from '../helper/extensions-helper';
import { GenericTextFieldEntry } from './generic-entries';
import { setFixedProperty, getFixedProperty } from '../helper/fixed-properties-helper';
import Ids from 'ids';

const ids = new Ids([16, 36, 1]);

// Helper robusto para encontrar o elemento <definitions>
function getDefinitions(element) {
    const bo = getBusinessObject(element);
    if (!bo) return null;
    let current = bo;
    while (current.$parent && current.$type !== 'bpmn:Definitions') {
        current = current.$parent;
    }
    return current;
}

// Helper para extrair os IDs dos indicadores existentes
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

export function createInputSpecificationGroup(element, injector) {
    const translate = injector.get('translate');
    const modeling = injector.get('modeling');
    const bpmnFactory = injector.get('bpmnFactory');
    const eventBus = injector.get('eventBus');

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

function PropertyItem(props) {
    const { element, indicatorId, injector } = props;
    const modeling = injector.get('modeling');
    const eventBus = injector.get('eventBus');
    
    const nameProp = `processo:indicadores:${indicatorId}:nome`;
    const label = getFixedProperty(element, nameProp) || `Indicador ${indicatorId}`;

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

    const createEntry = (field, labelText) => {
        const id = `indicator-${indicatorId}-${field}`;
        const propertyName = `processo:indicadores:${indicatorId}:${field}`;
        
        return {
            id,
            component: (props) => GenericTextFieldEntry({ ...props, element, id, propertyName, label: labelText }),
        };
    };

    return {
        id: `indicator-${indicatorId}`,
        label,
        remove,
        entries: [
            createEntry('nome', 'Nome'),
            createEntry('objetivo', 'Objetivo'),
            createEntry('formula', 'Fórmula'),
            createEntry('meta', 'Meta'),
            createEntry('ultimaMedicao', 'Última Medição'),
            createEntry('resultado', 'Resultado'),
        ],
        autoFocusEntry: `indicator-${indicatorId}-nome`
    };
}