import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, MapPin, Signal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

const TraceRoute = () => {
  const [host, setHost] = useState("");
  const [traceTarget, setTraceTarget] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["trace", traceTarget],
    queryFn: async () => {
      if (!traceTarget) return null;
      // This is a mock response - in a real implementation, you'd need a backend service
      // to perform the actual traceroute
      const mockHops: HopInfo[] = [
        {
          hop: 1,
          ip: "192.168.1.1",
          host: "local-gateway",
          location: {
            country: "United States",
            city: "New York",
            lat: 40.7128,
            lon: -74.0060
          },
          rtt: 1.2
        },
        {
          hop: 2,
          ip: "10.0.0.1",
          host: "isp-router",
          location: {
            country: "United States",
            city: "Chicago",
            lat: 41.8781,
            lon: -87.6298
          },
          rtt: 15.7
        },
        {
          hop: 3,
          ip: "8.8.8.8",
          host: "dns-google",
          location: {
            country: "United States",
            city: "Mountain View",
            lat: 37.3861,
            lon: -122.0839
          },
          rtt: 45.2
        }
      ];
      return mockHops;
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