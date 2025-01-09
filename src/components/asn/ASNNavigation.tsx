import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const ASNNavigation = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link 
        to="/" 
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-gray-800 text-gray-100">Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-[200px] space-y-2 bg-gray-800">
                <Link 
                  to="/subnet-calculator" 
                  className="block p-2 hover:bg-gray-700 rounded-md text-gray-100"
                >
                  Subnet Calculator
                </Link>
                <Link 
                  to="/asn-lookup" 
                  className="block p-2 hover:bg-gray-700 rounded-md text-gray-100"
                >
                  ASN Lookup
                </Link>
                <Link 
                  to="/pcap-visualizer" 
                  className="block p-2 hover:bg-gray-700 rounded-md text-gray-100"
                >
                  PCAP Visualizer
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};