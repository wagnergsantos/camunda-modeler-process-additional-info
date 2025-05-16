/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/properties-panel/ProcessDocumentationPropertiesProvider.js":
/*!***************************************************************************!*\
  !*** ./client/properties-panel/ProcessDocumentationPropertiesProvider.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProcessDocumentationPropertiesProvider)
/* harmony export */ });
/* harmony import */ var bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bpmn-js/lib/util/ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");
/* harmony import */ var _props_process_documentation_props__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./props/process-documentation-props */ "./client/properties-panel/props/process-documentation-props.js");
/* harmony import */ var _props_current_situation_props__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./props/current-situation-props */ "./client/properties-panel/props/current-situation-props.js");
// client/properties-panel/ProcessDocumentationPropertiesProvider.js



class ProcessDocumentationPropertiesProvider {
  constructor(propertiesPanel, injector) {
    this._injector = injector;
    propertiesPanel.registerProvider(this);
  }
  getTabs(element) {
    // Sempre exibe a aba, independente do tipo de elemento
    const groups = [];
    const processDocumentationGroup = (0,_props_process_documentation_props__WEBPACK_IMPORTED_MODULE_0__.ProcessDocumentationGroup)(element, this._injector);
    if (processDocumentationGroup) {
      groups.push(processDocumentationGroup);
    }
    return [{
      id: 'generalInfo',
      label: 'Informações gerais',
      groups
    }];
  }
  getGroups(element) {
    return groups => {
      groups = groups.slice();
      const definitionsElement = findDefinitionsElement(this._injector);
      console.log('definitions found:', definitionsElement); // DEBUG

      if (!definitionsElement) {
        console.warn('No definitions element found!');
        return groups;
      }

      // Grupo de Informações gerais
      const infoGroup = {
        id: 'generalInfo',
        label: 'Informações gerais',
        entries: []
      };
      const processDocumentationGroup = (0,_props_process_documentation_props__WEBPACK_IMPORTED_MODULE_0__.ProcessDocumentationGroup)(definitionsElement, this._injector);
      console.log('documentation group:', processDocumentationGroup); // DEBUG

      if (processDocumentationGroup && processDocumentationGroup.entries) {
        infoGroup.entries.push(...processDocumentationGroup.entries);
      }

      // Adiciona o novo grupo de situação atual
      const currentSituationGroup = (0,_props_current_situation_props__WEBPACK_IMPORTED_MODULE_1__.CurrentSituationGroup)(definitionsElement, this._injector);
      groups.push(infoGroup);
      if (currentSituationGroup) {
        groups.push(currentSituationGroup);
      }
      return groups;
    };
  }
}
ProcessDocumentationPropertiesProvider.$inject = ['propertiesPanel', 'injector'];

// Função utilitária para encontrar o elemento bpmn:Process do diagrama
function findProcessElement(element, injector) {
  const modeling = injector.get('elementRegistry', false);
  if (!modeling) return null;

  // Procura o primeiro elemento do tipo bpmn:Process
  const allElements = modeling.getAll ? modeling.getAll() : modeling._elements ? Object.values(modeling._elements).map(e => e.element) : [];
  const processElement = allElements.find(el => (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_2__.is)(el, 'bpmn:Process'));
  return processElement || null;
}
function getProcessRef(element) {
  const bo = (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_2__.getBusinessObject)(element);
  return bo.processRef;
}

// Nova implementação para encontrar o elemento definitions
function findDefinitionsElement(injector) {
  const modeler = injector.get('bpmnjs', false);
  if (!modeler) return null;

  // Garantir que pegamos o definitions
  const definitions = modeler.getDefinitions();
  console.log('definitions type:', definitions && definitions.$type); // DEBUG
  return definitions;
}

/***/ }),

/***/ "./client/properties-panel/custom/MultiSelectEntry.js":
/*!************************************************************!*\
  !*** ./client/properties-panel/custom/MultiSelectEntry.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MultiSelectEntry)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @bpmn-io/properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
// Use Preact explicitamente para evitar erro "React is not defined"



function MultiSelectEntry(props) {
  const {
    element,
    id,
    description,
    label,
    getValue,
    setValue,
    getOptions,
    disabled,
    onFocus,
    onBlur,
    tooltip
  } = props;
  const options = getOptions(element);

  // Corrige: sempre retorna array de strings, mesmo se vier undefined ou string vazia
  let rawValue = getValue(element);
  let value;
  if (Array.isArray(rawValue)) {
    value = rawValue;
  } else if (typeof rawValue === 'string') {
    value = rawValue.split(',').map(v => v.trim()).filter(Boolean);
  } else if (rawValue == null) {
    value = [];
  } else {
    value = [String(rawValue)];
  }
  const handleChange = event => {
    const selected = Array.from(event.target.selectedOptions).map(opt => opt.value);
    setValue(selected);
  };

  // Corrige: sempre passa value como array (mesmo se vazio)
  return (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('div', {
    class: classnames__WEBPACK_IMPORTED_MODULE_2___default()('bio-properties-panel-entry'),
    'data-entry-id': id
  }, (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('label', {
    for: id,
    class: 'bio-properties-panel-label'
  }, (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    value: tooltip,
    forId: id,
    element: element
  }, label)), (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('select', {
    id,
    name: id,
    class: 'bio-properties-panel-input',
    multiple: true,
    onInput: handleChange,
    onFocus,
    onBlur,
    value: value.length ? value : [''],
    disabled
  }, options.map((option, idx) => (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('option', {
    key: idx,
    value: option.value,
    disabled: option.disabled,
    selected: value.includes(option.value)
  }, option.label))), (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__.Description, {
    forId: id,
    element: element,
    value: description
  }));
}

/***/ }),

/***/ "./client/properties-panel/custom/RadioEntry.js":
/*!******************************************************!*\
  !*** ./client/properties-panel/custom/RadioEntry.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RadioEntry)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @bpmn-io/properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);



function RadioEntry(props) {
  const {
    element,
    id,
    description,
    label,
    getValue,
    setValue,
    getOptions,
    disabled,
    onFocus,
    onBlur,
    tooltip
  } = props;
  const options = getOptions(element);
  const value = getValue(element) || '';
  const handleChange = event => {
    setValue(event.target.value);
  };
  return (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('div', {
    class: classnames__WEBPACK_IMPORTED_MODULE_2___default()('bio-properties-panel-entry'),
    'data-entry-id': id
  }, label && (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('label', {
    class: 'bio-properties-panel-label'
  }, (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    value: tooltip,
    forId: id,
    element: element
  }, label)), (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('div', {
    class: 'bio-properties-panel-radio-group'
  }, options.map((option, idx) => (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('label', {
    key: idx,
    class: 'bio-properties-panel-radio'
  }, (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)('input', {
    type: 'radio',
    name: id,
    value: option.value,
    checked: value === option.value,
    disabled: disabled || option.disabled,
    onInput: handleChange,
    onFocus,
    onBlur
  }), option.label))), (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_1__.Description, {
    forId: id,
    element: element,
    value: description
  }));
}

/***/ }),

