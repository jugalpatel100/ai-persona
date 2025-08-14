export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft whitespace-pre-wrap break-words text-sm md:text-base
        ${isUser
          ? 'bg-brand-600 text-white'
          : 'bg-white text-gray-900 border border-gray-200'}
        `}
      >
        {content}
      </div>
    </div>
  )
}