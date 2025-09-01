import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("/Users/lokeshnelluri/hr-automated-backend/.env") });

interface Resume {
  name: string;
  email?: string;
  location?: string;
  skills?: string[];
  experience_years?: number;
  visa_status?: string;
  education?: string;
  projects?: string;
}

async function main() {
  console.log("SUPABASE_URL:", `"${process.env.SUPABASE_URL}"`);
  console.log("SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY ? "OK" : "MISSING");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // ✅ Fetch the raw JSON array of resumes
  const response = await fetch(
    "https://huggingface.co/datasets/datasetmaster/resumes/resolve/main/resumes.json"
  );
  if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);

  const resumes: Resume[] = (await response.json()) as Resume[];
  console.log(`Fetched ${resumes.length} resumes`);

  // ✅ Batch insert to Supabase
  const batchSize = 100;
  for (let i = 0; i < resumes.length; i += batchSize) {
    const batch = resumes.slice(i, i + batchSize);
    const { error } = await supabase.from("resumes").insert(batch);
    if (error) {
      console.error("Error inserting batch:", error);
      break;
    }
    console.log(`✅ Inserted batch ${i} - ${i + batch.length}`);
  }

  console.log("🎉 Import complete.");
}

main().catch(console.error);
