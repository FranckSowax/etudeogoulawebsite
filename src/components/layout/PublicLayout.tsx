import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar transparent={isHome} />
      <main className={isHome ? 'flex-1' : 'flex-1 pt-20'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
