// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kriyoiigelqopehspwac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyaXlvaWlnZWxxb3BlaHNwd2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTA5NzksImV4cCI6MjA1ODY2Njk3OX0.-eyB4n9x___jhsygYEudr2j58cdbU1eyEMej6eMHY_8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);