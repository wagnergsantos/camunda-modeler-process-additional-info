
/**
 * Checks if the given property object represents a process indicator property.
 *
 * @param {Object} prop - The property object to check.
 * @param {string} prop.name - The name of the property.
 * @returns {boolean} Returns true if the property name matches the process indicator pattern, otherwise false.
 */
export function isIndicatorProperty(prop) {
  const { name } = prop;
  return /^(processo:indicadores):/.test(name);
}

export function parseIndicatorPropertyValue(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

/**
 * Parse <camunda:property name="{processo:indicadores}:$id" value="$nome;$objetivo;$formula;$meta;$ultimaMedicao;$resultado" />.
 *
 * @param {ModdleElement} prop
 *
 * @return {Object}
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
 * Monta os campos para o property.
 * options: { name, type, nome, objetivo, formula, meta, ultimaMedicao, resultado }
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

export function createIndicatorProperty(factory, options) {
  return factory.create('camunda:Property', getIndicatorPropertyProps(options));
}

/**
 * Craft the UPDATE command to set a property value.
 */
export function updateIndicatorProperty(element, property, newProps, modeling) {
  const currentProps = parseIndicatorProperty(property);

  const props = getIndicatorPropertyProps({
    ...currentProps,
    ...newProps
  });

  return modeling.updateModdleProperties(element, property, props);
}
