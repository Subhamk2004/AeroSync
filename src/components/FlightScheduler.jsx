import { useState } from 'react';
import { Clock } from 'lucide-react';

export default function FlightSchedulerView({ flights, setFlights, optimized }) {
  const [newFlight, setNewFlight] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    aircraft: '',
    crew: '',
    maxPayload: 5000, // Add default payload capacity
    assignedCargo: [], // Initialize empty cargo array
    currentPayload: 0 // Initialize current payload
  });

  const handleAddFlight = () => {
    // Validate required fields
    if (!newFlight.origin || !newFlight.destination || !newFlight.aircraft) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate flight ID
    const flightId = `FL${String(flights.length + 1).padStart(3, '0')}`;
    
    // Create new flight object with generated ID
    const flightToAdd = {
      ...newFlight,
      id: flightId,
      // Ensure we have default values for optimization
      maxPayload: newFlight.maxPayload || 5000,
      assignedCargo: [],
      currentPayload: 0
    };

    // Add to flights array
    setFlights([...flights, flightToAdd]);
    
    // Reset form
    setNewFlight({
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      aircraft: '',
      crew: '',
      maxPayload: 5000,
      assignedCargo: [],
      currentPayload: 0
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flight Scheduler</h2>
        {optimized && (
          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <Clock size={16} className="mr-1" />
            Schedule optimized
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">Add New Flight</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin*</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="JFK"
              value={newFlight.origin}
              onChange={(e) => setNewFlight({...newFlight, origin: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination*</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="LAX"
              value={newFlight.destination}
              onChange={(e) => setNewFlight({...newFlight, destination: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft*</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFlight.aircraft}
              onChange={(e) => setNewFlight({...newFlight, aircraft: e.target.value})}
              required
            >
              <option value="">Select Aircraft</option>
              <option value="B737">Boeing 737</option>
              <option value="A320">Airbus A320</option>
              <option value="B777">Boeing 777</option>
              <option value="A350">Airbus A350</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFlight.departureTime}
              onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFlight.arrivalTime}
              onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crew</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newFlight.crew}
              onChange={(e) => setNewFlight({...newFlight, crew: e.target.value})}
            >
              <option value="">Select Crew</option>
              <option value="C1">Crew A</option>
              <option value="C2">Crew B</option>
              <option value="C3">Crew C</option>
              <option value="C4">Crew D</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleAddFlight}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Flight
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crew</th>
                {optimized && (
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="py-3 px-4 whitespace-nowrap">{flight.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{flight.origin} → {flight.destination}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {flight.departureTime || '--:--'} - {flight.arrivalTime || '--:--'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{flight.aircraft}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{flight.crew || '--'}</td>
                  {optimized && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {flight.score ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {flight.score}%
                        </span>
                      ) : (
                        '--'
                      )}
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