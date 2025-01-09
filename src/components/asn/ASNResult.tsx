import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ASNResponse {
  asn: string;
  name: string;
  description: string;
  country_code: string;
  prefix_count: number;
}

interface ASNResultProps {
  data: ASNResponse | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export const ASNResult = ({ data, isLoading, error, isError }: ASNResultProps) => {
  if (isLoading) {
    return (
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
    );
  }

  if (isError && error) {
    return (
      <div className="text-red-400 text-center mt-4 p-4 bg-red-900/20 rounded-md">
        {error instanceof Error ? error.message : 'Error fetching ASN information. Please try again.'}
      </div>
    );
  }

  if (!data) return null;

  return (
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
  );
};