/***/ "./client/properties-panel/helper/extensions-helper.js":
/*!*************************************************************!*\
  !*** ./client/properties-panel/helper/extensions-helper.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createCamundaProperties: () => (/* binding */ createCamundaProperties),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createExtensionElements: () => (/* binding */ createExtensionElements),
/* harmony export */   findExtensions: () => (/* binding */ findExtensions),
/* harmony export */   getCamundaProperties: () => (/* binding */ getCamundaProperties),
/* harmony export */   getExtensionElements: () => (/* binding */ getExtensionElements)
/* harmony export */ });
/* harmony import */ var bpmn_js_lib_features_modeling_util_ModelingUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmn-js/lib/util/ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");


function findExtensions(element, types) {
  const extensionElements = getExtensionElements(element);
  if (!extensionElements) {
    return [];
  }
  return extensionElements.get('values').filter(value => {
    return (0,bpmn_js_lib_features_modeling_util_ModelingUtil__WEBPACK_IMPORTED_MODULE_0__.isAny)(value, [].concat(types));
  });
}
function getExtensionElements(element) {
  const businessObject = (0,bpmn_js_lib_features_modeling_util_ModelingUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element);
  return businessObject.get('extensionElements');
}
function getCamundaProperties(element) {
  const bo = (0,bpmn_js_lib_features_modeling_util_ModelingUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element);
  const properties = findExtensions(bo, 'camunda:Properties') || [];
  if (properties.length) {
    return properties[0];
  }
  return null;
}
function createExtensionElements(element, bpmnFactory) {
  const bo = (0,bpmn_js_lib_features_modeling_util_ModelingUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element);
  return createElement('bpmn:ExtensionElements', {
    values: []
  }, bo, bpmnFactory);
}
function createCamundaProperties(extensionElements, bpmnFactory, properties) {
  return createElement('camunda:Properties', properties, extensionElements, bpmnFactory);
}
function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);
  element.$parent = parent;
  return element;
}

/***/ }),

/***/ "./client/properties-panel/helper/fixed-properties-helper.js":
/*!*******************************************************************!*\
  !*** ./client/properties-panel/helper/fixed-properties-helper.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFixedProperty: () => (/* binding */ getFixedProperty),
/* harmony export */   setFixedProperty: () => (/* binding */ setFixedProperty)
/* harmony export */ });
/* harmony import */ var _extensions_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extensions-helper */ "./client/properties-panel/helper/extensions-helper.js");
// client/properties-panel/helper/fixed-properties-helper.js

 // Adapte o caminho se moveu/renomeou extensions-helper.js

function getDefinitionsElement(element) {
  if (!element) return null;
  const bo = element.businessObject || element;

  // If we already have definitions, return it
  if (bo.$type === 'bpmn:Definitions') {
    return bo;
  }

  // Navigate up until we find definitions
  let current = bo;
  while (current && current.$type !== 'bpmn:Definitions') {
    current = current.$parent;
  }
  return current;
}

/**
 * Obtém o valor de uma propriedade camunda:property específica.
 * @param {object} element O elemento definitions do diagrama.
 * @param {string} propertyName O nome da propriedade (ex: 'processo:codigo').
 * @returns {string|undefined} O valor da propriedade ou undefined.
 */
function getFixedProperty(element, propertyName) {
  if (!element) return '';
  const definitions = getDefinitionsElement(element);
  if (!definitions) return '';
  const extensionElements = definitions.get('extensionElements');
  if (!extensionElements) return '';
  const camundaProperties = extensionElements.get('values').find(v => v.$type === 'camunda:Properties');
  if (!camundaProperties || !camundaProperties.values) return '';
  const property = camundaProperties.values.find(p => p.name === propertyName);
  return property ? property.value : '';
}

/**
 * Define o valor de uma propriedade camunda:property específica.
 * @param {object} element O elemento definitions do diagrama.
 * @param {string} propertyName O nome da propriedade.
 * @param {string} propertyValue O valor da propriedade.
 * @param {object} modeling Serviço de modelagem do bpmn-js.
 * @param {object} bpmnFactory Fábrica de elementos BPMN do bpmn-js.
 */
function setFixedProperty(element, propertyName, propertyValue, modeling, bpmnFactory) {
  if (!element) return;
  console.log('setFixedProperty called with:', {
    element,
    propertyName,
    propertyValue
  });
  const definitions = getDefinitionsElement(element);
  console.log('Found definitions:', definitions); // DEBUG

  if (!definitions) {
    console.warn('No definitions found');
    return;
  }
  let extensionElements = definitions.get('extensionElements');

  // 1. Garante bpmn:ExtensionElements
  if (!extensionElements) {
    extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
    modeling.updateModdleProperties(definitions, definitions, {
      extensionElements: extensionElements
    });
  }

  // 2. Garante camunda:Properties
  let camundaProperties = extensionElements.get('values').find(v => v.$type === 'camunda:Properties');
  if (!camundaProperties) {
    camundaProperties = bpmnFactory.create('camunda:Properties', {
      values: []
    });
    modeling.updateModdleProperties(definitions, extensionElements, {
      values: [...extensionElements.get('values'), camundaProperties]
    });
  }

  // 3. Atualiza ou cria a propriedade
  let targetProperty = camundaProperties.values?.find(p => p.name === propertyName);
  if (shouldRemoveProperty(propertyValue)) {
    if (targetProperty) {
      const newValues = camundaProperties.values.filter(p => p.name !== propertyName);
      modeling.updateModdleProperties(definitions, camundaProperties, {
        values: newValues
      });
    }
  } else {
    if (targetProperty) {
      modeling.updateModdleProperties(definitions, targetProperty, {
        value: propertyValue
      });
    } else {
      const newProperty = bpmnFactory.create('camunda:Property', {
        name: propertyName,
        value: propertyValue
      });
      const newValues = [...(camundaProperties.values || []), newProperty];
      modeling.updateModdleProperties(definitions, camundaProperties, {
        values: newValues
      });
    }
  }
}
function shouldRemoveProperty(value) {
  return value === undefined || value === null || value === '';
}

// Adapte ou copie as funções createExtensionElements, createCamundaProperties,
// getExtensionElements, getCamundaProperties de 'extensions-helper.js' para este arquivo
// ou ajuste os imports se você reorganizar os helpers.
// É crucial que getCamundaPropertiesContainer retorne o elemento <camunda:Properties>.
// A versão original em extensions-helper.js:
// export function getCamundaProperties(element) {
//   const bo = getBusinessObject(element); // Certifique-se que 'element' aqui é o business object
//   const properties = findExtensions(bo, 'camunda:Properties') || [];
//   if (properties.length) {
//     return properties[0];
//   }
//   return null;
// }
// findExtensions também de extensions-helper.js
// export function findExtensions(element, types) {
//   const extensionElements = getExtensionElements(element); // element é o business object
//   if (!extensionElements) {
//     return [];
//   }
//   return extensionElements.get('values').filter(value => {
//     return isAny(value, [].concat(types)); // isAny de bpmn-js/lib/features/modeling/util/ModelingUtil
//   });

