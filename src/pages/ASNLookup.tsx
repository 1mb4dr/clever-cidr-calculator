import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface ASNResponse {
  asn: string;
  name: string;
  description: string;
  country_code: string;
  prefix_count: number;
  prefixes?: string[];
}

const ASNLookup = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["asn", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const { data, error } = await supabase.functions.invoke('asn-lookup', {
        body: { asn: searchTerm }
      });
      
      if (error) throw error;
      return data as ASNResponse;
    },
    enabled: !!searchTerm,
    retry: 1
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchTerm(query.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">ASN Lookup Tool</CardTitle>
              <CardDescription className="text-gray-300">
                Enter an ASN number to get detailed information about it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="asn" className="text-gray-300">Enter ASN number (e.g., 13335 for Cloudflare)</Label>
                    <Input
                      id="asn"
                      placeholder="Enter ASN number..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading || !query.trim()}
                  >
                    <Search className="mr-2" />
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </form>

              {isLoading && (
                <Card className="mt-6 bg-gray-700 border-gray-600">
                  <CardHeader>
                    <Skeleton className="h-6 w-48 bg-gray-600" />
                    <Skeleton className="h-4 w-full bg-gray-600" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-12 bg-gray-600" />
                      <Skeleton className="h-12 bg-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {isError && error && (
                <div className="text-red-400 text-center mt-4 p-4 bg-red-900/20 rounded-md">
                  {error instanceof Error ? error.message : 'Error fetching ASN information. Please try again.'}
                </div>
              )}

              {data && (
                <Card className="mt-6 bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-gray-100">AS{data.asn} - {data.name}</CardTitle>
                    <CardDescription className="text-gray-300">{data.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Country</Label>
                        <div className="text-lg text-gray-100">{data.country_code}</div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Prefix Count</Label>
                        <div className="text-lg text-gray-100">{data.prefix_count}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ASNLookup;