'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface DynamicFormProps {
  schema: any;
  onSubmit: (data: any) => void;
  loading: boolean;
}

interface FormField {
  key: string;
  type: string;
  title: string;
  description?: string;
  required: boolean;
  default?: any;
  enum?: string[];
  format?: string;
}

export default function DynamicForm({ schema, onSubmit, loading }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fields, setFields] = useState<FormField[]>([]);

  useEffect(() => {
    console.log('DynamicForm received schema:', schema);
    
    if (!schema || !schema.properties) {
      console.log('No schema properties found, setting empty fields');
      setFields([]);
      return;
    }

    const formFields: FormField[] = Object.entries(schema.properties).map(([key, property]: [string, any]) => ({
      key,
      type: property.type || 'string',
      title: property.title || key,
      description: property.description,
      required: schema.required?.includes(key) || false,
      default: property.default,
      enum: property.enum,
      format: property.format,
    }));

    console.log('Generated form fields:', formFields);
    setFields(formFields);

    // Set default values
    const defaultData: Record<string, any> = {};
    formFields.forEach(field => {
      if (field.default !== undefined) {
        defaultData[field.key] = field.default;
      } else if (field.required) {
        // Set reasonable defaults for required fields
        if (field.type === 'array') {
          if (field.key === 'startUrls') {
            defaultData[field.key] = [{ url: 'https://example.com' }];
          } else {
            defaultData[field.key] = [];
          }
        } else if (field.type === 'string') {
          defaultData[field.key] = '';
        } else if (field.type === 'boolean') {
          defaultData[field.key] = false;
        } else if (field.type === 'number' || field.type === 'integer') {
          defaultData[field.key] = 0;
        }
      }
    });
    console.log('Setting default form data:', defaultData);
    setFormData(defaultData);
  }, [schema]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation for required fields
    const missingRequired = fields.filter(field => 
      field.required && (!formData[field.key] || formData[field.key] === '')
    );
    
    if (missingRequired.length > 0) {
      alert(`Please fill in required fields: ${missingRequired.map(f => f.title).join(', ')}`);
      return;
    }

    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] ?? '';

    const commonProps = {
      id: field.key,
      name: field.key,
      required: field.required,
      className: "w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all",
    };

    switch (field.type) {
      case 'boolean':
        return (
          <div className="flex items-center bg-slate-700/30 p-4 rounded-lg border border-slate-600">
            <input
              type="checkbox"
              {...commonProps}
              className="mr-3 h-5 w-5 text-blue-500 focus:ring-blue-500 border-slate-500 rounded bg-slate-600"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
            />
            <label htmlFor={field.key} className="text-sm text-gray-200 font-medium">
              {field.title}
            </label>
          </div>
        );

      case 'integer':
      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            value={value}
            step={field.type === 'integer' ? '1' : 'any'}
            onChange={(e) => handleFieldChange(field.key, field.type === 'integer' ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
          />
        );

      case 'array':
        const displayValue = Array.isArray(value) 
          ? (field.key === 'startUrls' && value.length > 0 && typeof value[0] === 'object' 
              ? value.map((item: any) => item.url || item).join('\n')
              : value.join('\n'))
          : (value || '');
          
        return (
          <textarea
            {...commonProps}
            value={displayValue}
            rows={4}
            placeholder={field.key === 'startUrls' ? 'https://example.com\nhttps://another-site.com' : 'One item per line'}
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(line => line.trim());
              // For URLs, create objects with 'url' property if this is startUrls
              if (field.key === 'startUrls') {
                const urls = lines.map(url => ({ url: url.trim() }));
                handleFieldChange(field.key, urls);
              } else {
                handleFieldChange(field.key, lines);
              }
            }}
          />
        );

      case 'object':
        return (
          <textarea
            {...commonProps}
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : ''}
            rows={6}
            placeholder="Enter JSON object"
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value || '{}');
                handleFieldChange(field.key, parsed);
              } catch {
                // Keep the string value if JSON is invalid
                handleFieldChange(field.key, e.target.value);
              }
            }}
          />
        );

      default:
        if (field.enum) {
          return (
            <select
              {...commonProps}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.enum.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }

        if (field.format === 'uri') {
          return (
            <input
              type="url"
              {...commonProps}
              value={value}
              placeholder="https://example.com"
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            />
          );
        }

        return (
          <input
            type="text"
            {...commonProps}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
    }
  };

  if (fields.length === 0) {
    return (
      <div className="border border-slate-600 bg-slate-800/30 rounded-lg p-6 sm:p-8 text-center backdrop-blur-sm">
        <Play className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg">
          No Configuration Required
        </p>
        <p className="text-gray-400 text-sm mb-6">
          This actor is ready to execute with default parameters
        </p>
        <button
          onClick={() => onSubmit({})}
          disabled={loading}
          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-105 text-sm sm:text-base"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
          )}
          Execute Actor
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {fields.map((field) => (
        <div key={field.key}>
          {field.type !== 'boolean' && (
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-200 mb-2">
              {field.title}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {field.description && (
            <p className="mt-2 text-xs text-gray-400 bg-slate-800/30 p-2 sm:p-3 rounded border border-slate-700 leading-relaxed">{field.description}</p>
          )}
        </div>
      ))}

      <div className="pt-4 sm:pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base sm:text-lg transition-all transform hover:scale-[1.02] shadow-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent mr-3"></div>
              Processing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Execute Actor
            </>
          )}
        </button>
      </div>
    </form>
  );
}
