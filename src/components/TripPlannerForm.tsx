import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTripPlanSchema, type InsertTripPlan } from "../shared/schema";
//import { apiRequest } from "../lib/qyeryClient";
//import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Controller } from "react-hook-form";
import { MapPin, Ticket, Bed, Calendar, Settings, Save, Eye, Plus, Download, CalendarPlus, Share2, Lightbulb } from "lucide-react";
import TripSummary from "./TripSummary";
import { generatePDF } from "../lib/pdf-generator";
import type { ControllerRenderProps } from "react-hook-form";
import axios from "axios";



export default function TripPlannerForm() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  //const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTripPlan>({
    resolver: zodResolver(insertTripPlanSchema),
    defaultValues: {
      tripName: "",
      budget: 0,
      startDate: "",
      endDate: "",
      travelers: 1,
      departureCity: "",
      destinationCity: "",
      travelClass: "economy",
      preferredAirline: "",
      stops: "nonstop",
      accommodationType: "hotel",
      starRating: "4",
      roomType: "double",
      checkinDate: "",
      nights: 1,
      activityCategories: [],
      activityBudget: "moderate",
      specialRequests: "",
      travelInsurance: "none",
      dietaryRestrictions: "",
      status: "draft",
    },
  });

  const createTripPlan = useMutation({
  mutationFn: async (data: InsertTripPlan) => {
    const response = await axios.post("/api/trip-plans", data);
    return response.data;
  },
  onSuccess: () => {
    // toast removed
    queryClient.invalidateQueries({ queryKey: ["/api/trip-plans"] });
  },
  onError: (error) => {
    // toast removed
  },
});

const onSubmit = (data: InsertTripPlan) => {
  createTripPlan.mutate(data);
};

const handleDownloadPDF = async () => {
  setIsGeneratingPDF(true);
  try {
    const formData = form.getValues();
    await generatePDF(formData);
    // toast removed
  } catch (error) {
    // toast removed
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const activityCategories = [
    "Sightseeing & Tours",
    "Food & Dining",
    "Adventure & Outdoor",
    "Cultural & Historical",
  ];

  const watchedValues = form.watch();

  return (
    
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-travel-blue to-blue-600 text-white">
            <CardTitle className="text-xl text-blue-500">Create Your Trip Plan</CardTitle>
            <p className="text-blue-500 mt-1">Fill in your travel details below</p>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Trip Overview Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <MapPin className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Trip Overview</h4>
                  </div>
                  
                    <Controller
                      control={form.control}
                      name="tripName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Summer European Adventure" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (USD)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5000" value={field.value ?? ''} onBlur={field.onBlur} name={field.name} ref={field.ref} onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Controller
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="travelers"
                      render={({
                        field,
                      }: {
                        field: ControllerRenderProps<InsertTripPlan, "travelers">;
                      }) => (
                        <FormItem>
                          <FormLabel>Travelers</FormLabel>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) => field.onChange(Number(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 Person</SelectItem>
                              <SelectItem value="2">2 People</SelectItem>
                              <SelectItem value="3">3 People</SelectItem>
                              <SelectItem value="4">4+ People</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                {/* Travel Tickets Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Ticket className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Travel Tickets</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (
                        <FormItem>
                          <FormLabel>Departure City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="destinationCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "destinationCity"> }) => (

                        <FormItem>
                          <FormLabel>Destination City</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris, France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                <Controller
                      control={form.control}
                      name="travelClass"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "travelClass"> }) => (

                        <FormItem>
                          <FormLabel>Travel Class</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="first">First Class</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            <Controller
                      control={form.control}
                      name="preferredAirline"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "preferredAirline"> }) => (
                        <FormItem>
                          <FormLabel>Preferred Airline</FormLabel>
                          <FormControl>
                            <Input placeholder="Any" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="stops"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "stops"> }) => (

                        <FormItem>
                          <FormLabel>Stops</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nonstop">Non-stop</SelectItem>
                              <SelectItem value="1stop">1 Stop</SelectItem>
                              <SelectItem value="2stops">2+ Stops</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Accommodation Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Bed className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Accommodation</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="accommodationType"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "accommodationType"> }) => (

                        <FormItem>
                          <FormLabel>Accommodation Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hotel">Hotel</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                              <SelectItem value="resort">Resort</SelectItem>
                              <SelectItem value="bnb">Bed & Breakfast</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="starRating"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "starRating"> }) => (

                        <FormItem>
                          <FormLabel>Star Rating</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="roomType"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "roomType"> }) => (

                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single Room</SelectItem>
                              <SelectItem value="double">Double Room</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                              <SelectItem value="family">Family Room</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
<Controller
                      control={form.control}
                      name="checkinDate"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "checkinDate"> }) => (
                        <FormItem>
                          <FormLabel>Check-in Date</FormLabel>
                          <FormControl>
                            <Input type="date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (
                      <FormItem>
                        <FormLabel>Number of Nights</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="7" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Activities Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Calendar className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Activities & Experiences</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (

                        <FormItem>
                          <FormLabel>Activity Categories</FormLabel>
                          <div className="space-y-2">
                            {activityCategories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={category}
                                  checked={field.value?.includes(category)}
                                  onChange={(e) => {
                                    const checked = (e.target as HTMLInputElement).checked;
                                    const currentValue = (field.value as unknown as string[]) || [];

                                    if (checked) {
                                      field.onChange([...currentValue, category]);
                                    } else {
                                      field.onChange(currentValue.filter((c) => c !== category));
                                    }
                                  }}
                                />
                                <Label htmlFor={category} className="text-sm text-gray-700">
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (

                        <FormItem>
                          <FormLabel>Budget per Activity</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="budget">$0 - $50</SelectItem>
                              <SelectItem value="moderate">$50 - $150</SelectItem>
                              <SelectItem value="premium">$150 - $300</SelectItem>
                              <SelectItem value="luxury">$300+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (

                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements or preferences for activities..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Settings className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Additional Preferences</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                   <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (

                        <FormItem>
                          <FormLabel>Travel Insurance</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Insurance</SelectItem>
                              <SelectItem value="basic">Basic Coverage</SelectItem>
                              <SelectItem value="comprehensive">Comprehensive Coverage</SelectItem>
                              <SelectItem value="premium">Premium Coverage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="departureCity"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "departureCity"> }) => (

                        <FormItem>
                          <FormLabel>Dietary Restrictions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Vegetarian, Vegan, Gluten-free" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    <Save className="mr-2" size={16} />
                    Save as Draft
                  </Button>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      <Eye className="mr-2" size={16} />
                      Preview Trip
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-travel-blue hover:bg-blue-700"
                      disabled={createTripPlan.isPending}
                    >
                      <Plus className="mr-2" size={16} />
                      {createTripPlan.isPending ? "Creating..." : "Create Trip Plan"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <TripSummary data={watchedValues} />
          
          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full bg-coral-accent hover:bg-red-500"
              >
                <Download className="mr-2" size={16} />
                {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button variant="outline" className="w-full">
                <CalendarPlus className="mr-2" size={16} />
                Export to Calendar
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2" size={16} />
                Share Trip
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Lightbulb className="text-yellow-500 mt-1" size={16} />
                  <span>Book flights and accommodation early for better prices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Lightbulb className="text-yellow-500 mt-1" size={16} />
                  <span>Check visa requirements for your destination</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Lightbulb className="text-yellow-500 mt-1" size={16} />
                  <span>Consider travel insurance for peace of mind</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
