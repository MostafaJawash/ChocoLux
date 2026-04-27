import { motion } from 'framer-motion'

const Hero = () => (
  <section className="relative isolate flex min-h-[72svh] items-center overflow-hidden px-5 py-20 sm:px-8 lg:px-12">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(214,174,97,0.18),transparent_28%),radial-gradient(circle_at_75%_35%,rgba(90,43,26,0.5),transparent_34%),linear-gradient(135deg,#080403_0%,#1a0c08_42%,#351b12_100%)]" />
    <motion.div
      aria-hidden="true"
      animate={{ x: [0, 28, 0], y: [0, -18, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute right-[-140px] top-14 h-[360px] w-[360px] rounded-full border border-[#d6ae61]/20 bg-[#d6ae61]/8 blur-2xl"
    />
    <motion.div
      aria-hidden="true"
      animate={{ x: [0, -24, 0], y: [0, 22, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-[#5a2b1a]/45 blur-3xl"
    />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090403] to-transparent" />

    <div className="relative mx-auto w-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-3xl"
      >
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#d6ae61]">
          Artisan chocolate atelier
        </p>
        <h1 className="font-serif text-6xl font-semibold leading-[0.95] text-[#fff4df] sm:text-7xl lg:text-8xl">
          شوكولا | ChocoLux
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#e6d6bf]/82 sm:text-xl">
          Premium handmade chocolate experience
        </p>
      </motion.div>
    </div>
  </section>
)

export default Hero
