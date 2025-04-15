import { Plane, Package, AlertTriangle, LayoutDashboard } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { id: 'flights', icon: <Plane />, label: 'Flight Scheduler' },
    { id: 'cargo', icon: <Package />, label: 'Cargo Optimizer' },
    { id: 'conflicts', icon: <AlertTriangle />, label: 'Conflict Resolver' },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex space-x-4 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}