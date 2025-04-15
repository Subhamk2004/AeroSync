import MetricCard from './MetricCard';
import { PlaneTakeoff, Package, AlertTriangle } from 'lucide-react';

export default function DashboardView({ flights, cargo, constraints, optimized, onOptimize, onReset, loading }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex gap-2">
            {optimized ? (
              <button 
                onClick={onReset}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset Optimization
              </button>
            ) : (
              <button 
                onClick={onOptimize}
                disabled={loading}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Optimizing...' : 'Optimize Schedule'}
              </button>
            )}
          </div>
        </div>
  
        {loading && (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="mb-4 text-indigo-600 animate-spin">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium">Running AI optimization algorithms...</p>
            <p className="text-gray-500 mt-2">Using CSP, backtracking, and heuristics to find optimal scheduling</p>
          </div>
        )}
  
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard 
                icon={<PlaneTakeoff className="text-indigo-600" />} 
                title="Total Flights" 
                value={flights.length} 
                subtitle={optimized ? "Optimally scheduled" : "Pending optimization"} 
              />
              <MetricCard 
                icon={<Package className="text-green-600" />} 
                title="Cargo Items" 
                value={cargo.length} 
                subtitle={optimized ? "Efficiently distributed" : "Pending allocation"} 
              />
              <MetricCard 
                icon={<AlertTriangle className="text-amber-500" />} 
                title="Constraints" 
                value={constraints.length} 
                subtitle="Active scheduling rules" 
              />
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Flight Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        {optimized && (
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {flights.slice(0, 4).map(flight => (
                        <tr key={flight.id}>
                          <td className="py-2 px-3 whitespace-nowrap">{flight.id}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{flight.origin} → {flight.destination}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{flight.departureTime}</td>
                          {optimized && (
                            <td className="py-2 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {flight.score}%
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Cargo Allocation</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                        {optimized && (
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cargo.slice(0, 4).map(item => (
                        <tr key={item.id}>
                          <td className="py-2 px-3 whitespace-nowrap">{item.id}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{item.type}</td>
                          <td className="py-2 px-3 whitespace-nowrap">{item.assignedFlight}</td>
                          {optimized && (
                            <td className="py-2 px-3 whitespace-nowrap">
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
          </>
        )}
      </div>
    );
  }