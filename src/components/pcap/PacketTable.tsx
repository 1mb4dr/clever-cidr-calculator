interface PacketData {
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  length: number;
}

export const PacketTable = ({ packets }: { packets: PacketData[] }) => {
  return (
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
  );
};