import { motion } from 'framer-motion'
import { Award, Star } from 'lucide-react'

export function FinalPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-lg"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <Award className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-brand">¡Bravo!</h1>
        <div className="mt-2 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-700">Reconocimiento</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Para un compañero, por una acción, esfuerzo extra o valor agregado al equipo de atracción de talento.
        </p>
      </motion.div>
    </div>
  )
}
