// client/client.js
import {
  registerPlatformBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import propertiesPanelExtensionModule from './properties-panel';
import './styles/custom-panel.css';

registerPlatformBpmnJSPlugin(propertiesPanelExtensionModule);