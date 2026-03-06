'use client'

import { Feather } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-center gap-3 pt-10 pb-2 md:pt-14 md:pb-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center size-10 rounded-2xl bg-primary/10">
          <Feather className="size-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium tracking-tight text-foreground text-balance">
            SoulWrite
          </h1>
          <p className="text-xs text-muted-foreground font-light tracking-widest">
            灵感文案生成器
          </p>
        </div>
      </div>
    </header>
  )
}
