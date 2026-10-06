'use client';

import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
});

/** Live local time at the Miami hub. Renders a placeholder on the server to avoid hydration mismatch. */
export function MiamiClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular" aria-label={now ? `Local time in Miami: ${now}` : undefined}>
      LOCAL {now ?? '--:-- ---'}
    </span>
  );
}
