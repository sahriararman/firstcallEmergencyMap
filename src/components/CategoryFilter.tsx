import React from 'react';
import { ServiceCategory } from '../types/emergency';

interface CategoryFilterProps {
  categories: ServiceCategory[];
  onToggle: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, onToggle }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Services</h3>
      <div className="space-y-3">
        {categories.map(category => (
          <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={category.enabled}
              onChange={() => onToggle(category.id)}
              className="form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              style={{ accentColor: category.color }}
            />
            <span className="text-2xl">{category.icon}</span>
            <span className="text-gray-700 font-medium">{category.name}</span>
            <span 
              className="ml-auto px-2 py-1 text-xs rounded-full text-white font-medium"
              style={{ backgroundColor: category.color }}
            >
              Active
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;