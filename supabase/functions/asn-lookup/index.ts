import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { asn } = await req.json()

    if (!asn) {
      return new Response(
        JSON.stringify({ error: 'ASN parameter is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    const cleanedAsn = asn.toString().trim().replace(/[^0-9]/g, '')
    
    if (!cleanedAsn) {
      return new Response(
        JSON.stringify({ error: 'Invalid ASN format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    const response = await fetch(`https://api.bgpview.io/asn/${cleanedAsn}`)
    const data = await response.json()

    if (data.status === 'error') {
      return new Response(
        JSON.stringify({ error: data.status_message || 'BGP View API error' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify(data.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ASN lookup:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})