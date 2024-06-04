import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  const examplesMessages = [
    {
      heading: '건설 기술',
      subheading: '최신 동향은 무엇인가요?',
      message: `건설 현장에서 최신 건설 기술 동향은 무엇인가요?`
    },
    {
      heading: '프로젝트 리스크',
      subheading: '관리 방법은 무엇인가요?',
      message: '건설 현장에서 건설 프로젝트의 리스크 관리 방법은 무엇인가요?'
    },
    {
      heading: '건설 현장',
      subheading: '안전을 유지하기 위한 주요 지침은 무엇인가요?',
      message: `건설 현장에서 건설 현장에서 안전을 유지하기 위한 주요 지침은 무엇인가요?`
    },
    {
      heading: '프로젝트 일정',
      subheading: `지연 시 대응 방안은 무엇인가요?`,
      message: `건설 현장에서 프로젝트 일정 지연 시 대응 방안은 무엇인가요?`
    },
    {
      heading: '건설 자재',
      subheading: `비용 절감을 위한 전략은 무엇인가요?`,
      message: `건설 현장에서 건설 자재 비용 절감을 위한 전략은 무엇인가요?`
    },
    {
      heading: '프로젝트 예산',
      subheading: `관리 방법은 무엇인가요?`,
      message: `건설 현장에서 프로젝트 예산 관리 방법은 무엇인가요?`
    },
    {
      heading: '예산 초과',
      subheading: `방지를 위한 전략은 무엇인가요?`,
      message: `건설 현장에서 예산 초과를 방지하기 위한 전략은 무엇인가요?`
    }
  ]

    const exampleMessages = examplesMessages.sort(() => Math.random() - 0.5).slice(0, 4);
  
  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-transparent duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-2xl bg-zinc-50 p-4 sm:p-6 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-900 transition-colors${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="font-medium">{example.heading}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:pb-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
