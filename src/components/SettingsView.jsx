import React, { useState } from 'react';

export default function SettingsView() {
    const [settings, setSettings] = useState({
      optimizationPreference: 'balanced',
      maxBacktrackingIterations: 1000,
      heuristicWeight: 0.75,
      constraintStrictness: 'medium'
    });
  
    const handleChangeSettings = (key, value) => {
      setSettings({
        ...settings,
        [key]: value
      });
    };
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Algorithm Settings</h2>
        </div>
  
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Optimization Preferences</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Optimization Goal</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={settings.optimizationPreference}
                  onChange={(e) => handleChangeSettings('optimizationPreference', e.target.value)}
                >
                  <option value="fuel">Fuel Efficiency</option>
                  <option value="time">Time Efficiency</option>
                  <option value="capacity">Cargo Capacity</option>
                  <option value="balanced">Balanced</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Determines which factors the algorithms prioritize during optimization
                </p>
              </div>
  
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Heuristic Weight</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  className="w-full"
                  value={settings.heuristicWeight}
                  onChange={(e) => handleChangeSettings('heuristicWeight', parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Exact (Slower)</span>
                  <span>{settings.heuristicWeight}</span>
                  <span>Approximate (Faster)</span>
                </div>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-medium mb-4">Algorithm Parameters</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Backtracking Iterations</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={settings.maxBacktrackingIterations}
                  onChange={(e) => handleChangeSettings('maxBacktrackingIterations', parseInt(e.target.value))}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum number of iterations for the backtracking algorithm
                </p>
              </div>
  
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Constraint Strictness</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={settings.constraintStrictness}
                  onChange={(e) => handleChangeSettings('constraintStrictness', e.target.value)}
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="medium">Medium</option>
                  <option value="strict">Strict</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  How strictly the CSP solver enforces constraints
                </p>
              </div>
            </div>
          </div>
  
          <div className="bg-indigo-50 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-indigo-800 mb-2">Algorithm Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-indigo-700 mb-1">First-Order Logic Implementation</h4>
                <p className="text-sm text-indigo-600">
                  Uses predicate logic to express complex relationships between flights, cargo, and constraints.
                  Example: ∀f∈Flights, ∀c∈Cargo, Assigned(c,f) → Weight(c) ≤ Capacity(f)
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-indigo-700 mb-1">Constraint Satisfaction Problem</h4>
                <p className="text-sm text-indigo-600">
                  Formulates scheduling as a CSP with variables (flights, cargo), domains (possible assignments), 
                  and constraints (time slots, capacity).
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-indigo-700 mb-1">Backtracking Algorithm</h4>
                <p className="text-sm text-indigo-600">
                  Recursively explores the solution space, backtracking when constraints are violated 
                  to find valid schedules.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-indigo-700 mb-1">Heuristic Optimization</h4>
                <p className="text-sm text-indigo-600">
                  Uses domain-specific heuristics to guide the search toward optimal solutions based on
                  fuel efficiency, time constraints, and cargo priorities.
                </p>
              </div>
            </div>
          </div>
  
          <div className="flex justify-end mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
              Reset to Defaults
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  }