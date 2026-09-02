import { useEffect, useState } from 'react'

function formatNow(timeZone: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function useLocalTime(timeZone = 'America/Sao_Paulo', locale = 'pt-BR') {
  const [time, setTime] = useState(() => formatNow(timeZone, locale))

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow(timeZone, locale)), 1000)
    return () => clearInterval(id)
  }, [timeZone, locale])

  return time
}
