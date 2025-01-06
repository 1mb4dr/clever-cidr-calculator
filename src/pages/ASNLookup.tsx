import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
      const response = await fetch(`https://api.bgpview.io/asn/${searchTerm}`);
      const data = await response.json();
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Globe className="h-8 w-8" />
            ASN Lookup Tool
          </h1>
          <p className="text-muted-foreground">
            Look up Autonomous System Numbers (ASN) and get detailed information
          </p>
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