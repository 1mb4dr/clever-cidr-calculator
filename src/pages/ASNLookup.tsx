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

  const { data, isLoading, error } = useQuery({
    queryKey: ["asn", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const { data, error } = await supabase.functions.invoke('asn-lookup', {
        body: { asn: searchTerm }
      });
      if (error) throw error;
      return data.data as ASNResponse;
    },
    enabled: !!searchTerm
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[200px] space-y-2">
                    <Link 
                      to="/subnet-calculator" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Subnet Calculator
                    </Link>
                    <Link 
                      to="/asn-lookup" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      ASN Lookup
                    </Link>
                    <Link 
                      to="/trace-route" 
                      className="block p-2 hover:bg-accent rounded-md"
                    >
                      Trace Route
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="asn">Enter ASN number (e.g., 13335 for Cloudflare)</Label>
              <Input
                id="asn"
                placeholder="Enter ASN number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-auto">
              <Search className="mr-2" />
              Search
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center text-muted-foreground">Loading...</div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            Error fetching ASN information. Please try again.
          </div>
        )}

        {data && (
          <Card>
            <CardHeader>
              <CardTitle>AS{data.asn} - {data.name}</CardTitle>
              <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <div className="text-lg">{data.country_code}</div>
                </div>
                <div>
                  <Label>Prefix Count</Label>
                  <div className="text-lg">{data.prefix_count}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ASNLookup;