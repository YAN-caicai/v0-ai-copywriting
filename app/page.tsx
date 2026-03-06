'use client'

import { useState, useCallback } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Header } from '@/components/header'
import { StyleSelector } from '@/components/style-selector'
import { ResultCard } from '@/components/result-card'

export default function SoulWritePage() {
  const [style, setStyle] = useState('healing')
  const [inputValue, setInputValue] = useState('')

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/generate',
    body: { style },
    onError: (err) => {
      // Try to parse the error response for detailed info from the server
      try {
        const parsed = JSON.parse(err.message)
        if (parsed.error) {
          alert(`API 错误：${parsed.error}`)
          return
        }
      } catch {
        // not JSON, use raw message
      }
      alert(`请求失败：${err.message}`)
    },
    fetch: async (input, init) => {
      const res = await fetch(input, init)
      if (!res.ok) {
        // Read the error body and throw it so onError can parse it
        const body = await res.text()
        try {
          const json = JSON.parse(body)
          if (json.error) {
            throw new Error(json.error)
          }
        } catch (e) {
          if (e instanceof Error && e.message !== body) throw e
          throw new Error(`HTTP ${res.status}: ${body}`)
        }
      }
      return res
    },
  })

  const handleGenerate = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return
    await complete(inputValue.trim(), {
      body: { style, prompt: inputValue.trim() },
    })
  }, [inputValue, style, isLoading, complete])

  const handleRegenerate = useCallback(() => {
    if (!inputValue.trim() || isLoading) return
    handleGenerate()
  }, [inputValue, isLoading, handleGenerate])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-5 pb-16">
        <Header />

        {/* Subtitle */}
        <p className="text-center text-sm text-muted-foreground font-light mt-2 mb-8 md:mb-10 leading-relaxed">
          {'将你的情绪化为动人文字'}
        </p>

        {/* Input area */}
        <div className="flex flex-col gap-5">
          {/* Glassmorphism textarea wrapper */}
          <div className="relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm p-1 shadow-sm transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-md focus-within:shadow-primary/5">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在这里倾诉你的感受、心情或瞬间..."
              rows={4}
              className="w-full bg-transparent rounded-[20px] px-5 py-4 text-foreground placeholder:text-muted-foreground/60 text-base font-light leading-relaxed resize-none outline-none"
            />
          </div>

          {/* Style selector */}
          <StyleSelector selected={style} onSelect={setStyle} />

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!inputValue.trim() || isLoading}
            className="group relative w-full h-13 md:h-14 rounded-2xl bg-primary text-primary-foreground font-normal text-base tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] animate-breathing disabled:animate-none"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {'灵感涌来中...'}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {'开启灵感'}
                </>
              )}
            </span>
          </button>

          {/* Keyboard hint */}
          <p className="text-center text-xs text-muted-foreground/50 font-light -mt-2 hidden md:block">
            {'按 \u2318 + Enter 快速生成'}
          </p>
        </div>

        {/* Result area */}
        <div className="mt-8">
          <ResultCard
            content={completion}
            isStreaming={isLoading}
            onRegenerate={handleRegenerate}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/40 font-light">
            {'Crafted with \u2726 by SoulWrite'}
          </p>
        </footer>
      </div>
    </main>
  )
}
