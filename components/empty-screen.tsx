import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 p-8">
      <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          Welcome to GPT-4o AI Chatbot! 🎉
        </h1>
        <p className="leading-normal text-muted-foreground">
          무엇을 할 수 있나요? 
        </p>
        <p className="leading-normal text-muted-foreground">
          - 이미지 설명: 이미지를 첨부한 후, 이 그림 설명해줘 라고 물어보세요.
        </p>
        <p className="leading-normal text-muted-foreground">
        - 대화 나누기: 궁금한 점이 있거나 일상 대화를 나누어 보세요
        </p>
        <p className="leading-normal text-muted-foreground">
          소스는{' '}
          <ExternalLink href="https://github.com/5712labs/nextai-app/">
            깃허브에 공개되어 있습니다.
          </ExternalLink>{' '}
        </p>
      </div>
    </div>
  )
}