/***/ }),

/***/ "./client/properties-panel/index.js":
/*!******************************************!*\
  !*** ./client/properties-panel/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProcessDocumentationPropertiesProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProcessDocumentationPropertiesProvider */ "./client/properties-panel/ProcessDocumentationPropertiesProvider.js");
// client/properties-panel/index.js


// Garante que estamos usando a classe construtora real.
const ActualProviderClass = _ProcessDocumentationPropertiesProvider__WEBPACK_IMPORTED_MODULE_0__["default"]["default"] || _ProcessDocumentationPropertiesProvider__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: ['processDocumentationPropertiesProvider'],
  processDocumentationPropertiesProvider: ['type', ActualProviderClass]
});

/***/ }),

/***/ "./client/properties-panel/props/current-situation-props.js":
/*!******************************************************************!*\
  !*** ./client/properties-panel/props/current-situation-props.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CurrentSituationGroup: () => (/* binding */ CurrentSituationGroup)
/* harmony export */ });
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @bpmn-io/properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js-properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel.js");
/* harmony import */ var bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helper/fixed-properties-helper */ "./client/properties-panel/helper/fixed-properties-helper.js");
/* harmony import */ var _custom_MultiSelectEntry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../custom/MultiSelectEntry */ "./client/properties-panel/custom/MultiSelectEntry.js");
/* harmony import */ var _custom_RadioEntry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../custom/RadioEntry */ "./client/properties-panel/custom/RadioEntry.js");






// Componente para "Periodicidade"
function PeriodicityEntry(props) {
  const {
    element,
    id
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  const propertyName = 'processo:periodicidade';
  const getValue = () => {
    return (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName);
  };
  const setValue = value => {
    (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory);
  };
  const getOptions = () => {
    return [{
      value: 'diaria',
      label: translate('Diária')
    }, {
      value: 'semanal',
      label: translate('Semanal')
    }, {
      value: 'quinzenal',
      label: translate('Quinzenal')
    }, {
      value: 'mensal',
      label: translate('Mensal')
    }, {
      value: 'bimestral',
      label: translate('Bimestral')
    }, {
      value: 'trimestral',
      label: translate('Trimestral')
    }, {
      value: 'quadrimestral',
      label: translate('Quadrimestral')
    }, {
      value: 'semestral',
      label: translate('Semestral')
    }, {
      value: 'anual',
      label: translate('Anual')
    }, {
      value: 'sob_demanda',
      label: translate('Por demanda')
    }, {
      value: 'outro',
      label: translate('Outro')
    }];
  };
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.SelectEntry)({
    element,
    id: id + '-periodicity',
    label: translate('Periodicidade'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}

// Função para criar as entradas de tempo de execução
function createTimeExecutionEntries(element) {
  return [{
    id: 'time-execution',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
        ...props,
        element,
        label: translate('Tempo de execução do processo'),
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:tempoExecucao'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:tempoExecucao', value, modeling, bpmnFactory),
        debounce
      });
    }
  }, {
    id: 'time-execution-type',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_custom_RadioEntry__WEBPACK_IMPORTED_MODULE_4__["default"])({
        ...props,
        element,
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:tempoExecucaoTipo'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:tempoExecucaoTipo', value, modeling, bpmnFactory),
        getOptions: () => [{
          value: 'estimado',
          label: translate('Estimado')
        }, {
          value: 'mensurado',
          label: translate('Mensurado')
        }]
      });
    }
  }];
}
function createQtdDemandsEntries(element) {
  return [{
    id: 'demands',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
        ...props,
        element,
        label: translate('Quantidade de demandas recebidas'),
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:quantidadeDemandas'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:quantidadeDemandas', value, modeling, bpmnFactory),
        debounce
      });
    }
  }, {
    id: 'demands-type',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_custom_RadioEntry__WEBPACK_IMPORTED_MODULE_4__["default"])({
        ...props,
        element,
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:quantidadeDemandasTipo'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:quantidadeDemandasTipo', value, modeling, bpmnFactory),
        getOptions: () => [{
          value: 'estimado',
          label: translate('Estimado')
        }, {
          value: 'mensurado',
          label: translate('Mensurado')
        }]
      });
    }
  }];
}
function createCapacityEntries(element) {
  return [{
    id: 'capacity',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
        ...props,
        element,
        label: translate('Capacidade aproximada de execução do processo'),
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:capacidadeExecucao'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:capacidadeExecucao', value, modeling, bpmnFactory),
        debounce
      });
    }
  }, {
    id: 'capacity-type',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_custom_RadioEntry__WEBPACK_IMPORTED_MODULE_4__["default"])({
        ...props,
        element,
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:capacidadeExecucaoTipo'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:capacidadeExecucaoTipo', value, modeling, bpmnFactory),
        getOptions: () => [{
          value: 'estimado',
          label: translate('Estimado')
        }, {
          value: 'mensurado',
          label: translate('Mensurado')
        }]
      });
    }
  }];
}
function createExecutorsEntries(element) {
  return [{
    id: 'executors-quantity',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
        ...props,
        element,
        label: translate('Quantidade de executores do processo'),
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:quantidadeExecutores'),
        setValue: value => {
          // Garante que só aceita números inteiros ou vazio
          const intValue = value.replace(/\D/g, '');
          (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:quantidadeExecutores', intValue, modeling, bpmnFactory);
        },
        debounce
      });
    }
  }, {
    id: 'executors-profile',
    component: function (props) {
      const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
      const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
      const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
      const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
      return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextAreaEntry)({
        ...props,
        element,
        label: translate('Perfil'),
        getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, 'processo:perfilExecutores'),
        setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, 'processo:perfilExecutores', value, modeling, bpmnFactory),
        debounce
      });
    }
  }];
}
function CurrentSituationGroup(element, injector) {
  const translate = injector.get('translate');
  const entries = [{
    id: 'process-periodicity',
    component: PeriodicityEntry,
    element
  }, ...createTimeExecutionEntries(element), ...createQtdDemandsEntries(element), ...createCapacityEntries(element), ...createExecutorsEntries(element)];
  return {
    id: 'current-situation',
    label: translate('Dados da situação atual'),
    component: _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.Group,
    entries
  };
}

/***/ }),

/***/ "./client/properties-panel/props/process-documentation-props.js":
/*!**********************************************************************!*\
  !*** ./client/properties-panel/props/process-documentation-props.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProcessDocumentationGroup: () => (/* binding */ ProcessDocumentationGroup)
/* harmony export */ });
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @bpmn-io/properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js");
/* harmony import */ var _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmn-js-properties-panel */ "./node_modules/camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel.js");
/* harmony import */ var bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helper/fixed-properties-helper */ "./client/properties-panel/helper/fixed-properties-helper.js");
// client/properties-panel/props/process-documentation-props.js
 // Group para agrupar as entradas



