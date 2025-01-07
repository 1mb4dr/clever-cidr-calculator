import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PacketData {
  timestamp: string;
  length: number;
  protocol: string;
}

export const TimeSeriesAnalysis = ({ packets }: { packets: PacketData[] }) => {
  // Group packets by protocol
  const protocolData = packets.reduce((acc, packet) => {
    if (!acc[packet.protocol]) {
      acc[packet.protocol] = [];
    }
    acc[packet.protocol].push({
      timestamp: new Date(packet.timestamp),
      length: packet.length
    });
    return acc;
  }, {} as Record<string, { timestamp: Date; length: number; }[]>);

  // Prepare data for chart
  const datasets = Object.entries(protocolData).map(([protocol, data]) => ({
    label: protocol,
    data: data.map(d => d.length),
    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    tension: 0.1,
  }));

  const chartData = {
    labels: packets.map(p => new Date(p.timestamp).toLocaleTimeString()),
    datasets,
  };

  return (
    <div className="w-full h-[400px] bg-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Protocol Activity Over Time</h3>
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
            },
            x: {
              title: {
                display: true,
                text: 'Time'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: false,
            }
          }
        }}
      />
    </div>
  );
};