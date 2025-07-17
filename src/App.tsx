import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import TripPlanner from "../src/components/TripPlannerForm";
import {queryClient} from "../src/lib/qyeryClient"

function Router() {
  return (
    <Switch>
      <Route path="/" component={TripPlanner} />
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <TooltipProvider> */}
        {/* <Toaster /> */}
        <Router />
      {/* </TooltipProvider> */}
    </QueryClientProvider>
  );
}

export default App;
