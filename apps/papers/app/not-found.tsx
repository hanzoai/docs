import Link from 'next/link';
import { Nav } from '@/components/nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Page not found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The paper you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-sm font-medium px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
        >
          View all papers
        </Link>
      </main>
    </>
  );
}
