import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kwhxdfgavzhzqbwqmhgj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3aHhkZmdhdnpoenFid3FtaGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTQzMzAsImV4cCI6MjA4NzY3MDMzMH0.G2ANN6oKLRIb7h7nCgQuirrJB6ynHYMfjCMwAe9_VuE";

export const supabase = createClient(supabaseUrl, supabaseKey);