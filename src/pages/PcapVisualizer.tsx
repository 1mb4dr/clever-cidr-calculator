import { useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { FileUploader } from "@/components/pcap/FileUploader";
import { PacketSizeChart } from "@/components/pcap/PacketSizeChart";
import { ProtocolDistribution } from "@/components/pcap/ProtocolDistribution";
import { PacketTable } from "@/components/pcap/PacketTable";
import { NetworkFlow } from "@/components/pcap/NetworkFlow";
import { TimeSeriesAnalysis } from "@/components/pcap/TimeSeriesAnalysis";

interface PacketData {
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  length: number;
  info?: string;
  sourcePort?: number;
  destinationPort?: number;
  flags?: string;
}

const PcapVisualizer = () => {
  const [packets, setPackets] = useState<PacketData[]>([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
              <CardTitle>Upload PCAP File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <FileUploader onUploadSuccess={setPackets} />
              </div>
            </CardContent>
          </Card>

          {packets.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Network Flow Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkFlow packets={packets} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Series Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeSeriesAnalysis packets={packets} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Packet Size Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <PacketSizeChart packets={packets} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protocol Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProtocolDistribution packets={packets} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Packets</CardTitle>
                </CardHeader>
                <CardContent>
                  <PacketTable packets={packets} />
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