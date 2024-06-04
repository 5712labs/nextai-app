import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 p-8">
      <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          Welcome to GPT-4o AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          안녕하세요! GPT-4o AI 챗봇에 오신 것을 환영합니다!
        </p>
        <p className="leading-normal text-muted-foreground">
          궁금한 점이 있거나 도움이 필요하시면 언제든지 말씀해 주세요. 여러분의 질문에 최선을 다해 답변해드리겠습니다. 함께 즐거운 대화를 나눠봐요!
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
