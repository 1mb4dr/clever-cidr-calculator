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

    // Try primary API first (RIPE Stats)
    try {
      const response = await fetch(`https://stat.ripe.net/data/as-overview/data.json?resource=AS${cleanedAsn}`)
      const data = await response.json()
      
      if (data.data && data.data.holder) {
        // Format RIPE response to match our interface
        return new Response(
          JSON.stringify({
            asn: cleanedAsn,
            name: data.data.holder,
            description: data.data.holder,
            country_code: data.data.announced_by?.[0]?.country || 'Unknown',
            prefix_count: data.data.announced_prefixes || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (error) {
      console.error('RIPE API error:', error)
    }

    // Fallback to BGPView API
    const bgpResponse = await fetch(`https://api.bgpview.io/asn/${cleanedAsn}`)
    const bgpData = await bgpResponse.json()

    if (bgpData.status === 'error') {
      return new Response(
        JSON.stringify({ error: bgpData.status_message || 'ASN lookup failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify(bgpData.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ASN lookup:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to lookup ASN information' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})