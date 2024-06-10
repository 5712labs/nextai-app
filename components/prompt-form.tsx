'use client'

import * as React from 'react'
import {useCallback} from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { ImageIcon } from '@radix-ui/react-icons'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {useDropzone} from 'react-dropzone'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage, describeImage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const fileRef = React.useRef<HTMLInputElement>(null)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length == 0) {
      toast.error('No file selected')
      return
    }
    
    acceptedFiles.forEach((file) => {
      if (!file) {
        toast.error('No file selected!')
        return
      }
      const reader = new FileReader()
      
      // reader.onabort = () => console.log('file reading was aborted')
      // reader.onerror = () => console.log('file reading has failed')

      reader.readAsDataURL(file);
      reader.onload = async (event: any) => {
      // Do whatever you want with the file contents
      const image = new Image();
      image.src = event.target.result;
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = image.width, height = image.height;
        const maxSize = 640;
        if (width > height && width > maxSize)
          {
            height *= maxSize / width;
            width = maxSize;
          }
          else if (height > maxSize)
          {
            width *= maxSize / height;
            height = maxSize;
          }
        canvas.width = width;
        canvas.height = height;
        canvas?.getContext('2d')?.drawImage(image, 0, 0, width, height);         
        const base64str = canvas.toDataURL('image/jpeg');
        // console.log(`width : ${image.width} px`, `height: ${image.height} px`);
        // console.log(`width : ${canvas.width} px`, `height: ${canvas.height} px`);
        // console.log(base64str)
        const responseMessage = await describeImage(base64str)
        setMessages(currentMessages => [
          ...currentMessages,
          responseMessage
        ])
      };
    }
    })
    
  }, [describeImage, setMessages])
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  // const { getRootProps, getInputProps, isDragAccept, isDragReject } =
  // useDropzone({
  // onDrop,
  // onDropRejected,
  //   accept: {
  //     "image/jpeg": [],
  //     "image/png": [],
  //     "application/pdf": [],
  //   },
  //   maxSize: 50 * 1024 * 1024, // 50MB
  // });
  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-900 px-12 sm:rounded-xl sm:px-12">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Tooltip>
            <TooltipTrigger asChild>
            <label className="absolute left-0 size-16 bg-zinc-100 dark:bg-zinc-900">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-[14px] size-8 rounded-full bg-background dark:bg-zinc-800 p-0 sm:left-4"
                // onClick={() => {
                //   fileRef.current?.click()
                // }}
              >
                <ImageIcon />              
                <span className="sr-only">이미지를 분석해보세요</span>
              </Button>
              </label>
            </TooltipTrigger>
            <TooltipContent>이미지를 분석해보세요</TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full bg-transparent dark:placeholder:text-zinc-400 placeholder:text-zinc-900 resize-none px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}
              className="dark:bg-zinc-400 bg-transparent shadow-none text-zinc-950 rounded-full hover:bg-zinc-200"
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>essage</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