// Generic Text Field Entry Component
function GenericTextFieldEntry(props) {
  const {
    element,
    id,
    propertyName,
    label
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
    element,
    id,
    label: translate(label),
    getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName),
    setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory),
    debounce
  });
}

// Generic Text Area Entry Component
function GenericTextAreaEntry(props) {
  const {
    element,
    id,
    propertyName,
    label
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextAreaEntry)({
    element,
    id,
    label: translate(label),
    getValue: () => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName),
    setValue: value => (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory),
    debounce
  });
}

// Componente para "Código do Processo"
function ProcessCodeEntry(props) {
  const {
    element,
    id
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  const propertyName = 'processo:codigo'; // Nome da propriedade no XML

  const getValue = () => {
    return (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName);
  };
  const setValue = value => {
    (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory);
  };
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
    element: element,
    // O elemento do diagrama, não a propriedade moddle diretamente
    id: id + '-processCode',
    label: translate('Código do Processo'),
    getValue,
    setValue,
    debounce
  });
}

// Componente para "Nome do Processo"
function ProcessNameEntry(props) {
  const {
    element,
    id
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  const propertyName = 'processo:nome';
  const getValue = () => {
    return (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName);
  };
  const setValue = value => {
    (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory);
  };
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
    element: element,
    id: id + '-processName',
    label: translate('Nome do Processo'),
    getValue,
    setValue,
    debounce
  });
}

// Componente para "Objetivo do Processo"
function ProcessObjectiveEntry(props) {
  const {
    element,
    id
  } = props;
  const modeling = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('modeling');
  const translate = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('translate');
  const debounce = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('debounceInput');
  const bpmnFactory = (0,bpmn_js_properties_panel__WEBPACK_IMPORTED_MODULE_1__.useService)('bpmnFactory');
  const propertyName = 'processo:objetivo';
  const getValue = () => {
    return (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.getFixedProperty)(element, propertyName);
  };
  const setValue = value => {
    (0,_helper_fixed_properties_helper__WEBPACK_IMPORTED_MODULE_2__.setFixedProperty)(element, propertyName, value, modeling, bpmnFactory);
  };
  return (0,_bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.TextFieldEntry)({
    element: element,
    id: id + '-processObjective',
    label: translate('Objetivo do Processo'),
    getValue,
    setValue,
    debounce
    // Se quiser um campo de texto maior:
    // component: TextAreaEntry // Importar TextAreaEntry de @bpmn-io/properties-panel
  });
}

// Função que cria o grupo
function ProcessDocumentationGroup(element, injector) {
  const translate = injector.get('translate');
  console.log('Creating group with element:', element); // DEBUG

  // Garantir que temos o elemento definitions
  if (!element || element.$type !== 'bpmn:Definitions') {
    console.warn('Invalid element type for documentation group:', element && element.$type);
    return null;
  }
  const entries = [{
    id: 'process-code',
    component: ProcessCodeEntry,
    element: element // Passando o elemento definitions
  }, {
    id: 'process-name',
    component: ProcessNameEntry,
    element: element // Passando o elemento definitions
  }, {
    id: 'definitions-prop-entrada',
    component: GenericTextFieldEntry,
    element,
    propertyName: 'processo:entradaInsumo',
    label: 'Entrada do processo (Insumo)'
  }, {
    id: 'definitions-prop-fornecedores',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:fornecedores',
    label: 'Fornecedores'
  }, {
    id: 'process-objective',
    component: ProcessObjectiveEntry,
    element: element // Passando o elemento definitions
  }, {
    id: 'definitions-prop-saida',
    component: GenericTextFieldEntry,
    element,
    propertyName: 'processo:saidaResultado',
    label: 'Saída do processo (Resultado / Produto)'
  }, {
    id: 'definitions-prop-clientes',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:clientes',
    label: 'Clientes'
  }, {
    id: 'definitions-prop-interface',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:interfaceProcessos',
    label: 'Interface com outros processos'
  }, {
    id: 'definitions-prop-regras',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:regrasNegocio',
    label: 'Principais regras de negócio do processo'
  }, {
    id: 'definitions-prop-donoArea',
    component: GenericTextFieldEntry,
    element,
    propertyName: 'processo:donoProcessoArea',
    label: 'Dono do processo (Área)'
  }, {
    id: 'definitions-prop-donoGestor',
    component: GenericTextFieldEntry,
    element,
    propertyName: 'processo:donoProcessoGestor',
    label: 'Dono do processo (Gestor(a))'
  }, {
    id: 'definitions-prop-atores',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:atoresEnvolvidos',
    label: 'Atores envolvidos'
  }, {
    id: 'definitions-prop-sistemas',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:sistemasUtilizados',
    label: 'Sistemas utilizados'
  }, {
    id: 'definitions-prop-legislacao',
    component: GenericTextAreaEntry,
    element,
    propertyName: 'processo:legislacaoNormativos',
    label: 'Legislação / Normativos aplicáveis'
  }];

  // Só retorna o grupo se houver entradas (boa prática)
  if (!entries.length) {
    return null;
  }
  return {
    id: 'process-documentation',
    // ID único para o grupo
    label: translate('Documentação do Processo'),
    component: _bpmn_io_properties_panel__WEBPACK_IMPORTED_MODULE_0__.Group,
    // Usando o componente Group para encapsular as entradas
    entries: entries
  };
}

/***/ }),

/***/ "./node_modules/bpmn-js/lib/util/ModelUtil.js":
/*!****************************************************!*\
  !*** ./node_modules/bpmn-js/lib/util/ModelUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBusinessObject: () => (/* binding */ getBusinessObject),
/* harmony export */   getDi: () => (/* binding */ getDi),
/* harmony export */   is: () => (/* binding */ is),
/* harmony export */   isAny: () => (/* binding */ isAny)
/* harmony export */ });
/* harmony import */ var min_dash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js");


/**
 * @typedef { import('../model/Types').Element } Element
 * @typedef { import('../model/Types').ModdleElement } ModdleElement
 */

/**
 * Is an element of the given BPMN type?
 *
 * @param  {Element|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}


/**
 * Return true if element has any of the given types.
 *
 * @param {Element|ModdleElement} element
 * @param {string[]} types
 *
 * @return {boolean}
 */
function isAny(element, types) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_0__.some)(types, function(t) {
    return is(element, t);
  });
}

/**
 * Return the business object for a given element.
 *
 * @param {Element|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

/**
 * Return the di object for a given element.
 *
 * @param {Element} element
 *
 * @return {ModdleElement}
 */
