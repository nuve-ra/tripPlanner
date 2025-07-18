import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertTripPlanSchema, type InsertTripPlan } from "../shared/schema";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Controller } from "react-hook-form";
import { MapPin, Ticket, Bed, Calendar, Settings, Save, Eye, Plus, Download, CalendarPlus, Share2, Lightbulb } from "lucide-react";
import TripSummary from "./TripSummary";
import type { ControllerRenderProps } from "react-hook-form";
import axios from "axios";


export default function TripPlannerForm() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [submittedTripData, setSubmittedTripData] = useState<InsertTripPlan | null>(null);
  
  const queryClient = useQueryClient();

  const form = useForm<InsertTripPlan>({
    resolver: zodResolver(insertTripPlanSchema),
    defaultValues: {
      tripName: "",
      budget: "",
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
  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ["/api/trip-plans"] });
    setSubmittedTripData(variables);
    form.reset();
  },
    onError: (error) => {
    console.error("Failed to create trip plan:", error);
    // toast removed
  },
});

const onSubmit = (data: InsertTripPlan) => {
  createTripPlan.mutate(data);
};


const handleDownloadPDF = (dataToUse: InsertTripPlan | null) => {
    setIsGeneratingPDF(true);
    try {
            const formData = dataToUse || form.getValues();
      if (!formData) {
        console.error("No trip data available to generate PDF.");
        return;
      }
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      let y = margin;

      // Header
      pdf.setFillColor(79, 70, 229); 
      pdf.rect(0, 0, pageWidth, 80, 'F'); 
      
      pdf.setFontSize(32);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("Vigovia",margin,40); 
      
      pdf.setFontSize(14);
      pdf.setTextColor(100); 
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(255,255,255);
      pdf.text("Your Trip Itinerary", margin, 60); 
      
      y = 90; 

      const addSection = (
        title: string,
        fields: { label: string; value: keyof InsertTripPlan | string }[]
      ) => {
        const sectionMarginTop = 10;
        const lineHeight = 20;
        const sectionHeight = fields.length * lineHeight + 20;
        const barWidth = 24;
        const leftMargin = margin;
        const contentStartX = leftMargin + barWidth + 10;
        const pageHeight = pdf.internal.pageSize.getHeight();
      
        if (y + sectionHeight > pageHeight - 60) {
          pdf.addPage();
          y = margin;
        }
      
        pdf.saveGraphicsState();
        pdf.setFillColor(99, 102, 241); 
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
      
        pdf.roundedRect(leftMargin, y, barWidth, sectionHeight, 8, 8, 'F'); 
        const textX = leftMargin + barWidth / 2 + 2;
        const textY = y + sectionHeight - 6;
        pdf.text(title, textX, textY, { angle: 90, align: 'center' });
      
        pdf.restoreGraphicsState();
      
        pdf.setDrawColor(220);
        pdf.rect(leftMargin, y, pageWidth - margin * 2, sectionHeight);
    
        let currentY = y + 20;
        fields.forEach((field) => {
          const label = field.label;
          const rawValue =
            typeof field.value === "string"
              ? field.value
              : formData[field.value] ?? "N/A";
          const value = Array.isArray(rawValue)
            ? rawValue.join(", ")
            : String(rawValue);
      
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(33, 33, 33);
          pdf.text(`${label}:`, contentStartX, currentY);
      
          pdf.setFont("helvetica", "normal");
          pdf.text(value, contentStartX + 100, currentY);
          currentY += lineHeight;
        });
      
        y += sectionHeight + sectionMarginTop;
      };
      
      
      addSection('Trip Overview', [
        { label: 'Trip Name', value: 'tripName' },
        { label: 'Destination', value: 'destinationCity' },
        { label: 'Departure City', value: 'departureCity' },
        { label: 'Duration', value: 'nights' },
        { label: 'Travelers', value: 'travelers' },
        { label: 'Budget', value: 'budget' },
      ]);

      addSection('Travel Details', [
        { label: 'Travel Class', value: 'travelClass' },
        { label: 'Preferred Airline', value: 'preferredAirline' },
        { label: 'Stops', value: 'stops' },
      ]);

      addSection('Accommodation', [
        { label: 'Type', value: 'accommodationType' },
        { label: 'Star Rating', value: 'starRating' },
        { label: 'Room Type', value: 'roomType' },
      ]);

      addSection('Activities & Preferences', [
        { label: 'Interests', value: 'activityCategories' },
        { label: 'Special Requests', value: 'specialRequests' },
      ]);
      addSection('Travel Insurance', [
        { label: 'Travel Insurance', value: 'travelInsurance' },
      ]);
      addSection('Dietary Restrictions', [
        { label: 'Dietary Restrictions', value: 'dietaryRestrictions' },
      ]);
      addSection('Special Requests', [
        { label: 'Special Requests', value: 'specialRequests' },
      ]);
      addSection('Status', [
        { label: 'Status', value: 'status' },
      ]);

      // Footer
      PDFFooter(pdf, pageWidth, pdf.internal.pageSize.getHeight());

      pdf.save(`${formData.tripName || 'trip-plan'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const PDFFooter = (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
    const footerHeight = 50;
    const footerY = pageHeight - footerHeight;
  
    
    pdf.setFillColor(55, 48, 163); 
    pdf.rect(0, footerY, pageWidth, footerHeight, 'F'); 
  
    pdf.setTextColor(255, 255, 255); 
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('© 2025 Vigovia Travel Technologies Pvt. Ltd.', pageWidth / 2, footerY + 18, { align: 'center' });
    pdf.text('Thank you for choosing Vigovia!', pageWidth / 2, footerY + 35, { align: 'center' });
    pdf.text('Need help?Call us',pageWidth - 40,footerY +10,{align:'right'})
    pdf.text('+91-98xxx6461',pageWidth - 40,footerY +20,{align:'right'})
    pdf.text('Email us',pageWidth - 40,footerY +30,{align:'right'})
    pdf.text('vigovia@gmail.com',pageWidth - 40,footerY +40,{align:'right'})
    pdf.setFontSize(12);
    pdf.setTextColor(0); 
    

  };
  


  


  

  const activityCategories = [
    "Sightseeing & Tours",
    "Food & Dining",
    "Adventure & Outdoor",
    "Cultural & Historical",
  ];

  

  return (
    
    <div className="max-h-screen overflow-y-auto">
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-400 rounded-2xl p-8 text-white mb-8">
            <CardTitle className="text-5xl font-bold text-center text-purple-500 mb-2">vigovia</CardTitle>
            <p className="text-white-600 text-lg text-center">Fill in your travel details below</p>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form id="trip-planner-form-pdf" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
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
                          <div className="mb-4">
  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
    Budget range
  </label>
  <select
    id="budget"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select a range</option>
    <option value="0-1000">Under $1,000</option>
    <option value="1000-2500">$1,000 - $2,500</option>
    <option value="2500-5000">$2,500 - $5,000</option>
    <option value="5000-10000">$5,000 - $10,000</option>
    <option value="10000+">$10,000+</option>
  </select>
</div>
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
                        <div className="mb-4">
                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
                          Travelers
                        </label>
                        <select
                          id="travelers"
                          {...field}
                          value={field.value ?? ''}
                           onChange={(e) => field.onChange(Number(e.target.value))}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Travelers</option>
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4+ People</option>
                        </select>
                      </div>
                                                <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                        <div className="mb-4">
                        <label htmlFor="travelClass" className="block text-sm font-medium text-gray-700">
                          Travel Class
                        </label>
                        <select
                          id="travelClass"
                          {...field}
                          value={field.value ?? ''}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Travel Class</option>
                          <option value="economy">Economy</option>
                          <option value="business">Business</option>
                          <option value="first">First Class</option>
                        </select>
                      </div>
                      
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
                          <div className="mb-4">
  <label htmlFor="stops" className="block text-sm font-medium text-gray-700">
    Stops
  </label>
  <select
    id="stops"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select Stops</option>
    <option value="nonstop">Non-stop</option>
    <option value="1stop">1 Stop</option>
    <option value="2stops">2+ Stops</option>
  </select>
</div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
<div className="mb-4">
  <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700">
    Accommodation Type
  </label>
  <select
    id="accommodationType"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select Accommodation Type</option>
    <option value="hotel">Hotel</option>
    <option value="apartment">Apartment</option>
    <option value="hostel">Hostel</option>
    <option value="resort">Resort</option>
    <option value="bnb">Bed & Breakfast</option>
  </select>
</div>
<FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="starRating"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "starRating"> }) => (

                        <FormItem>
                          <div className="mb-4">
  <label htmlFor="starRating" className="block text-sm font-medium text-gray-700">
    Rating
  </label>
  <select
    id="starRating"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select Rating</option>
    <option value="1">1 Star</option>
    <option value="2">2 Stars</option>
    <option value="3">3 Stars</option>
    <option value="4">4 Stars</option>
    <option value="5">5 Stars</option>
  </select>
</div>

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
                         <div className="mb-4">
  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
   Room Type
  </label>
  <select
    id="roomType"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select Room Type</option>
    <option value="single">Single</option>
    <option value="double">Double</option>
    <option value="suite">Suite</option>
    <option value="family">Family</option>
  </select>
</div>

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
                      name="nights"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "nights"> }) => (
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Calendar className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Activities & Experiences</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                      control={form.control}
                      name="activityCategories"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "activityCategories"> }) => (

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
                      name="activityBudget"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "activityBudget"> }) => (

                        <FormItem>
                          <div className="mb-4">
  <label htmlFor="activityBudget" className="block text-sm font-medium text-gray-700">
    Budget per Activity
  </label>
  <select
    id="activityBudget"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select a budget</option>
    <option value="budget">$0 - $50</option>
    <option value="moderate">$50 - $150</option>
    <option value="premium">$150 - $300</option>
    <option value="luxury">$300+</option>
  </select>
</div>
  <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Controller
                      control={form.control}
                      name="specialRequests"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "specialRequests"> }) => (

                      <FormItem>
                        <FormLabel>Special Requests</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements or preferences for activities..."
                            rows={3}
                            {...field} value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Settings className="text-travel-blue" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800">Additional Preferences</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                   <Controller
                      control={form.control}
                      name="travelInsurance"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "travelInsurance"> }) => (

                        <FormItem>
                          <div className="mb-4">
  <label htmlFor="travelInsurance" className="block text-sm font-medium text-gray-700">
   Travel Insurance
  </label>
  <select
    id="travelInsurance"
    {...field}
    value={field.value ?? ''}
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    required
  >
    <option value="">Select insurance</option>
    <option value="none">None</option>
    <option value="basic">Basic</option>
    <option value="comprehensive">Comprehensive</option>
    <option value="premium">Premium</option>
  </select>
</div>

                        </FormItem>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="dietaryRestrictions"
                      render={({ field }: { field: ControllerRenderProps<InsertTripPlan, "dietaryRestrictions"> }) => (

                        <FormItem>
                          <FormLabel>Dietary Restrictions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Vegetarian, Vegan, Gluten-free" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
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
          {submittedTripData && <TripSummary data={submittedTripData} />}
          
          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                          <Button onClick={() => handleDownloadPDF(submittedTripData)} disabled={isGeneratingPDF} className="w-full bg-coral-accent hover:bg-red-500"
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
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="bg-purple-900 text-color-1 p-2 rounded">
                <span className="text-white mt-1">Need help ? Call us</span>
                
                </div>
                </li>
                <li className="flex items-start space-x-2">
                  <Lightbulb className="text-yellow-500 mt-1" size={16} />
                  <span className="font-bold">+91-98xxx6461</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Lightbulb className="text-yellow-500 mt-1" size={16} />
                  <span>HD-109 Cinnabar Hills, Links Business Park<br />
                  North Bangalore, Karnataka, India - 560071</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
          <CardContent className="pt-4">
            <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
  <MapPin className="text-purple-600 mt-1" size={16} />
  <span className="text-sm text-gray-700">
    HD-109 Cinnabar Hills, Links Business Park<br />
    North Bangalore, Karnataka, India - 560071
  </span>
</li>
              <li className="flex items-start space-x-2">
                <MapPin className="text-red-500 mt-1" size={16} />
                <span>Office Hours: 9 AM - 6 PM</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        </div>
      </div>
    </div>
    </div>
  );
}