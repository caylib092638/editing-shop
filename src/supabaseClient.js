import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sefwcratubyrtzstugyr.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZndjcmF0dWJ5cnR6c3R1Z3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTk3ODYsImV4cCI6MjA4MDMzNTc4Nn0.T2XJJgrP0Y7ep8QuTeMh-S-kOHf4Y1CNfx50LRqOaAI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