function getDi(element) {
  return element && element.di;
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/helper.js":
/*!***************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/helper.js ***!
  \***************************************************************/
/***/ ((module) => {

module.exports.returnOrThrow = function(getter, minimalModelerVersion) {
  let result;
  try {
    result = getter();
  } catch (error) {}

  if (!result) {
    throw new Error(`Not compatible with Camunda Modeler < ${minimalModelerVersion}`);
  }

  return result;
}


/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getModelerDirectory: () => (/* binding */ getModelerDirectory),
/* harmony export */   getPluginsDirectory: () => (/* binding */ getPluginsDirectory),
/* harmony export */   registerBpmnJSModdleExtension: () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   registerBpmnJSPlugin: () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   registerClientExtension: () => (/* binding */ registerClientExtension),
/* harmony export */   registerClientPlugin: () => (/* binding */ registerClientPlugin),
/* harmony export */   registerCloudBpmnJSModdleExtension: () => (/* binding */ registerCloudBpmnJSModdleExtension),
/* harmony export */   registerCloudBpmnJSPlugin: () => (/* binding */ registerCloudBpmnJSPlugin),
/* harmony export */   registerCloudDmnJSModdleExtension: () => (/* binding */ registerCloudDmnJSModdleExtension),
/* harmony export */   registerCloudDmnJSPlugin: () => (/* binding */ registerCloudDmnJSPlugin),
/* harmony export */   registerDmnJSModdleExtension: () => (/* binding */ registerDmnJSModdleExtension),
/* harmony export */   registerDmnJSPlugin: () => (/* binding */ registerDmnJSPlugin),
/* harmony export */   registerPlatformBpmnJSModdleExtension: () => (/* binding */ registerPlatformBpmnJSModdleExtension),
/* harmony export */   registerPlatformBpmnJSPlugin: () => (/* binding */ registerPlatformBpmnJSPlugin),
/* harmony export */   registerPlatformDmnJSModdleExtension: () => (/* binding */ registerPlatformDmnJSModdleExtension),
/* harmony export */   registerPlatformDmnJSPlugin: () => (/* binding */ registerPlatformDmnJSPlugin)
/* harmony export */ });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a platform specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformBpmnJSPlugin(BpmnJSModule);
 */
function registerPlatformBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.platform.modeler.additionalModules');
}

/**
 * Validate and register a cloud specific bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudBpmnJSPlugin(BpmnJSModule);
 */
function registerCloudBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.cloud.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformBpmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudBpmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a cloud specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerCloudDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerCloudDmnJSModdleExtension(moddleDescriptor);
 */
function registerCloudDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.cloud.modeler.moddleExtension');
}

/**
 * Validate and register a platform specific dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerPlatformDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerPlatformDmnJSModdleExtension(moddleDescriptor);
 */
function registerPlatformDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.platform.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a cloud specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerCloudDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerCloudDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerCloudDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerCloudDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.cloud.modeler.${c}.additionalModules`));
}

/**
 * Validate and register a platform specific dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerPlatformDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerPlatformDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerPlatformDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerPlatformDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.platform.modeler.${c}.additionalModules`));
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/vendor/@bpmn-io/properties-panel/index.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { returnOrThrow } = __webpack_require__(/*! ../../../helper */ "./node_modules/camunda-modeler-plugin-helpers/helper.js");

module.exports = returnOrThrow(() => window.vendor.propertiesPanel.common, '5.0.0');


/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/vendor/bpmn-js-properties-panel.js ***!
  \****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { returnOrThrow } = __webpack_require__(/*! ../helper */ "./node_modules/camunda-modeler-plugin-helpers/helper.js");

module.exports = returnOrThrow(() => window.vendor.propertiesPanel.bpmn, '5.0.0');


/***/ }),

