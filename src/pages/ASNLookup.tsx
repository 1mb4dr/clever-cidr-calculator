import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ASNNavigation } from "@/components/asn/ASNNavigation";
import { ASNSearchForm } from "@/components/asn/ASNSearchForm";
import { ASNResult } from "@/components/asn/ASNResult";
import { useToast } from "@/hooks/use-toast";

interface ASNResponse {
  asn: string;
  name: string;
  description: string;
  country_code: string;
  prefix_count: number;
}

const ASNLookup = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["asn", searchTerm],
    queryFn: async () => {
      if (!searchTerm) {
        throw new Error("ASN is required");
      }

      const cleanedAsn = searchTerm.trim().replace(/[^0-9]/g, '');
      if (!cleanedAsn) {
        throw new Error("Invalid ASN format");
      }

      // Direct fetch to BGPView API instead of using Supabase Edge Function
      const response = await fetch(`https://api.bgpview.io/asn/${cleanedAsn}`);
      const result = await response.json();

      if (result.status === 'error') {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.status_message || 'Failed to lookup ASN information'
        });
        throw new Error(result.status_message || 'ASN lookup failed');
      }

      if (result.data) {
        toast({
          title: "Success",
          description: `Found information for AS${result.data.asn}`
        });
      }

      return result.data as ASNResponse;
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
          <ASNNavigation />

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">ASN Lookup Tool</CardTitle>
              <CardDescription className="text-gray-300">
                Enter an ASN number to get detailed information about it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ASNSearchForm
                query={query}
                isLoading={isLoading}
                onQueryChange={setQuery}
                onSubmit={handleSearch}
              />
              <ASNResult
                data={data}
                isLoading={isLoading}
                error={error as Error}
                isError={isError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ASNLookup;