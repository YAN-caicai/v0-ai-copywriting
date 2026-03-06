'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ResultCardProps {
  content: string
  isStreaming: boolean
  onRegenerate: () => void
}

export function ResultCard({ content, isStreaming, onRegenerate }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!content && !isStreaming) return null

  return (
    <div className="animate-float-in">
      <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-sm">
        {/* Decorative corner */}
        <div className="absolute top-4 right-4 size-1.5 rounded-full bg-primary/30" />
        <div className="absolute top-4 right-8 size-1 rounded-full bg-accent/40" />

        {/* Content */}
        <div className="min-h-[80px]">
          {isStreaming && !content ? (
            <div className="flex flex-col gap-3">
              <div className="h-4 w-3/4 rounded-full animate-shimmer" />
              <div className="h-4 w-1/2 rounded-full animate-shimmer" />
              <div className="h-4 w-2/3 rounded-full animate-shimmer" />
            </div>
          ) : (
            <p className="text-foreground leading-relaxed font-light text-base md:text-lg whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="inline-block w-0.5 h-5 bg-primary/60 ml-0.5 animate-pulse align-text-bottom" />
              )}
            </p>
          )}
        </div>

        {/* Actions */}
        {content && !isStreaming && (
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="rounded-2xl text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1.5 font-light"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  一键复制
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="rounded-2xl text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1.5 font-light"
            >
              <RefreshCw className="size-3.5" />
              换一个
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
