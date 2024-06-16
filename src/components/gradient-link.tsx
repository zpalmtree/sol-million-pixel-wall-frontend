import React from 'react';
import Link from 'next/link';

export const GradientLink = ({ href, content }) => {
  return (
      <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-8 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:from-primary/90 hover:to-secondary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary"
      >
        {content}
    </Link>
  );
};
