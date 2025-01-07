import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Network, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useToast } from "@/components/ui/use-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PacketData {
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  length: number;
}

const PcapVisualizer = () => {
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    // In a real implementation, you would send the file to a backend service
    // that can parse PCAP files. For now, we'll generate mock data
    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock packet data
      const mockPackets: PacketData[] = Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        sourceIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
        destinationIP: `10.0.0.${Math.floor(Math.random() * 255)}`,
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        length: Math.floor(Math.random() * 1500)
      }));

      setPackets(mockPackets);
      toast({
        title: "PCAP file processed",
        description: `Analyzed ${mockPackets.length} packets successfully`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error processing your PCAP file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: packets.map((_, i) => `Packet ${i + 1}`),
    datasets: [
      {
        label: 'Packet Size (bytes)',
        data: packets.map(p => p.length),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const protocolStats = packets.reduce((acc, packet) => {
    acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload PCAP File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="relative"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Choose PCAP file"}
                  <input
                    type="file"
                    accept=".pcap,.pcapng"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>

          {packets.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Packet Size Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line 
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Packet Size (bytes)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Protocol Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(protocolStats).map(([protocol, count]) => (
                      <div key={protocol} className="p-4 bg-card rounded-lg border">
                        <div className="text-lg font-semibold">{protocol}</div>
                        <div className="text-2xl font-bold text-primary">{count}</div>
                        <div className="text-sm text-muted-foreground">packets</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Packets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">Source IP</th>
                          <th className="text-left p-2">Destination IP</th>
                          <th className="text-left p-2">Protocol</th>
                          <th className="text-left p-2">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packets.slice(0, 10).map((packet, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{new Date(packet.timestamp).toLocaleTimeString()}</td>
                            <td className="p-2">{packet.sourceIP}</td>
                            <td className="p-2">{packet.destinationIP}</td>
                            <td className="p-2">{packet.protocol}</td>
                            <td className="p-2">{packet.length} bytes</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PcapVisualizer;