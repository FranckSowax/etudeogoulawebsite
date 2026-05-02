import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, List, Ban, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useStaff } from '@/hooks/useStaff'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/admin', label: 'Agenda', icon: CalendarDays, exact: true },
  { to: '/admin/liste', label: 'Liste', icon: List, exact: false },
  { to: '/admin/indispos', label: 'Indispos', icon: Ban, exact: false },
]

export default function AdminLayout() {
  const { staff, loading } = useStaff()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !staff) {
      navigate('/admin/login', { replace: true })
    }
  }, [loading, staff, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!staff) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-navy shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-5">
            <Link to="/" className="font-serif text-white font-semibold text-sm whitespace-nowrap">
              Cabinet Ogoula
            </Link>
            <nav className="flex items-center gap-0.5">
              {navLinks.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === to : location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/60 hidden sm:inline">{staff.display_name}</span>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}