/***/ "./node_modules/preact/dist/preact.module.js":
/*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ b),
/* harmony export */   Fragment: () => (/* binding */ g),
/* harmony export */   cloneElement: () => (/* binding */ E),
/* harmony export */   createContext: () => (/* binding */ F),
/* harmony export */   createElement: () => (/* binding */ y),
/* harmony export */   createRef: () => (/* binding */ _),
/* harmony export */   h: () => (/* binding */ y),
/* harmony export */   hydrate: () => (/* binding */ B),
/* harmony export */   isValidElement: () => (/* binding */ t),
/* harmony export */   options: () => (/* binding */ l),
/* harmony export */   render: () => (/* binding */ q),
/* harmony export */   toChildArray: () => (/* binding */ $)
/* harmony export */ });
var n,l,u,t,i,o,r,f,e,c={},s=[],a=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,h=Array.isArray;function v(n,l){for(var u in l)n[u]=l[u];return n}function p(n){var l=n.parentNode;l&&l.removeChild(n)}function y(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return d(l,f,i,o,null)}function d(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:null==r?++u:r,__i:-1,__u:0};return null==r&&null!=l.vnode&&l.vnode(f),f}function _(){return{current:null}}function g(n){return n.children}function b(n,l){this.props=n,this.context=l}function m(n,l){if(null==l)return n.__?m(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?m(n):null}function k(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k(n)}}function w(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!x.__r++||o!==l.debounceRendering)&&((o=l.debounceRendering)||r)(x)}function x(){var n,u,t,o,r,e,c,s,a;for(i.sort(f);n=i.shift();)n.__d&&(u=i.length,o=void 0,e=(r=(t=n).__v).__e,s=[],a=[],(c=t.__P)&&((o=v({},r)).__v=r.__v+1,l.vnode&&l.vnode(o),L(c,o,r,t.__n,void 0!==c.ownerSVGElement,32&r.__u?[e]:null,s,null==e?m(r):e,!!(32&r.__u),a),o.__.__k[o.__i]=o,M(s,o,a),o.__e!=e&&k(o)),i.length>u&&i.sort(f));x.__r=0}function C(n,l,u,t,i,o,r,f,e,a,h){var v,p,y,d,_,g=t&&t.__k||s,b=l.length;for(u.__d=e,P(u,l,g),e=u.__d,v=0;v<b;v++)null!=(y=u.__k[v])&&"boolean"!=typeof y&&"function"!=typeof y&&(p=-1===y.__i?c:g[y.__i]||c,y.__i=v,L(n,y,p,i,o,r,f,e,a,h),d=y.__e,y.ref&&p.ref!=y.ref&&(p.ref&&z(p.ref,null,y),h.push(y.ref,y.__c||d,y)),null==_&&null!=d&&(_=d),65536&y.__u||p.__k===y.__k?e=S(y,e,n):"function"==typeof y.type&&void 0!==y.__d?e=y.__d:d&&(e=d.nextSibling),y.__d=void 0,y.__u&=-196609);u.__d=e,u.__e=_}function P(n,l,u){var t,i,o,r,f,e=l.length,c=u.length,s=c,a=0;for(n.__k=[],t=0;t<e;t++)null!=(i=n.__k[t]=null==(i=l[t])||"boolean"==typeof i||"function"==typeof i?null:"string"==typeof i||"number"==typeof i||"bigint"==typeof i||i.constructor==String?d(null,i,null,null,i):h(i)?d(g,{children:i},null,null,null):void 0===i.constructor&&i.__b>0?d(i.type,i.props,i.key,i.ref?i.ref:null,i.__v):i)?(i.__=n,i.__b=n.__b+1,f=H(i,u,r=t+a,s),i.__i=f,o=null,-1!==f&&(s--,(o=u[f])&&(o.__u|=131072)),null==o||null===o.__v?(-1==f&&a--,"function"!=typeof i.type&&(i.__u|=65536)):f!==r&&(f===r+1?a++:f>r?s>e-r?a+=f-r:a--:a=f<r&&f==r-1?f-r:0,f!==t+a&&(i.__u|=65536))):(o=u[t])&&null==o.key&&o.__e&&(o.__e==n.__d&&(n.__d=m(o)),N(o,o,!1),u[t]=null,s--);if(s)for(t=0;t<c;t++)null!=(o=u[t])&&0==(131072&o.__u)&&(o.__e==n.__d&&(n.__d=m(o)),N(o,o))}function S(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=S(t[i],l,u));return l}return n.__e!=l&&(u.insertBefore(n.__e,l||null),l=n.__e),l&&l.nextSibling}function $(n,l){return l=l||[],null==n||"boolean"==typeof n||(h(n)?n.some(function(n){$(n,l)}):l.push(n)),l}function H(n,l,u,t){var i=n.key,o=n.type,r=u-1,f=u+1,e=l[u];if(null===e||e&&i==e.key&&o===e.type)return u;if(t>(null!=e&&0==(131072&e.__u)?1:0))for(;r>=0||f<l.length;){if(r>=0){if((e=l[r])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return r;r--}if(f<l.length){if((e=l[f])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return f;f++}}return-1}function I(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||a.test(l)?u:u+"px"}function T(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||I(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||I(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/(PointerCapture)$|Capture$/,"$1")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t?u.u=t.u:(u.u=Date.now(),n.addEventListener(l,o?D:A,o)):n.removeEventListener(l,o?D:A,o);else{if(i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!==l&&"height"!==l&&"href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&"rowSpan"!==l&&"colSpan"!==l&&"role"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,u))}}function A(n){var u=this.l[n.type+!1];if(n.t){if(n.t<=u.u)return}else n.t=Date.now();return u(l.event?l.event(n):n)}function D(n){return this.l[n.type+!0](l.event?l.event(n):n)}function L(n,u,t,i,o,r,f,e,c,s){var a,p,y,d,_,m,k,w,x,P,S,$,H,I,T,A=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),r=[e=u.__e=t.__e]),(a=l.__b)&&a(u);n:if("function"==typeof A)try{if(w=u.props,x=(a=A.contextType)&&i[a.__c],P=a?x?x.props.value:a.__:i,t.__c?k=(p=u.__c=t.__c).__=p.__E:("prototype"in A&&A.prototype.render?u.__c=p=new A(w,P):(u.__c=p=new b(w,P),p.constructor=A,p.render=O),x&&x.sub(p),p.props=w,p.state||(p.state={}),p.context=P,p.__n=i,y=p.__d=!0,p.__h=[],p._sb=[]),null==p.__s&&(p.__s=p.state),null!=A.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=v({},p.__s)),v(p.__s,A.getDerivedStateFromProps(w,p.__s))),d=p.props,_=p.state,p.__v=u,y)null==A.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==A.getDerivedStateFromProps&&w!==d&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(w,P),!p.__e&&(null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(w,p.__s,P)||u.__v===t.__v)){for(u.__v!==t.__v&&(p.props=w,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),S=0;S<p._sb.length;S++)p.__h.push(p._sb[S]);p._sb=[],p.__h.length&&f.push(p);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(w,p.__s,P),null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(d,_,m)})}if(p.context=P,p.props=w,p.__P=n,p.__e=!1,$=l.__r,H=0,"prototype"in A&&A.prototype.render){for(p.state=p.__s,p.__d=!1,$&&$(u),a=p.render(p.props,p.state,p.context),I=0;I<p._sb.length;I++)p.__h.push(p._sb[I]);p._sb=[]}else do{p.__d=!1,$&&$(u),a=p.render(p.props,p.state,p.context),p.state=p.__s}while(p.__d&&++H<25);p.state=p.__s,null!=p.getChildContext&&(i=v(v({},i),p.getChildContext())),y||null==p.getSnapshotBeforeUpdate||(m=p.getSnapshotBeforeUpdate(d,_)),C(n,h(T=null!=a&&a.type===g&&null==a.key?a.props.children:a)?T:[T],u,t,i,o,r,f,e,c,s),p.base=u.__e,u.__u&=-161,p.__h.length&&f.push(p),k&&(p.__E=p.__=null)}catch(n){u.__v=null,c||null!=r?(u.__e=e,u.__u|=c?160:32,r[r.indexOf(e)]=null):(u.__e=t.__e,u.__k=t.__k),l.__e(n,u,t)}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=j(t.__e,u,t,i,o,r,f,c,s);(a=l.diffed)&&a(u)}function M(n,u,t){u.__d=void 0;for(var i=0;i<t.length;i++)z(t[i],t[++i],t[++i]);l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function j(l,u,t,i,o,r,f,e,s){var a,v,y,d,_,g,b,k=t.props,w=u.props,x=u.type;if("svg"===x&&(o=!0),null!=r)for(a=0;a<r.length;a++)if((_=r[a])&&"setAttribute"in _==!!x&&(x?_.localName===x:3===_.nodeType)){l=_,r[a]=null;break}if(null==l){if(null===x)return document.createTextNode(w);l=o?document.createElementNS("http://www.w3.org/2000/svg",x):document.createElement(x,w.is&&w),r=null,e=!1}if(null===x)k===w||e&&l.data===w||(l.data=w);else{if(r=r&&n.call(l.childNodes),k=t.props||c,!e&&null!=r)for(k={},a=0;a<l.attributes.length;a++)k[(_=l.attributes[a]).name]=_.value;for(a in k)_=k[a],"children"==a||("dangerouslySetInnerHTML"==a?y=_:"key"===a||a in w||T(l,a,null,_,o));for(a in w)_=w[a],"children"==a?d=_:"dangerouslySetInnerHTML"==a?v=_:"value"==a?g=_:"checked"==a?b=_:"key"===a||e&&"function"!=typeof _||k[a]===_||T(l,a,_,k[a],o);if(v)e||y&&(v.__html===y.__html||v.__html===l.innerHTML)||(l.innerHTML=v.__html),u.__k=[];else if(y&&(l.innerHTML=""),C(l,h(d)?d:[d],u,t,i,o&&"foreignObject"!==x,r,f,r?r[0]:t.__k&&m(t,0),e,s),null!=r)for(a=r.length;a--;)null!=r[a]&&p(r[a]);e||(a="value",void 0!==g&&(g!==l[a]||"progress"===x&&!g||"option"===x&&g!==k[a])&&T(l,a,g,k[a],!1),a="checked",void 0!==b&&b!==l[a]&&T(l,a,b,k[a],!1))}return l}function z(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function N(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||z(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null,n.__c=void 0}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&N(i[o],u,t||"function"!=typeof n.type);t||null==n.__e||p(n.__e),n.__=n.__e=n.__d=void 0}function O(n,l,u){return this.constructor(n,u)}function q(u,t,i){var o,r,f,e;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],e=[],L(t,u=(!o&&i||t).__k=y(g,null,[u]),r||c,c,void 0!==t.ownerSVGElement,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o,e),M(f,u,e)}function B(n,l){q(n,l,B)}function E(l,u,t){var i,o,r,f,e=v({},l.props);for(r in l.type&&l.type.defaultProps&&(f=l.type.defaultProps),u)"key"==r?i=u[r]:"ref"==r?o=u[r]:e[r]=void 0===u[r]&&void 0!==f?f[r]:u[r];return arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),d(l.type,e,i||l.key,o||l.ref,null)}function F(n,l){var u={__c:l="__cC"+e++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(function(n){n.__e=!0,w(n)})},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=s.slice,l={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getDerivedStateFromError&&(i.setState(o.getDerivedStateFromError(n)),r=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),r=i.__d),r)return i.__E=i}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&null==n.constructor},b.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=v({},this.state),"function"==typeof n&&(n=n(v({},u),this.props)),n&&v(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),w(this))},b.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),w(this))},b.prototype.render=g,i=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f=function(n,l){return n.__v.__b-l.__v.__b},x.__r=0,e=0;
//# sourceMappingURL=preact.module.js.map


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/min-dash/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/min-dash/dist/index.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   bind: () => (/* binding */ bind),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   ensureArray: () => (/* binding */ ensureArray),
/* harmony export */   every: () => (/* binding */ every),
/* harmony export */   filter: () => (/* binding */ filter),
/* harmony export */   find: () => (/* binding */ find),
/* harmony export */   findIndex: () => (/* binding */ findIndex),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   forEach: () => (/* binding */ forEach),
/* harmony export */   get: () => (/* binding */ get),
/* harmony export */   groupBy: () => (/* binding */ groupBy),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isDefined: () => (/* binding */ isDefined),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isNil: () => (/* binding */ isNil),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   isUndefined: () => (/* binding */ isUndefined),
/* harmony export */   keys: () => (/* binding */ keys),
/* harmony export */   map: () => (/* binding */ map),
/* harmony export */   matchPattern: () => (/* binding */ matchPattern),
/* harmony export */   merge: () => (/* binding */ merge),
/* harmony export */   omit: () => (/* binding */ omit),
/* harmony export */   pick: () => (/* binding */ pick),
/* harmony export */   reduce: () => (/* binding */ reduce),
/* harmony export */   set: () => (/* binding */ set),
/* harmony export */   size: () => (/* binding */ size),
/* harmony export */   some: () => (/* binding */ some),
/* harmony export */   sortBy: () => (/* binding */ sortBy),
/* harmony export */   throttle: () => (/* binding */ throttle),
/* harmony export */   unionBy: () => (/* binding */ unionBy),
/* harmony export */   uniqueBy: () => (/* binding */ uniqueBy),
/* harmony export */   values: () => (/* binding */ values),
/* harmony export */   without: () => (/* binding */ without)
/* harmony export */ });
/**
 * Flatten array, one level deep.
 *
 * @template T
 *
 * @param {T[][] | T[] | null} [arr]
 *
 * @return {T[]}
 */
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isDefined(obj) {
  return obj !== undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

function isNumber(obj) {
  return nativeToString.call(obj) === '[object Number]';
}

/**
 * @param {any} obj
 *
 * @return {boolean}
 */
function isFunction(obj) {
  const tag = nativeToString.call(obj);

  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncGeneratorFunction]' ||
    tag === '[object Proxy]'
  );
}

function isString(obj) {
  return nativeToString.call(obj) === '[object String]';
}


/**
 * Ensure collection is an array.
 *
 * @param {Object} obj
 */
function ensureArray(obj) {

  if (isArray(obj)) {
    return;
  }

  throw new Error('must supply array');
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return nativeHasOwnProperty.call(target, key);
}

/**
 * @template T
 * @typedef { (
 *   ((e: T) => boolean) |
 *   ((e: T, idx: number) => boolean) |
 *   ((e: T, key: string) => boolean) |
 *   string |
 *   number
 * ) } Matcher
 */

/**
 * @template T
 * @template U
 *
 * @typedef { (
 *   ((e: T) => U) | string | number
 * ) } Extractor
 */


/**
 * @template T
 * @typedef { (val: T, key: any) => boolean } MatchFn
 */

/**
 * @template T
 * @typedef { T[] } ArrayCollection
 */

/**
 * @template T
 * @typedef { { [key: string]: T } } StringKeyValueCollection
 */

/**
 * @template T
 * @typedef { { [key: number]: T } } NumberKeyValueCollection
 */

/**
 * @template T
 * @typedef { StringKeyValueCollection<T> | NumberKeyValueCollection<T> } KeyValueCollection
 */

/**
 * @template T
 * @typedef { KeyValueCollection<T> | ArrayCollection<T> } Collection
 */

/**
 * Find element in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {Object}
 */
function find(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let match;

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      match = val;

      return false;
    }
  });

  return match;

}


