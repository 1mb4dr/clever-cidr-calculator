import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Home } from "lucide-react";
import { calculateSubnet } from "@/lib/subnet-utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const SubnetCalculator = () => {
  const [ip, setIp] = useState("");
  const [cidr, setCidr] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculateSubnet> | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const subnet = calculateSubnet(ip, parseInt(cidr));
    setResult(subnet);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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
                      to="/pcap-visualizer" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      PCAP Visualizer
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              IP Subnet Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input
                  id="ip"
                  placeholder="e.g. 192.168.1.0"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidr">CIDR Notation</Label>
                <Input
                  id="cidr"
                  placeholder="e.g. 24"
                  value={cidr}
                  onChange={(e) => setCidr(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Calculate</Button>
            </form>

            {result && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Network Address</Label>
                    <div className="text-lg font-mono">{result.networkAddress}</div>
                  </div>
                  <div>
                    <Label>Broadcast Address</Label>
                    <div className="text-lg font-mono">{result.broadcastAddress}</div>
                  </div>
                  <div>
                    <Label>Subnet Mask</Label>
                    <div className="text-lg font-mono">{result.subnetMask}</div>
                  </div>
                  <div>
                    <Label>Total Hosts</Label>
                    <div className="text-lg font-mono">{result.totalHosts}</div>
                  </div>
                  <div>
                    <Label>First Host</Label>
                    <div className="text-lg font-mono">{result.firstHost}</div>
                  </div>
                  <div>
                    <Label>Last Host</Label>
                    <div className="text-lg font-mono">{result.lastHost}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubnetCalculator;