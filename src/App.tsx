import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubnetCalculator from "./pages/SubnetCalculator";
import ASNLookup from "./pages/ASNLookup";
import PcapVisualizer from "./pages/PcapVisualizer";
import ClearpassVisualizer from "./pages/ClearpassVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subnet-calculator" element={<SubnetCalculator />} />
          <Route path="/asn-lookup" element={<ASNLookup />} />
          <Route path="/pcap-visualizer" element={<PcapVisualizer />} />
          <Route path="/clearpass-visualizer" element={<ClearpassVisualizer />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;