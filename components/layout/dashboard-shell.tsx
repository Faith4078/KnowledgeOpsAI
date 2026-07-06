import Link from 'next/link';
import type { ReactNode } from 'react';

type NavKey = 'dashboard' | 'help-center';

interface DashboardShellProps {
  children: ReactNode;
  /** Which primary nav item the current page corresponds to. */
  active?: NavKey;
}

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/' },
  { key: 'help-center', label: 'Help Center', href: '/help-center' },
];

/** Enterprise dashboard chrome: top navigation bar plus a wide, calm content area. */
export function DashboardShell({
  children,
  active = 'dashboard',
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <p className="font-serif text-xl tracking-tight">KnowledgeOps AI</p>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active === item.key ? 'page' : undefined}
                    className={
                      active === item.key
                        ? 'text-foreground'
                        : 'text-muted-foreground transition-colors hover:text-foreground'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
        {children}
      </main>
    </div>
  );
}
