// client/properties-panel/index.js
import ProviderClass from './ProcessDocumentationPropertiesProvider';

// Garante que estamos usando a classe construtora real.
const ActualProviderClass = ProviderClass.default || ProviderClass;

export default {
  __init__: [ 'processDocumentationPropertiesProvider' ],
  processDocumentationPropertiesProvider: [ 'type', ActualProviderClass ]
};