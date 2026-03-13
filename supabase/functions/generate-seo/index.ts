import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, excerpt } = await req.json();

    const prompt = `Você é um especialista em SEO para blogs em português brasileiro. Com base no título e conteúdo abaixo, gere:
1. meta_title: título SEO otimizado (máx 60 caracteres)
2. meta_description: descrição meta otimizada (máx 160 caracteres)
3. suggested_tags: lista de 3-5 tags relevantes (palavras simples em português)
4. suggested_excerpt: resumo atraente do post (máx 200 caracteres)
5. suggested_category: uma categoria principal para o post (ex: Reflexão, Finanças, Marketing, Negócios, Tecnologia, Vibe Coding, Lifestyle, Empreendedorismo, Criatividade, Desenvolvimento Pessoal)

Responda APENAS em JSON válido com essas 5 chaves.

Título: ${title}
${excerpt ? `Resumo atual: ${excerpt}` : ''}
Conteúdo: ${(content || '').substring(0, 2000)}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
