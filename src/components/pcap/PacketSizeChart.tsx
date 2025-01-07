import { Line } from 'react-chartjs-2';

interface PacketData {
  timestamp: string;
  length: number;
}

export const PacketSizeChart = ({ packets }: { packets: PacketData[] }) => {
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

  return (
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
  );
};