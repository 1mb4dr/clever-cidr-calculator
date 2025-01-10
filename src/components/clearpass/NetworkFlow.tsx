import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  networkType: "wired" | "wireless";
  authMethod: "mac" | "dot1x";
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: "device" | "switch" | "clearpass" | "radius" | "ad";
  label: string;
  x?: number;
  y?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  id: string;
  label: string;
  sequence: number;
  source: Node;
  target: Node;
}

export const NetworkFlow = ({ networkType, authMethod }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Define nodes based on authentication type
    const nodes: Node[] = [
      { id: "device", type: "device", label: "Client Device" },
      { id: networkType === "wireless" ? "ap" : "switch", type: "switch", 
        label: networkType === "wireless" ? "Access Point" : "Switch" },
      { id: "clearpass", type: "clearpass", label: "ClearPass" },
    ];

    if (authMethod === "dot1x") {
      nodes.push(
        { id: "radius", type: "radius", label: "RADIUS Server" },
        { id: "ad", type: "ad", label: "Active Directory" }
      );
    }

    // Define authentication flow links
    const links: Link[] = [];
    
    if (authMethod === "mac") {
      links.push(
        { 
          id: "1", 
          source: nodes[0], 
          target: nodes[1], 
          label: "1. MAC Auth Request", 
          sequence: 1 
        },
        { 
          id: "2", 
          source: nodes[1], 
          target: nodes[2], 
          label: "2. RADIUS Request", 
          sequence: 2 
        },
        { 
          id: "3", 
          source: nodes[2], 
          target: nodes[1], 
          label: "3. Auth Response", 
          sequence: 3 
        }
      );
    } else {
      links.push(
        { 
          id: "1", 
          source: nodes[0], 
          target: nodes[1], 
          label: "1. 802.1X Request", 
          sequence: 1 
        },
        { 
          id: "2", 
          source: nodes[1], 
          target: nodes[2], 
          label: "2. RADIUS Request", 
          sequence: 2 
        },
        { 
          id: "3", 
          source: nodes[2], 
          target: nodes[3], 
          label: "3. Auth Request", 
          sequence: 3 
        },
        { 
          id: "4", 
          source: nodes[3], 
          target: nodes[4], 
          label: "4. Validate Credentials", 
          sequence: 4 
        },
        { 
          id: "5", 
          source: nodes[4], 
          target: nodes[3], 
          label: "5. Auth Response", 
          sequence: 5 
        },
        { 
          id: "6", 
          source: nodes[3], 
          target: nodes[2], 
          label: "6. Auth Result", 
          sequence: 6 
        },
        { 
          id: "7", 
          source: nodes[2], 
          target: nodes[1], 
          label: "7. Access Decision", 
          sequence: 7 
        }
      );
    }

    // Set up the SVG
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    
    // Create arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#666");

    // Create the force simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append("g")
      .selectAll("g")
      .data(links)
      .join("g");

    link.append("path")
      .attr("class", "link")
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    link.append("text")
      .attr("class", "link-label")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text(d => d.label);

    // Create nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 30)
      .attr("fill", d => getNodeColor(d.type));

    node.append("text")
      .attr("dy", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text(d => d.label)
      .call(wrap, 100);

    // Update positions on each tick
    simulation.on("tick", () => {
      link.selectAll("path")
        .attr("d", (d: Link) => {
          const dx = d.target.x! - d.source.x!;
          const dy = d.target.y! - d.source.y!;
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

      link.selectAll("text")
        .attr("x", (d: Link) => (d.source.x! + d.target.x!) / 2)
        .attr("y", (d: Link) => (d.source.y! + d.target.y!) / 2);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Helper function to wrap text
    function wrap(text: d3.Selection<SVGTextElement, Node, SVGGElement, unknown>, width: number) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px");
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if ((tspan.node()?.getComputedTextLength() || 0) > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px").text(word);
          }
        }
      });
    }

    // Helper function to get node colors
    function getNodeColor(type: string): string {
      switch (type) {
        case "device":
          return "#4f46e5";
        case "switch":
          return "#059669";
        case "clearpass":
          return "#7c3aed";
        case "radius":
          return "#db2777";
        case "ad":
          return "#ea580c";
        default:
          return "#666666";
      }
    }

    return () => {
      simulation.stop();
    };
  }, [networkType, authMethod]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        width="800"
        height="600"
        viewBox="0 0 800 600"
        className="mx-auto"
      />
    </div>
  );
};