import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
// import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useMemo } from 'react';

export default function ConstraintsView({ constraints, setConstraints }) {
  const [newConstraint, setNewConstraint] = useState({
    id: '',
    type: '',
    description: ''
  });

  const handleAddConstraint = () => {
    if (!newConstraint.type || !newConstraint.description) return;
    
    setConstraints([...constraints, { 
      ...newConstraint, 
      id: `CS${String(constraints.length + 1).padStart(3, '0')}` 
    }]);
    
    setNewConstraint({
      id: '',
      type: '',
      description: ''
    });
  };

  const handleDeleteConstraint = (id) => {
    setConstraints(constraints.filter(constraint => constraint.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Constraint Management</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">Add New Constraint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newConstraint.type}
              onChange={(e) => setNewConstraint({...newConstraint, type: e.target.value})}
            >
              <option value="">Select Type</option>
              <option value="Aircraft">Aircraft</option>
              <option value="Crew">Crew</option>
              <option value="Airport">Airport</option>
              <option value="Cargo">Cargo</option>
              <option value="Time">Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe the constraint"
              value={newConstraint.description}
              onChange={(e) => setNewConstraint({...newConstraint, description: e.target.value})}
            />
          </div>
        </div>
        <button
          onClick={handleAddConstraint}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Constraint
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-4">Active Constraints</h3>
        <p className="text-gray-500 text-sm mb-4">
          These constraints will be used in scheduling optimization algorithms to find valid flight and cargo assignments.
        </p>
        
        {constraints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No constraints added yet. Add constraints to improve optimization.
          </div>
        ) : (
          <div className="space-y-3">
            {constraints.map((constraint) => (
              <div 
                key={constraint.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                      ${constraint.type === 'Aircraft' ? 'bg-blue-100 text-blue-800' : 
                      constraint.type === 'Crew' ? 'bg-purple-100 text-purple-800' : 
                      constraint.type === 'Airport' ? 'bg-orange-100 text-orange-800' :
                      constraint.type === 'Cargo' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                      {constraint.type}
                    </span>
                    <span className="ml-2 text-sm font-medium">{constraint.id}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{constraint.description}</p>
                </div>
                <button 
                  onClick={() => handleDeleteConstraint(constraint.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg mb-2 text-blue-800">How Constraints Work</h3>
        <p className="text-blue-700 mb-3">
          Constraints are used in the scheduling algorithms to ensure valid solutions:
        </p>
        <ul className="list-disc pl-5 text-blue-600 space-y-1">
          <li>First-order logic formalizes the relationships between flights, cargo, and resources</li>
          <li>Constraint Satisfaction Problem (CSP) ensures all constraints are met</li>
          <li>Backtracking algorithm finds valid solutions when constraints conflict</li>
          <li>Heuristics optimize the schedule while respecting all constraints</li>
        </ul>
      </div>
    </div>
  );
}