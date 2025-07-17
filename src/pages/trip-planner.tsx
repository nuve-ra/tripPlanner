import Header from "../components/Header";
import Hero from "../components/Hero";
import TripPlannerForm from "../components/TripPlannerForm";
import Footer from "../components/Footer";

export default function TripPlanner() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TripPlannerForm />
      </main>
      <Footer />
    </div>
  );
}