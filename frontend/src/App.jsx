import { useMemo, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PersonaCard from './components/PersonaCard'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import { sendChat } from './utils/api'
import { Sparkles } from 'lucide-react'
import { BACKEND_URL } from './utils/constants'

export default function App() {
  const personas = useMemo(() => ([
    { id: 'persona1', name: 'Hitesh Choudhary', icon: '✨' },
    { id: 'persona2', name: 'Piyush Garg', icon: '🪐' }
  ]), [])

  const [activePersona, setActivePersona] = useState(personas[0].id)
  const [chats, setChats] = useState(() => ({ persona1: [], persona2: [] }))
  const [loading, setLoading] = useState(false)
  const viewportRef = useRef(null)

  useEffect(() => {
    const el = viewportRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chats, activePersona, loading])

  useEffect(() => {
    // Clear backend chat history when the page loads
    fetch(`${BACKEND_URL}/reset`, { method: "POST" })
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error("Failed to reset chats:", err));
  }, []); // Empty deps -> runs once on page load

  const onSend = async (message) => {
    const userMsg = { role: 'user', content: message }
    setChats(prev => ({ ...prev, [activePersona]: [...prev[activePersona], userMsg] }))

    setLoading(true)
    try {
      const data = await sendChat({ persona: activePersona, message })
      const assistantMsg = { role: 'assistant', content: data.reply }
      setChats(prev => ({ ...prev, [activePersona]: [...prev[activePersona], assistantMsg] }))
    } catch (err) {
      const assistantMsg = { role: 'assistant', content: `⚠️ ${err.message}` }
      setChats(prev => ({ ...prev, [activePersona]: [...prev[activePersona], assistantMsg] }))
    } finally {
      setLoading(false)
    }
  }

  const currentMessages = chats[activePersona]
  const currentPersona = personas.find(p => p.id === activePersona)

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 bg-grid">
      <header>
        <div className="mx-auto max-w-5xl px-4 pt-6 text-center">
          <div className="flex justify-center mb-4">
          </div>
          <h1 className="font-extrabold text-4xl md:text-5xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent leading-tight pb-1">
            Chat with your favourite mentor
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personas.map(p => (
            <PersonaCard
              key={p.id}
              name={p.name}
              icon={p.icon}
              active={activePersona === p.id}
              onClick={() => setActivePersona(p.id)}
            />
          ))}
        </section>

        <section className="mt-6">
          <div className="dark-glass rounded-3xl border border-white/10 p-1">
            <div className="bg-gradient-to-br from-white/70 to-white/40 rounded-[22px] p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentPersona.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{currentPersona.name}</div>
                    <div className="text-xs text-gray-600">Chat with {currentPersona.name}</div>
                  </div>
                </div>
              </div>

              <div
                ref={viewportRef}
                className="h-[56vh] md:h-[60vh] overflow-y-auto space-y-3 bg-white/60 border border-white rounded-2xl p-3 md:p-4"
              >
                <AnimatePresence initial={false}>
                  {currentMessages.length === 0 && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-gray-600 text-center py-10"
                    >
                      Start the conversation by typing a message below.
                    </motion.div>
                  )}

                  {currentMessages.map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChatMessage role={m.role} content={m.content} />
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex justify-start"
                    >
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 shadow-soft bg-white border border-gray-200 text-gray-500 text-sm">
                        <span className="inline-flex items-center gap-2">
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
                          {currentPersona.name} is thinking…
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4">
                <ChatInput onSend={onSend} disabled={loading} />
              </div>
            </div>
          </div>
        </section>
      </main>
                  
      <footer className="mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-gray-500">
        Built with ❤️.
      </footer>
    </div>
  )
}
