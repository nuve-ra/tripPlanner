import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { type InsertTripPlan } from "../shared/schema";

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
    <Card>
      <CardHeader>
        <CardTitle>Trip Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium text-gray-800">{calculateDuration()}</span>
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
  );
}
