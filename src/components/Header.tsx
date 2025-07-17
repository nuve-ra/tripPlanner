import { Plane, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-travel-blue rounded-lg flex items-center justify-center">
              <Plane className="text-white text-sm" size={16} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TripPlan Pro</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-travel-blue transition-colors">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-travel-blue transition-colors">My Trips</a>
            <a href="#" className="text-gray-700 hover:text-travel-blue transition-colors">Support</a>
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="text-gray-700" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
