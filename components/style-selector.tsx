'use client'

import { cn } from '@/lib/utils'

export interface StyleOption {
  value: string
  label: string
  emoji: string
}

const styles: StyleOption[] = [
  { value: 'melancholy', label: '忧郁', emoji: '🍂' },
  { value: 'cute', label: '可爱', emoji: '🌸' },
  { value: 'luxury', label: '高端', emoji: '💎' },
  { value: 'funny', label: '搞笑', emoji: '😂' },
  { value: 'healing', label: '治愈', emoji: '🍵' },
]

interface StyleSelectorProps {
  selected: string
  onSelect: (value: string) => void
}

export function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-sm text-muted-foreground font-light pl-1">
        选择风格
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {styles.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => onSelect(style.value)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-light whitespace-nowrap transition-all duration-300 border',
              'hover:scale-[1.03] active:scale-[0.97]',
              selected === style.value
                ? 'bg-primary/15 border-primary/30 text-foreground shadow-sm'
                : 'bg-card/60 border-border/50 text-muted-foreground hover:bg-card hover:border-border'
            )}
          >
            <span className="text-base">{style.emoji}</span>
            <span>{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
