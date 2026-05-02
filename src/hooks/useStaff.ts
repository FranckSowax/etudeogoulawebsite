import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from './useSession'

export type StaffProfile = {
  id: string
  display_name: string
  role: 'notaire' | 'secretariat'
}

type UseStaffResult = {
  session: ReturnType<typeof useSession>
  staff: StaffProfile | null | undefined
  loading: boolean
}

/** Returns the authenticated staff profile (if any).
 *  staff=undefined while loading, null if not staff, StaffProfile if authenticated. */
export function useStaff(): UseStaffResult {
  const session = useSession()
  const [staff, setStaff] = useState<StaffProfile | null | undefined>(undefined)

  useEffect(() => {
    if (session === undefined) return
    if (!session) {
      setStaff(null)
      return
    }
    supabase
      .from('staff_profiles')
      .select('id, display_name, role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setStaff((data as StaffProfile | null) ?? null))
  }, [session])

  return {
    session,
    staff,
    loading: session === undefined || (session !== null && staff === undefined),
  }
}
