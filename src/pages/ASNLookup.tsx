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

      const { data: response, error: supabaseError } = await supabase.functions.invoke('asn-lookup', {
        body: { asn: cleanedAsn }
      });

      if (supabaseError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || 'Failed to lookup ASN information'
        });
        throw supabaseError;
      }

      if (response) {
        toast({
          title: "Success",
          description: `Found information for AS${response.asn}`
        });
      }

      return response as ASNResponse;
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