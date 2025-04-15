import React, { useState } from 'react';
import { Package } from 'lucide-react';

export default function CargoManagementView({ cargo, setCargo, flights, optimized }) {
  const [newCargo, setNewCargo] = useState({
    id: '',
    weight: '',
    priority: '',
    type: '',
    assignedFlight: ''
  });

  const handleAddCargo = () => {
    if (!newCargo.weight || !newCargo.priority) return;

    setCargo([...cargo, {
      ...newCargo,
      id: `CG${String(cargo.length + 1).padStart(3, '0')}`
    }]);

    setNewCargo({
      id: '',
      weight: '',
      priority: '',
      type: '',
      assignedFlight: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cargo Management</h2>
        {optimized && (
          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <Package size={16} className="mr-1" />
            Allocation optimized
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">Add New Cargo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="1000"
              value={newCargo.weight}
              onChange={(e) => setNewCargo({ ...newCargo, weight: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newCargo.priority}
              onChange={(e) => setNewCargo({ ...newCargo, priority: e.target.value })}
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newCargo.type}
              onChange={(e) => setNewCargo({ ...newCargo, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Standard">Standard</option>
              <option value="Perishable">Perishable</option>
              <option value="Fragile">Fragile</option>
              <option value="Hazardous">Hazardous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Flight</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newCargo.assignedFlight}
              onChange={(e) => setNewCargo({ ...newCargo, assignedFlight: e.target.value })}
            >
              <option value="">Select Flight</option>
              {flights.map(flight => (
                <option key={flight.id} value={flight.id}>
                  {flight.id}: {flight.origin} → {flight.destination}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleAddCargo}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Cargo
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                {optimized && (
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cargo.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4 whitespace-nowrap">{item.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.weight}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.type}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${item.priority === 'High' ? 'bg-red-100 text-red-800' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.assignedFlight}</td>
                  {optimized && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.efficiency}%
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}