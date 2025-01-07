import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const FileUploader = ({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('pcap-files')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const { data: analysisData } = await supabase.functions.invoke('analyze-pcap', {
        body: { filePath: data.path }
      });

      onUploadSuccess(analysisData);
      toast({
        title: "PCAP file processed",
        description: "File uploaded and analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error processing your PCAP file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="relative"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Choose PCAP file"}
      <Upload className="ml-2 h-4 w-4" />
      <input
        type="file"
        accept=".pcap,.pcapng"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileUpload}
        disabled={isLoading}
      />
    </Button>
  );
};