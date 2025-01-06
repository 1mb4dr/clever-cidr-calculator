import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, MapPin, Signal, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface HopInfo {
  hop: number;
  ip: string;
  host: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lon: number;
  };
  rtt: number;
}

const generateMockHops = (target: string): HopInfo[] => {
  const countries = [
    { country: "United States", city: "New York", lat: 40.7128, lon: -74.006 },
    { country: "United Kingdom", city: "London", lat: 51.5074, lon: -0.1278 },
    { country: "Germany", city: "Frankfurt", lat: 50.1109, lon: 8.6821 },
    { country: "Japan", city: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { country: "Singapore", city: "Singapore", lat: 1.3521, lon: 103.8198 }
  ];

  return Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, i) => {
    const location = countries[Math.floor(Math.random() * countries.length)];
    return {
      hop: i + 1,
      ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      host: `router-${i + 1}.${location.city.toLowerCase()}.network.com`,
      location,
      rtt: Math.random() * 100 + i * 10
    };
  });
};

const TraceRoute = () => {
  const [host, setHost] = useState("");
  const [traceTarget, setTraceTarget] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["trace", traceTarget],
    queryFn: async () => {
      if (!traceTarget) return null;
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateMockHops(traceTarget);
    },
    enabled: !!traceTarget
  });

  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    setTraceTarget(host);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[200px] space-y-2">
                    <Link 
                      to="/subnet-calculator" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Subnet Calculator
                    </Link>
                    <Link 
                      to="/asn-lookup" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      ASN Lookup
                    </Link>
                    <Link 
                      to="/trace-route" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Trace Route
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Navigation className="h-8 w-8" />
            Trace Route Tool
          </h1>
          <p className="text-muted-foreground">
            Visualize network paths and packet routing across different locations
          </p>
        </div>

        <form onSubmit={handleTrace} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="host">Enter hostname or IP address</Label>
              <Input
                id="host"
                placeholder="e.g., google.com or 8.8.8.8"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-auto">
              Trace Route
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center text-muted-foreground">
            Tracing route...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            Error performing trace route. Please try again.
          </div>
        )}

        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Route to {traceTarget}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.map((hop, index) => (
                  <div
                    key={hop.hop}
                    className="flex items-start gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center gap-2 min-w-[3rem]">
                      <Signal className="h-4 w-4 text-primary" />
                      <span className="font-mono">{hop.hop}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{hop.ip}</span>
                        <span className="text-muted-foreground">({hop.host})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {hop.location.city}, {hop.location.country}
                      </div>
                    </div>
                    <div className="text-sm font-mono">
                      {hop.rtt.toFixed(1)} ms
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TraceRoute;