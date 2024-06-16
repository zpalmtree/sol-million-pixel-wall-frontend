import React from 'react';
import Link from 'next/link';

interface TransparentLinkProps {
  href: string;
  content: string;
}

export const TransparentLink: React.FC<TransparentLinkProps> = ({ href, content }) => {
  return (
      <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-[#1A1A1A] px-8 text-sm font-medium shadow-sm transition-colors hover:bg-[#1A1A1A]/90 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:border-primary dark:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A]/90 dark:hover:text-primary dark:focus-visible:ring-primary"
      >
        {content}
    </Link>
  );
};
