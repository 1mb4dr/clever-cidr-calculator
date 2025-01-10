import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WifiIcon, Cable, Shield, Fingerprint } from "lucide-react";
import { NetworkFlow } from "@/components/clearpass/NetworkFlow";

const ClearpassVisualizer = () => {
  const [selectedAuth, setSelectedAuth] = useState<"mac" | "dot1x">("mac");
  const [selectedNetwork, setSelectedNetwork] = useState<"wired" | "wireless">("wireless");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">ClearPass NAC Flow Visualizer</h1>
        <p className="text-muted-foreground">
          Interactive visualization of ClearPass authentication flows for wired and wireless networks
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={selectedNetwork === "wireless" ? "default" : "outline"}
                onClick={() => setSelectedNetwork("wireless")}
                className="flex-1"
              >
                <WifiIcon className="mr-2" /> Wireless
              </Button>
              <Button
                variant={selectedNetwork === "wired" ? "default" : "outline"}
                onClick={() => setSelectedNetwork("wired")}
                className="flex-1"
              >
                <Cable className="mr-2" /> Wired
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={selectedAuth === "mac" ? "default" : "outline"}
                onClick={() => setSelectedAuth("mac")}
                className="flex-1"
              >
                <Fingerprint className="mr-2" /> MAC Authentication
              </Button>
              <Button
                variant={selectedAuth === "dot1x" ? "default" : "outline"}
                onClick={() => setSelectedAuth("dot1x")}
                className="flex-1"
              >
                <Shield className="mr-2" /> 802.1X
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <NetworkFlow
            networkType={selectedNetwork}
            authMethod={selectedAuth}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClearpassVisualizer;