import React from 'react';
import Link from 'next/link';
import Container from '@/components/Container';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <main className="min-h-[70dvh] flex items-center justify-center bg-paper text-ink px-4 py-16">
      <Container className="max-w-2xl">
        <div className="flex flex-col items-center text-center gap-6 border border-line bg-paper-dark/30 p-8 sm:p-12">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            404 / Page Not Found
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink">
            Lost on the grid.
          </h1>
          <p className="font-body text-sm sm:text-base text-ink-soft max-w-md">
            The page or reel you’re looking for doesn’t exist or has moved.
          </p>
          <Button variant="primary" href="/" arrow="right">
            Back to Home
          </Button>
        </div>
      </Container>
    </main>
  );
}
