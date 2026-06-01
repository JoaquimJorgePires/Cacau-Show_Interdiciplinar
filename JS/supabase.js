const supabaseUrl =
    'https://kaytbpkniegmubwuoski.supabase.co';

const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtheXRicGtuaWVnbXVid3Vvc2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyOTcyMTcsImV4cCI6MjA5NDg3MzIxN30.FW_NrXl5ctYcBly33IbdGpD-v7SfqBa4NkjAeZiqjJM';

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );