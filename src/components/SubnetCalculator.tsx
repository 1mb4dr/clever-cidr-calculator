import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { calculateSubnet, type SubnetInfo } from '@/lib/subnet-utils';

export const SubnetCalculator = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [cidr, setCidr] = useState('');
  const [result, setResult] = useState<SubnetInfo | null>(null);

  const handleCalculate = () => {
    if (!ipAddress || !cidr) {
      toast({
        title: "Error",
        description: "Please enter both IP address and CIDR notation",
        variant: "destructive",
      });
      return;
    }

    const subnetInfo = calculateSubnet(ipAddress, parseInt(cidr));
    if (!subnetInfo) {
      toast({
        title: "Invalid Input",
        description: "Please check your IP address and CIDR notation",
        variant: "destructive",
      });
      return;
    }

    setResult(subnetInfo);
    toast({
      title: "Calculation Complete",
      description: "Subnet information has been calculated successfully",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">IP Subnet Calculator</h1>
        
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">IP Address</label>
              <Input
                placeholder="e.g. 192.168.1.0"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="monospace"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CIDR Notation</label>
              <Input
                placeholder="e.g. 24"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                className="monospace"
              />
            </div>
          </div>
          <Button 
            onClick={handleCalculate}
            className="w-full"
          >
            Calculate Subnet
          </Button>
        </Card>

        {result && (
          <Card className="p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Subnet Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">Network Class</p>
                <p className="font-mono">{result.networkClass}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Subnet Mask</p>
                <p className="font-mono">{result.subnetMask}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Network Address</p>
                <p className="font-mono">{result.networkAddress}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Broadcast Address</p>
                <p className="font-mono">{result.broadcastAddress}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">First Host</p>
                <p className="font-mono">{result.firstHost}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Last Host</p>
                <p className="font-mono">{result.lastHost}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Total Usable Hosts</p>
                <p className="font-mono">{result.totalHosts.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">CIDR Notation</p>
                <p className="font-mono">/{result.cidr}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};