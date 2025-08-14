import { motion } from 'framer-motion'

export default function PersonaCard({ name, icon, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl shadow-soft border transition
        ${active ? 'bg-white border-brand-300 ring-2 ring-brand-400' : 'glass border-white/50 hover:bg-white'}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
    >
      <span className="text-2xl">{icon}</span>
      <div className="text-left">
        <div className="font-semibold leading-none text-gray-900">{name}</div>
        <div className="text-xs text-gray-600/80">Tap to switch</div>
      </div>
      {active && (
        <motion.span
          layoutId="activeDot"
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-500"
        />
      )}
    </motion.button>
  )}