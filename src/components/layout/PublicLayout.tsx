import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar transparent={isHome} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={isHome ? 'flex-1' : 'flex-1 pt-20'}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
