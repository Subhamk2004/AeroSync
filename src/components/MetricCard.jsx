export default function MetricCard({ icon, title, value, subtitle }) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="ml-2 text-lg font-medium">{title}</h3>
        </div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    );
  }
  