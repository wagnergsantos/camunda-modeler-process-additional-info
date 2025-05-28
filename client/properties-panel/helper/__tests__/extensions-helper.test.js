const {
  getExtensionElements,
  findExtensions,
  getCamundaProperties,
  createExtensionElements,
  createCamundaProperties,
  createElement
} = require('../extensions-helper');

// Mock para bpmn-js/lib/features/modeling/util/ModelingUtil
jest.mock('bpmn-js/lib/features/modeling/util/ModelingUtil', () => ({
  isAny: jest.fn((element, types) => {
    if (element.$type === 'camunda:Properties' && types.includes('camunda:Properties')) {
      return true;
    }
    return false;
  })
}));

// Mock para bpmn-js/lib/util/ModelUtil
jest.mock('bpmn-js/lib/util/ModelUtil', () => ({
  getBusinessObject: jest.fn(element => {
    if (!element) return null;
    return element.businessObject || element;
  })
}));

describe('extensions-helper', () => {
  let mockElement;
  let mockFactory;

  beforeEach(() => {
    // Reset mocks
    mockElement = {
      businessObject: {
        $type: 'bpmn:Process',
        get: jest.fn()
      },
      get: jest.fn()
    };

    mockFactory = {
      create: jest.fn((type, props) => ({
        $type: type,
        ...props
      }))
    };
  });

  describe('getExtensionElements', () => {
    it('should return null if no businessObject', () => {
      const result = getExtensionElements(null);
      expect(result).toBeNull();
    });

    it('should return extensionElements from businessObject', () => {
      const extensionElements = { values: [] };
      mockElement.businessObject.get.mockReturnValue(extensionElements);
      
      const result = getExtensionElements(mockElement);
      
      expect(result).toBe(extensionElements);
      expect(mockElement.businessObject.get).toHaveBeenCalledWith('extensionElements');
    });
  });

  describe('findExtensions', () => {
    it('should return empty array if no extensionElements', () => {
      mockElement.businessObject.get.mockReturnValue(null);
      
      const result = findExtensions(mockElement, 'camunda:Properties');
      
      expect(result).toEqual([]);
    });

    it('should filter and return matching extensions', () => {
      const mockProperties = { $type: 'camunda:Properties' };
      const extensionElements = {
        get: jest.fn().mockReturnValue([
          mockProperties,
          { $type: 'other:Type' }
        ])
      };
      mockElement.businessObject.get.mockReturnValue(extensionElements);

      const result = findExtensions(mockElement, 'camunda:Properties');

      expect(result).toContainEqual(mockProperties);
      expect(result.length).toBe(1);
    });
  });

  describe('getCamundaProperties', () => {
    it('should return null if no camunda:Properties found', () => {
      mockElement.businessObject.get.mockReturnValue(null);
      
      const result = getCamundaProperties(mockElement);
      
      expect(result).toBeNull();
    });

    it('should return camunda:Properties if found', () => {
      const mockProperties = { $type: 'camunda:Properties' };
      const extensionElements = {
        get: jest.fn().mockReturnValue([mockProperties])
      };
      mockElement.businessObject.get.mockReturnValue(extensionElements);

      const result = getCamundaProperties(mockElement);

      expect(result).toBe(mockProperties);
    });
  });

  describe('createExtensionElements', () => {
    it('should create bpmn:ExtensionElements with empty values', () => {
      const result = createExtensionElements(mockElement, mockFactory);

      expect(mockFactory.create).toHaveBeenCalledWith(
        'bpmn:ExtensionElements',
        { values: [] }
      );
      expect(result.$parent).toBe(mockElement.businessObject);
    });
  });

  describe('createCamundaProperties', () => {
    it('should create camunda:Properties with given properties', () => {
      const mockExtensionElements = {};
      const mockProps = { values: [] };

      const result = createCamundaProperties(mockExtensionElements, mockFactory, mockProps);

      expect(mockFactory.create).toHaveBeenCalledWith(
        'camunda:Properties',
        mockProps
      );
      expect(result.$parent).toBe(mockExtensionElements);
    });
  });

  describe('createElement', () => {
    it('should create element with type and set parent', () => {
      const type = 'test:Type';
      const props = { prop: 'value' };
      const parent = {};

      const result = createElement(type, props, parent, mockFactory);

      expect(mockFactory.create).toHaveBeenCalledWith(type, props);
      expect(result.$parent).toBe(parent);
    });
  });
});
