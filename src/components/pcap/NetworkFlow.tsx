import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PacketData {
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  length: number;
  timestamp: string;
}

export const NetworkFlow = ({ packets }: { packets: PacketData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !packets.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Create nodes and links from packets
    const nodes = new Set<string>();
    packets.forEach(packet => {
      nodes.add(packet.sourceIP);
      nodes.add(packet.destinationIP);
    });

    const links = packets.map(packet => ({
      source: packet.sourceIP,
      target: packet.destinationIP,
      protocol: packet.protocol,
      value: packet.length
    }));

    // Set up the force simulation
    const simulation = d3.forceSimulation(Array.from(nodes).map(id => ({ id })))
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(400, 300));

    // Create SVG elements
    const svg = d3.select(svgRef.current);
    
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value) / 10);

    const node = svg.append("g")
      .selectAll("circle")
      .data(simulation.nodes())
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#69b3a2");

    node.append("title")
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });

  }, [packets]);

  return (
    <div className="w-full h-[600px] bg-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Network Flow Diagram</h3>
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 600" />
    </div>
  );
};