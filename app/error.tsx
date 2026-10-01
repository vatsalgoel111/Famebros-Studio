'use client';

import React, { useEffect } from 'react';
import Container from '@/components/Container';
import Button from '@/components/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70dvh] flex items-center justify-center bg-paper text-ink px-4 py-16">
      <Container className="max-w-2xl">
        <div className="flex flex-col items-center text-center gap-6 border border-line bg-paper-dark/30 p-8 sm:p-12">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            500 / Studio Error
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-ink">
            Something went wrong.
          </h1>
          <p className="font-body text-sm text-ink-soft max-w-md">
            An unexpected error occurred while loading this section.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => reset()}>
              Try again
            </Button>
            <Button variant="primary" href="/" arrow="right">
              Return Home
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
