import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
      console.warn("BREVO_API_KEY is not configured. Skipping Brevo integration.");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Brevo integration is not configured",
          skipped: true
        }),
        {
          status: 200,
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
        return new Response(
          JSON.stringify({
            success: true,
            message: "Contact already exists in Brevo",
            alreadyExists: true
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      throw new Error(`Brevo API error: ${brevoData.message || "Unknown error"}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully added to Brevo contacts",
        id: brevoData.id
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
