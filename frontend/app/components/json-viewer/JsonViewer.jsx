import React, { useState } from 'react';

const UniversalJsonViewer = ({ jsonData }) => {
  const [expandedItems, setExpandedItems] = useState({});

  // Helper to toggle expanded state for any path
  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Render any JSON value with appropriate formatting
  const renderValue = (value, path = '') => {
    // Arrays
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <div 
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => toggleExpand(path)}
          >
            {expandedItems[path] ? '▼' : '►'} Array({value.length})
          </div>
          
          {expandedItems[path] && (
            <div className="ml-4 border-l-2 border-gray-300 pl-2">
              {value.map((item, index) => (
                <div key={`${path}-${index}`} className="my-1">
                  <span className="font-semibold text-gray-700">{index}: </span>
                  {renderValue(item, `${path}-${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Objects
    else if (value !== null && typeof value === 'object') {
      const entries = Object.entries(value);
      return (
        <div className="ml-4">
          <div 
            className="cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => toggleExpand(path)}
          >
            {expandedItems[path] ? '▼' : '►'} Object({entries.length})
          </div>
          
          {expandedItems[path] && (
            <div className="ml-4 border-l-2 border-gray-300 pl-2">
              {entries.map(([key, val]) => (
                <div key={`${path}-${key}`} className="my-1">
                  <span className="font-semibold text-gray-700">{key}: </span>
                  {renderValue(val, `${path}-${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Primitive values
    else {
      return (
        <span className={`
          ${typeof value === 'number' ? 'text-green-600' : ''}
          ${typeof value === 'string' ? 'text-red-600' : ''}
          ${typeof value === 'boolean' ? 'text-purple-600' : ''}
          ${value === null ? 'text-gray-500 italic' : ''}
        `}>
          {value === null ? 'null' : String(value)}
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <div className="font-mono text-sm">
        {renderValue(jsonData, 'root')}
      </div>
    </div>
  );
};

export default UniversalJsonViewer;