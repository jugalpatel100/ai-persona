import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = '0px'
    const scrollH = textareaRef.current.scrollHeight
    textareaRef.current.style.height = Math.min(140, scrollH) + 'px'
  }, [value])

  const handleSend = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-3 rounded-2xl p-2 bg-white border border-gray-200 shadow-soft">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Ask something…"
        className="flex-1 resize-none outline-none p-3 rounded-xl text-gray-900 placeholder:text-gray-400"
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || value.trim().length === 0}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50"
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
        Send
      </button>
    </div>
  )
}