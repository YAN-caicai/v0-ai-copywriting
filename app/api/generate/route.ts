import { NextResponse } from 'next/server'

const stylePrompts: Record<string, string> = {
  melancholy:
    '忧郁风格：用文艺、伤感、带有诗意的语气写作，像秋天的落叶般哀愁而美丽，适合发朋友圈配伤感图片。',
  cute: '可爱风格：用甜美、俏皮、元气满满的语气写作，像春天的樱花般温柔可人，可以加一些可爱的语气词。',
  luxury:
    '高端风格：用简练、优雅、有质感的语气写作，像顶级品牌广告般精致克制，字少力量大。',
  funny:
    '搞笑风格：用幽默、有趣、接地气的语气写作，充满网感和段子手气质，让人笑出声。',
  healing:
    '治愈风格：用温暖、平静、抚慰人心的语气写作，像一杯热茶般让人安心，适合深夜发给自己看。',
}

export async function POST(req: Request) {
  try {
    const { prompt, style } = (await req.json()) as {
      prompt?: string
      style?: string
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY 环境变量未设置，请在项目的 Vars 面板中添加。' },
        { status: 400 }
      )
    }

    const userFeeling = prompt?.trim() || '今天天气真好'
    const selectedStyle = style || 'healing'
    const styleInstruction = stylePrompts[selectedStyle] || stylePrompts.healing

    const systemPrompt = `你是一个天才社交媒体文案专家。请根据用户提供的【心情/想法】和【风格要求】，生成 3 条不同角度的文案。

风格要求：${styleInstruction}

规则：
1. 生成 3 条文案，每条之间用空行隔开。
2. 每条文案前标注序号，如"1."、"2."、"3."。
3. 每条文案 50-150 字，要有意境和画面感。
4. 风格要精准：忧郁要文艺、搞笑要有幽默感、高端要简练高级、可爱要甜美俏皮、治愈要温暖人心。
5. 三条文案要从不同角度切入，避免重复。
6. 直接返回文案内容，不要有多余的解释。`

    // Call DeepSeek API directly via fetch to bypass any AI Gateway interception
    const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `我的心情/想法：${userFeeling}` },
        ],
        max_tokens: 1024,
        temperature: 0.9,
        stream: true,
      }),
    })

    if (!deepseekRes.ok || !deepseekRes.body) {
      const errorBody = await deepseekRes.text()
      let errorMsg = `DeepSeek API 错误 (${deepseekRes.status})`
      try {
        const parsed = JSON.parse(errorBody)
        if (parsed.error?.message) errorMsg = parsed.error.message
      } catch {
        errorMsg = errorBody || errorMsg
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    // Transform OpenAI-compatible SSE stream into AI SDK data stream format
    // that useCompletion expects: lines like `0:"text chunk"\n`
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = deepseekRes.body!.getReader()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data: ')) continue
              const data = trimmed.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  // AI SDK data stream text format: 0:"escaped text"\n
                  const escaped = JSON.stringify(content)
                  controller.enqueue(encoder.encode(`0:${escaped}\n`))
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
          // Send finish signal
          controller.enqueue(
            encoder.encode(
              `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`
            )
          )
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(transformedStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    })
  } catch (error: unknown) {
    console.error('[v0] DeepSeek API error:', error)
    const message =
      error instanceof Error ? error.message : '未知错误，请检查 API Key 和账户余额。'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
