import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { type InsertTripPlan } from "../shared/schema";
import { MapPin, Phone } from "lucide-react";

interface TripSummaryProps {
  data: InsertTripPlan;
}

export default function TripSummary({ data }: TripSummaryProps) {
  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return "Not set";
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getTravelerText = () => {
    return data.travelers === 1 ? "1 person" : `${data.travelers} people`;
  };

  const getEstimatedCost = () => {
    if (!data.budget) return "Not set";
    return `$${data.budget.toLocaleString()}`;
  };

  return (
    <div id="trip-summary-pdf" className="space-y-6">
      {/* Trip Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <span className="block text-gray-100">Duration</span>
            <span className="text-lg font-bold">{calculateDuration()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Travelers</span>
            <span className="font-medium text-gray-800">{getTravelerText()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Cost</span>
            <span className="font-medium text-sage-green">{getEstimatedCost()}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Draft
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PDF Footer - Static */}
      <div className="bg-gray-100 rounded-md p-4 mt-6">
        <div className="text-sm text-gray-800 font-semibold mb-2">Contact</div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={14} className="text-purple-600" />
          <span>+91-98xxx6461</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
          <MapPin size={14} className="text-purple-600" />
          <span>HD-109, Links Business Park, Bangalore - 560071</span>
        </div>
        <div className="text-xs text-gray-500 mt-4">
          © 2025 Vigovia Travel Technologies Pvt. Ltd. | Privacy Policy | Terms
        </div>
      </div>
    </div>
  );
}
