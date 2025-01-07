import { Network } from "lucide-react";

interface PacketData {
  protocol: string;
}

export const ProtocolDistribution = ({ packets }: { packets: PacketData[] }) => {
  const protocolStats = packets.reduce((acc, packet) => {
    acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(protocolStats).map(([protocol, count]) => (
        <div key={protocol} className="p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <div className="text-lg font-semibold">{protocol}</div>
          </div>
          <div className="text-2xl font-bold text-primary">{count}</div>
          <div className="text-sm text-muted-foreground">packets</div>
        </div>
      ))}
    </div>
  );
};