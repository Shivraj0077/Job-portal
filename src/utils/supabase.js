import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a non-authenticated client for initial setup
const adminSupabase = createClient(supabaseUrl, supabaseKey);

// Create the companies bucket if it doesn't exist
(async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const bucketExists = buckets.some(bucket => bucket.name === 'companies');
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { error } = await adminSupabase.storage.createBucket('companies', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket "companies" created successfully');
      }
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
  }
})();

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  return supabase;
};

export default supabaseClient;