/**
 * Find element index in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {number}
 */
function findIndex(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let idx = isArray(collection) ? -1 : undefined;

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      idx = key;

      return false;
    }
  });

  return idx;
}


/**
 * Filter elements in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {T[]} result
 */
function filter(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let result = [];

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      result.push(val);
    }
  });

  return result;
}


/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param { ((item: T, idx: number) => (boolean|void)) | ((item: T, key: string) => (boolean|void)) } iterator
 *
 * @return {T} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  let val,
      result;

  if (isUndefined(collection)) {
    return;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  for (let key in collection) {

    if (has(collection, key)) {
      val = collection[key];

      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
      }
    }
  }
}

/**
 * Return collection without element.
 *
 * @template T
 * @param {ArrayCollection<T>} arr
 * @param {Matcher<T>} matcher
 *
 * @return {T[]}
 */
function without(arr, matcher) {

  if (isUndefined(arr)) {
    return [];
  }

  ensureArray(arr);

  const matchFn = toMatcher(matcher);

  return arr.filter(function(el, idx) {
    return !matchFn(el, idx);
  });

}


/**
 * Reduce collection, returning a single result.
 *
 * @template T
 * @template V
 *
 * @param {Collection<T>} collection
 * @param {(result: V, entry: T, index: any) => V} iterator
 * @param {V} result
 *
 * @return {V} result returned from last iterator
 */
function reduce(collection, iterator, result) {

  forEach(collection, function(value, idx) {
    result = iterator(result, value, idx);
  });

  return result;
}


/**
 * Return true if every element in the collection
 * matches the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function every(collection, matcher) {

  return !!reduce(collection, function(matches, val, key) {
    return matches && matcher(val, key);
  }, true);
}


/**
 * Return true if some elements in the collection
 * match the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function some(collection, matcher) {

  return !!find(collection, matcher);
}


/**
 * Transform a collection into another collection
 * by piping each member through the given fn.
 *
 * @param  {Object|Array}   collection
 * @param  {Function} fn
 *
 * @return {Array} transformed collection
 */
function map(collection, fn) {

  let result = [];

  forEach(collection, function(val, key) {
    result.push(fn(val, key));
  });

  return result;
}


/**
 * Get the collections keys.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function keys(collection) {
  return collection && Object.keys(collection) || [];
}


/**
 * Shorthand for `keys(o).length`.
 *
 * @param  {Object|Array} collection
 *
 * @return {Number}
 */
function size(collection) {
  return keys(collection).length;
}


/**
 * Get the values in the collection.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function values(collection) {
  return map(collection, (val) => val);
}


/**
 * Group collection members by attribute.
 *
 * @param {Object|Array} collection
 * @param {Extractor} extractor
 *
 * @return {Object} map with { attrValue => [ a, b, c ] }
 */
function groupBy(collection, extractor, grouped = {}) {

  extractor = toExtractor(extractor);

  forEach(collection, function(val) {
    let discriminator = extractor(val) || '_';

    let group = grouped[discriminator];

    if (!group) {
      group = grouped[discriminator] = [];
    }

    group.push(val);
  });

  return grouped;
}


function uniqueBy(extractor, ...collections) {

  extractor = toExtractor(extractor);

  let grouped = {};

  forEach(collections, (c) => groupBy(c, extractor, grouped));

  let result = map(grouped, function(val, key) {
    return val[0];
  });

  return result;
}


const unionBy = uniqueBy;



/**
 * Sort collection by criteria.
 *
 * @template T
 *
 * @param {Collection<T>} collection
 * @param {Extractor<T, number | string>} extractor
 *
 * @return {Array}
 */
function sortBy(collection, extractor) {

  extractor = toExtractor(extractor);

  let sorted = [];

  forEach(collection, function(value, key) {
    let disc = extractor(value, key);

    let entry = {
      d: disc,
      v: value
    };

    for (var idx = 0; idx < sorted.length; idx++) {
      let { d } = sorted[idx];

      if (disc < d) {
        sorted.splice(idx, 0, entry);
        return;
      }
    }

    // not inserted, append (!)
    sorted.push(entry);
  });

  return map(sorted, (e) => e.v);
}


/**
 * Create an object pattern matcher.
 *
 * @example
 *
 * ```javascript
 * const matcher = matchPattern({ id: 1 });
 *
 * let element = find(elements, matcher);
 * ```
 *
 * @template T
 *
 * @param {T} pattern
 *
 * @return { (el: any) =>  boolean } matcherFn
 */
function matchPattern(pattern) {

  return function(el) {

    return every(pattern, function(val, key) {
      return el[key] === val;
    });

  };
}


/**
 * @param {string | ((e: any) => any) } extractor
 *
 * @return { (e: any) => any }
 */
function toExtractor(extractor) {

  /**
   * @satisfies { (e: any) => any }
   */
  return isFunction(extractor) ? extractor : (e) => {

    // @ts-ignore: just works
    return e[extractor];
  };
}


/**
 * @template T
 * @param {Matcher<T>} matcher
 *
 * @return {MatchFn<T>}
 */
function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : (e) => {
    return e === matcher;
  };
}


function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/* global setTimeout clearTimeout */

/**
 * @typedef { {
 *   (...args: any[]): any;
 *   flush: () => void;
 *   cancel: () => void;
 * } } DebouncedFunction
 */

/**
 * Debounce fn, calling it only once if the given time
 * elapsed between calls.
 *
 * Lodash-style the function exposes methods to `#clear`
 * and `#flush` to control internal behavior.
 *
 * @param  {Function} fn
 * @param  {Number} timeout
 *
 * @return {DebouncedFunction} debounced function
 */
function debounce(fn, timeout) {

  let timer;

  let lastArgs;
  let lastThis;

  let lastNow;

  function fire(force) {

    let now = Date.now();

    let scheduledDiff = force ? 0 : (lastNow + timeout) - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);

    clear();
  }

  function schedule(timeout) {
    timer = setTimeout(fire, timeout);
  }

  function clear() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = lastNow = lastArgs = lastThis = undefined;
  }

  function flush() {
    if (timer) {
      fire(true);
    }

    clear();
  }

  /**
   * @type { DebouncedFunction }
   */
  function callback(...args) {
    lastNow = Date.now();

    lastArgs = args;
    lastThis = this;

    // ensure an execution is scheduled
    if (!timer) {
      schedule(timeout);
    }
  }

  callback.flush = flush;
  callback.cancel = clear;

  return callback;
}

/**
 * Throttle fn, calling at most once
 * in the given interval.
 *
 * @param  {Function} fn
 * @param  {Number} interval
 *
 * @return {Function} throttled function
 */
function throttle(fn, interval) {
  let throttling = false;

  return function(...args) {

    if (throttling) {
      return;
    }

    fn(...args);
    throttling = true;

    setTimeout(() => {
      throttling = false;
    }, interval);
  };
}

/**
 * Bind function against target <this>.
 *
 * @param  {Function} fn
 * @param  {Object}   target
 *
 * @return {Function} bound function
 */
function bind(fn, target) {
  return fn.bind(target);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

/**
 * Sets a nested property of a given object to the specified value.
 *
 * This mutates the object and returns it.
 *
 * @template T
 *
 * @param {T} target The target of the set operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} value The value to set.
 *
 * @return {T}
 */
function set(target, path, value) {

  let currentTarget = target;

  forEach(path, function(key, idx) {

    if (typeof key !== 'number' && typeof key !== 'string') {
      throw new Error('illegal key type: ' + typeof key + '. Key should be of type number or string.');
    }

    if (key === 'constructor') {
      throw new Error('illegal key: constructor');
    }

    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });

  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 *
 * @return {any}
 */
function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      return false;
    }

    currentTarget = currentTarget[key];
  });

  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick properties from the given target.
 *
 * @template T
 * @template {any[]} V
 *
 * @param {T} target
 * @param {V} properties
 *
 * @return Pick<T, V>
 */
function pick(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(properties, function(prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @template T
 * @template {any[]} V
 *
 * @param {T} target
 * @param {V} properties
 *
 * @return {Omit<T, V>} target
 */
function omit(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(obj, function(prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });

  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 * @param {Object} target
 * @param {...Object} sources
 *
 * @return {Object} the target
 */
function merge(target, ...sources) {

  if (!sources.length) {
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source || !isObject(source)) {
      return;
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        return;
      }

      let targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {

          // override target[key] with object
          targetVal = {};
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }

    });
  });

  return target;
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _properties_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./properties-panel */ "./client/properties-panel/index.js");
// client/client.js


(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerPlatformBpmnJSPlugin)(_properties_panel__WEBPACK_IMPORTED_MODULE_1__["default"]);
})();

/******/ })()
;
//# sourceMappingURL=client-bundle.js.map