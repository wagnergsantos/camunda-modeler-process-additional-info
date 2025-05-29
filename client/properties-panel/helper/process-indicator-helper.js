import {
  getExtensionElements,
  getCamundaProperties,
  createExtensionElements,
  createCamundaProperties
} from './extensions-helper';

/**
 * @typedef {Object} ModdleElement Representa um elemento no modelo BPMN subjacente.
 * @property {string} name - Nome do elemento
 * @property {string} value - Valor do elemento
 * @see {@link https://github.com/bpmn-io/bpmn-js/blob/develop/lib/model/Types.js}
 */

/**
 * @typedef {Object} IndicatorProperty
 * @property {string} id - Identificador único do indicador
 * @property {string} type - Tipo do indicador (geralmente 'processo:indicadores')
 * @property {string} nome - Nome do indicador
 * @property {string} objetivo - Objetivo do indicador
 * @property {string} formula - Fórmula de cálculo do indicador
 * @property {string} meta - Meta estabelecida para o indicador
 * @property {string} ultimaMedicao - Última medição registrada
 * @property {string} resultado - Resultado atual do indicador
 */

/**
 * @typedef {Object} IndicatorPropertyOptions
 * @property {string} name - Nome da propriedade
 * @property {string} type - Tipo da propriedade
 * @property {string} [nome=''] - Nome do indicador
 * @property {string} [objetivo=''] - Objetivo do indicador
 * @property {string} [formula=''] - Fórmula de cálculo
 * @property {string} [meta=''] - Meta estabelecida
 * @property {string} [ultimaMedicao=''] - Última medição
 * @property {string} [resultado=''] - Resultado atual
 */

/**
 * Verifica se uma determinada propriedade representa um indicador de processo.
 * A verificação é feita através do padrão do nome da propriedade.
 *
 * @param {Object} prop - Objeto da propriedade a ser verificada
 * @param {string} prop.name - Nome da propriedade
 * @returns {boolean} Retorna true se a propriedade for um indicador de processo
 * 
 * @example
 * if (isIndicatorProperty({ name: 'processo:indicadores:123' })) {
 *   // tratar como indicador
 * }
 */
export function isIndicatorProperty(prop) {
  const { name } = prop;
  return /^(processo:indicadores):/.test(name);
}

/**
 * Tenta fazer o parse de um valor de propriedade de indicador como JSON.
 * Se falhar, retorna um objeto vazio.
 *
 * @param {string} value - Valor da propriedade a ser parseado
 * @returns {Object} Objeto parseado ou objeto vazio em caso de erro
 */
export function parseIndicatorPropertyValue(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

/**
 * Analisa uma propriedade de indicador e extrai suas informações.
 * O formato esperado é:
 * <camunda:property name="{processo:indicadores}:$id" value="$nome;$objetivo;$formula;$meta;$ultimaMedicao;$resultado" />
 *
 * @param {ModdleElement} prop - Propriedade do indicador
 * @returns {IndicatorProperty} Objeto com as informações do indicador
 * 
 * @example
 * const indicator = parseIndicatorProperty(someProperty);
 * console.log(indicator.nome, indicator.objetivo);
 */
export function parseIndicatorProperty(prop) {
  const [
    _0,
    type,
    name
  ] = /^(processo:indicadores):(.*)/.exec(prop.name);

  // value: nome;objetivo;formula;meta;ultimaMedicao;resultado
  const [nome = '', objetivo = '', formula = '', meta = '', ultimaMedicao = '', resultado = ''] = (prop.value || '').split(';');

  return {
    id: name,
    type,
    nome,
    objetivo,
    formula,
    meta,
    ultimaMedicao,
    resultado
  };
}

/**
 * Monta os campos para a propriedade do indicador.
 * Combina todos os campos em uma string formatada adequadamente.
 *
 * @param {IndicatorPropertyOptions} options - Opções para construir a propriedade
 * @returns {Object} Objeto com name e value formatados para o indicador
 * 
 * @example
 * const props = getIndicatorPropertyProps({
 *   name: '123',
 *   type: 'processo:indicadores',
 *   nome: 'Indicador X',
 *   objetivo: 'Medir X'
 * });
 */
export function getIndicatorPropertyProps(options) {
  var {
    name,
    type,
    nome = '',
    objetivo = '',
    formula = '',
    meta = '',
    ultimaMedicao = '',
    resultado = ''
  } = options;

  var propertyName = `${type}:${name}`;
  var propertyValue = [nome, objetivo, formula, meta, ultimaMedicao, resultado].join(';');

  return {
    name: propertyName,
    value: propertyValue
  };
}

/**
 * Cria uma nova propriedade de indicador usando a fábrica BPMN.
 *
 * @param {Object} factory - Fábrica BPMN para criar elementos
 * @param {IndicatorPropertyOptions} options - Opções para o indicador
 * @returns {ModdleElement} Nova propriedade de indicador
 */
export function createIndicatorProperty(factory, options) {
  return factory.create('camunda:Property', getIndicatorPropertyProps(options));
}

/**
 * Atualiza uma propriedade de indicador existente.
 * Preserva os valores existentes e aplica apenas as alterações necessárias.
 *
 * @param {ModdleElement} element - Elemento BPMN que contém o indicador
 * @param {ModdleElement} property - Propriedade do indicador a ser atualizada
 * @param {Object} newProps - Novas propriedades a serem aplicadas
 * @param {Object} modeling - Serviço de modelagem BPMN
 * @returns {Object} Resultado da operação de atualização
 */
export function updateIndicatorProperty(element, property, newProps, modeling) {
  const currentProps = parseIndicatorProperty(property);

  const props = getIndicatorPropertyProps({
    ...currentProps,
    ...newProps
  });

  return modeling.updateModdleProperties(element, property, props);
}

/**
 * Garante que o elemento tenha as estruturas necessárias para propriedades Camunda.
 * Cria extensionElements e camunda:Properties se não existirem.
 *
 * @param {ModdleElement} element - Elemento BPMN
 * @param {Object} bpmnFactory - Fábrica para criar elementos BPMN
 * @param {Object} modeling - Serviço de modelagem BPMN
 * @returns {ModdleElement} Elemento camunda:Properties garantido
 * 
 * @example
 * const camundaProps = ensureCamundaProperties(element, bpmnFactory, modeling);
 * // Agora podemos adicionar propriedades com segurança
 */
export function ensureCamundaProperties(element, bpmnFactory, modeling) {
  let extensionElements = getExtensionElements(element);
  if (!extensionElements) {
    extensionElements = createExtensionElements(element, bpmnFactory);
    modeling.updateModdleProperties(element, element, { extensionElements });
  }
  let camundaProperties = getCamundaProperties(element);
  if (!camundaProperties) {
    camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, { values: [] });
    extensionElements.values.push(camundaProperties);
    modeling.updateModdleProperties(element, extensionElements, { values: extensionElements.get('values') });
  }
  return camundaProperties;
}
