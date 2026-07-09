import { motion } from 'framer-motion'
import { DollarSign, Lightbulb, Zap } from 'lucide-react'
import { PageHeader } from '../components/ui'

const ideas = [
  {
    icon: Zap,
    title: 'Optimizar',
    description: 'Una idea para optimizar tiempo en los procesos',
    color: 'from-blue-500 to-brand',
  },
  {
    icon: Lightbulb,
    title: 'Mejorar calidad',
    description: 'Una idea que permita mejorar la calidad en los procesos',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Reducir costo',
    description: 'Una idea para reducir costos operativos',
    color: 'from-emerald-500 to-teal-600',
  },
]

export function KaizenPage() {
  return (
    <div>
      <PageHeader title="Idea Kaizen" subtitle="Mejora continua en procesos de atracción" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ideas.map((idea, i) => (
          <motion.div
            key={idea.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className={`bg-gradient-to-br ${idea.color} p-6`}>
              <idea.icon className="h-10 w-10 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand">{idea.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{idea.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
