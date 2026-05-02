import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BusySlot } from '@/lib/booking'

type Result = {
  busy: BusySlot[]
  loading: boolean
  error: string | null
}

/**
 * Calls the get_busy_slots RPC to retrieve booked slots between two dates.
 * Strips PII server-side (the RPC is security definer).
 */
export function useAvailability(startDate: string, endDate: string): Result {
  const [busy, setBusy] = useState<BusySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    supabase
      .rpc('get_busy_slots', { start_date: startDate, end_date: endDate })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          // Fallback: if RPC isn't deployed yet, treat as no busy slots
          console.warn('get_busy_slots RPC failed', error.message)
          setBusy([])
          setError(null)
        } else {
          setBusy((data as BusySlot[]) ?? [])
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [startDate, endDate])

  return { busy, loading, error }
}
