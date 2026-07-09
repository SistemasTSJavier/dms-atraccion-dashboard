import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { OptimizedImage } from '../components/OptimizedImage'
import { assetUrl } from '../lib/assets'

export function InicioPage() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-light to-brand-accent">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-amber-300 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <OptimizedImage
          src={assetUrl('logo.png')}
          alt="Logo DMS"
          variant="logo"
          className="mx-auto mb-8 h-32 object-contain drop-shadow-2xl"
        />
        <div className="flex items-center justify-center gap-2 text-amber-300">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium tracking-widest uppercase">Dashboard de Productividad</span>
          <Sparkles className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          DMS ATRACCIÓN
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
          Talento · Reclutamiento · Productividad
        </p>
      </motion.div>
    </div>
  )
}
