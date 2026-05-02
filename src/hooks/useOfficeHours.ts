import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DEFAULT_SCHEDULE, type DaySchedule } from '@/lib/booking'

type RawRow = {
  day_of_week: number
  is_open: boolean
  open_time: string   // "HH:MM:SS" from Postgres time
  close_time: string
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function useOfficeHours(): { schedule: DaySchedule[]; loading: boolean } {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('office_hours')
      .select('day_of_week, is_open, open_time, close_time')
      .order('day_of_week')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSchedule(
            (data as RawRow[]).map((r) => ({
              dayOfWeek: r.day_of_week,
              isOpen: r.is_open,
              openMinutes: parseTime(r.open_time),
              closeMinutes: parseTime(r.close_time),
            })),
          )
        }
        setLoading(false)
      })
  }, [])

  return { schedule, loading }
}
