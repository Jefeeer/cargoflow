'use client';

import { MotionConfig } from 'motion/react';

/**
 * Honours prefers-reduced-motion for every Motion animation on the site: transforms jump
 * straight to their end state, opacity still fades. Components render identical markup on
 * server and client, so there is no hydration mismatch.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
