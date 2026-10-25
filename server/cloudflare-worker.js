/* «Лёгкость» — Cloudflare Worker прокси к Groq API.
   Загрузи этот файл в Cloudflare Workers и добавь секрет GROQ_API_KEY.
   Бесплатно, работает 24/7, не нужен ноутбук.
*/
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://bladadd.github.io',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/ai/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { messages, model = 'llama-3.1-8b-instant', temperature = 0.4 } = body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: 700,
          }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        return new Response(JSON.stringify({ ok: true, content, model }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (url.pathname === '/api/ai/health') {
      return new Response(JSON.stringify({ ok: true, service: 'groq-worker' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
