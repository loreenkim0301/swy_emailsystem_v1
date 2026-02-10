import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BrevoSubscribeRequest {
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const { email }: BrevoSubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY is not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        listIds: [5],
        updateEnabled: true,
      }),
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      if (brevoResponse.status === 400 && brevoData.code === "duplicate_parameter") {
        console.log("Contact already exists in Brevo");
      } else {
        throw new Error(`Brevo API error: ${brevoData.message || "Unknown error"}`);
      }
    }

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: supabaseError } = await supabase
        .from("subscribers")
        .upsert(
          { email, updated_at: new Date().toISOString() },
          { onConflict: "email" }
        );

      if (supabaseError) {
        console.warn("Failed to backup to Supabase:", supabaseError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully subscribed",
        email: email
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in brevo-subscribe function:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
