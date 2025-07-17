import { CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-travel-blue to-blue-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Your Perfect Trip</h2>
        <p className="text-xl opacity-90 mb-8">Book travel tickets, activities, and accommodations all in one place</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-sage-green" size={20} />
            <span>Instant Booking</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-sage-green" size={20} />
            <span>PDF Export</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-sage-green" size={20} />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
