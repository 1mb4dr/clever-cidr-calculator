// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gbwotcycnqzqhyhiebra.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdid290Y3ljbnF6cWh5aGllYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyODE1NzUsImV4cCI6MjA0OTg1NzU3NX0.lJbiXkcMERwtNolc8aldc6Ki-ZQ7jpiUBFZsfxD0Zz8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
