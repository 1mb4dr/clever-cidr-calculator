import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Globe, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const tools = [
    {
      title: "IP Subnet Calculator",
      description: "Calculate network ranges, subnet masks, and CIDR notation",
      icon: Calculator,
      path: "/subnet-calculator"
    },
    {
      title: "ASN Lookup",
      description: "Check Autonomous System Numbers and IP prefix details",
      icon: Globe,
      path: "/asn-lookup"
    },
    {
      title: "Trace Route",
      description: "Visualize network path and packet routing across countries",
      icon: Navigation,
      path: "/trace-route"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Network Tools</h1>
        <p className="text-muted-foreground">Professional networking utilities for administrators and developers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link to={tool.path} key={tool.path} className="transform transition-all hover:scale-105">
            <Card className="h-full bg-card hover:bg-accent/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <tool.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{tool.title}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Click to access tool →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;