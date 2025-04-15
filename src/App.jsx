import { useState, useEffect } from 'react';
import { Calendar, PlaneTakeoff, PlaneLanding, Package, Users, Clock, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import './App.css';
import DashboardView from './components/Dashboard'
import FlightSchedulerView from './components/FlightScheduler'
import CargoManagementView from './components/CargoOptimizer'
import ConstraintsView from './components/ConflictResolver'
import SettingsView from './components/SettingsView'
import MetricCard from './components/MetricCard';

// Main application component
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [flights, setFlights] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    // Sample flights data
    setFlights([
      { id: 'FL001', origin: 'JFK', destination: 'LAX', departureTime: '08:00', arrivalTime: '11:30', aircraft: 'B737', crew: 'C1' },
      { id: 'FL002', origin: 'LAX', destination: 'ORD', departureTime: '13:00', arrivalTime: '18:30', aircraft: 'A320', crew: 'C2' },
      { id: 'FL003', origin: 'ORD', destination: 'JFK', departureTime: '20:00', arrivalTime: '23:30', aircraft: 'B777', crew: 'C3' },
    ]);

    // Sample cargo data
    setCargo([
      { id: 'CG001', weight: 2500, priority: 'High', assignedFlight: 'FL001', type: 'Perishable' },
      { id: 'CG002', weight: 3800, priority: 'Medium', assignedFlight: 'FL002', type: 'Standard' },
      { id: 'CG003', weight: 1200, priority: 'Low', assignedFlight: 'FL003', type: 'Hazardous' },
    ]);

    // Sample constraints
    setConstraints([
      { id: 'CS001', type: 'Aircraft', description: 'B737 requires 45min turnaround time' },
      { id: 'CS002', type: 'Crew', description: 'Crew C1 can only fly 8 hours per day' },
      { id: 'CS003', type: 'Airport', description: 'JFK has limited slots between 18:00-22:00' },
    ]);
  }, []);

  // Run optimization algorithm (simulated)
  const optimizeSchedule = () => {
    setLoading(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Update flights with optimized schedule
      setFlights(prev => prev.map(flight => ({
        ...flight,
        optimized: true,
        score: (Math.random() * 100).toFixed(1)
      })));
      
      // Update cargo with optimized assignments
      setCargo(prev => prev.map(item => ({
        ...item,
        optimized: true,
        efficiency: (Math.random() * 100).toFixed(1)
      })));
      
      setOptimized(true);
      setLoading(false);
    }, 2000);
  };

  // Reset optimization
  const resetOptimization = () => {
    setOptimized(false);
    setFlights(prev => prev.map(flight => {
      const { optimized, score, ...rest } = flight;
      return rest;
    }));
    setCargo(prev => prev.map(item => {
      const { optimized, efficiency, ...rest } = item;
      return rest;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PlaneTakeoff size={24} />
            <h1 className="text-xl font-bold">Airline & Cargo Scheduler</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors">
              Help
            </button>
            <button className="bg-indigo-700 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-800 transition-colors">
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 p-3 rounded-md ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <BarChart3 size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('flights')}
                  className={`w-full flex items-center gap-3 p-3 rounded-md ${activeTab === 'flights' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <PlaneTakeoff size={20} />
                  <span>Flight Scheduler</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('cargo')}
                  className={`w-full flex items-center gap-3 p-3 rounded-md ${activeTab === 'cargo' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Package size={20} />
                  <span>Cargo Management</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('constraints')}
                  className={`w-full flex items-center gap-3 p-3 rounded-md ${activeTab === 'constraints' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <AlertTriangle size={20} />
                  <span>Constraints</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-md ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100'}`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'dashboard' && (
            <DashboardView 
              flights={flights} 
              cargo={cargo} 
              constraints={constraints}
              optimized={optimized}
              onOptimize={optimizeSchedule}
              onReset={resetOptimization}
              loading={loading}
            />
          )}
          
          {activeTab === 'flights' && (
            <FlightSchedulerView 
              flights={flights} 
              setFlights={setFlights}
              optimized={optimized}
            />
          )}
          
          {activeTab === 'cargo' && (
            <CargoManagementView 
              cargo={cargo} 
              setCargo={setCargo}
              flights={flights}
              optimized={optimized}
            />
          )}
          
          {activeTab === 'constraints' && (
            <ConstraintsView 
              constraints={constraints} 
              setConstraints={setConstraints}
            />
          )}
          
          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}