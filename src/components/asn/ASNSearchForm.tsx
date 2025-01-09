import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ASNSearchFormProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ASNSearchForm = ({ query, isLoading, onQueryChange, onSubmit }: ASNSearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="asn" className="text-gray-300">Enter ASN number (e.g., 13335 for Cloudflare)</Label>
          <Input
            id="asn"
            placeholder="Enter ASN number..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
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
  );
};