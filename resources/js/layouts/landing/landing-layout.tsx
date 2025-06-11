import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ReactNode, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

interface LandingLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showCTA?: boolean;
}

export default function LandingLayout({
  children,
  title = 'Medical AI Chatbot',
  description = 'Get instant answers to your medical questions, find nearby healthcare facilities, and access personalized health guidance',
  showHeader = true,
  showCTA = true,
}: LandingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <AppLogoIcon className="h-8 w-8" />
              <span className="text-lg lg:text-xl font-semibold text-foreground">Medical AI Chatbot</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeSwitcher />
              <Link href={route('login')}>
                <Button variant="outline">Login</Button>
              </Link>
              {showCTA && (
                <Link href={route('register')}>
                  <Button>Sign Up</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} border-t border-border/30`}>
            <div className="space-y-1 px-4 py-4 flex flex-col items-center">
              <div className="py-3">
                <ThemeSwitcher />
              </div>
              <Link
                href={route('login')}
                className="w-full px-4 py-2 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              {showCTA && (
                <Link
                  href={route('register')}
                  className="w-full px-4 py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Header */}
        {showHeader && (
          <header className="bg-primary/5 py-8 md:py-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
                {description && (
                  <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/40 bg-background py-8">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <AppLogoIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Medical AI Chatbot</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Medical AI Chatbot. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
