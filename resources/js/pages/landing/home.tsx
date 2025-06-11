import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageCircle, Stethoscope, Search, Clock } from 'lucide-react';
import LandingLayout from '@/layouts/landing/landing-layout';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Home() {
  return (
    <LandingLayout
      title="Medical AI Chatbot | Your AI-Powered Health Assistant"
      description="Get instant answers to your medical questions, find nearby healthcare facilities, and access personalized health guidance anytime, anywhere."
      showHeader={false}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="absolute inset-0 -z-10 opacity-10">
          <AppLogoIcon />
        </div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            <span className="text-primary">AI-Powered</span> Medical Assistant <br /> At Your Fingertips
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Get instant answers to your medical questions, find nearby healthcare facilities, and access personalized health guidance anytime, anywhere.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={route('register')}>
              <Button size="lg" className="gap-2">
                Get Started <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>

          {/* Featured Medical Image */}
          <div className="mt-12 w-full max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={`assets/img/image1.png`}
                alt="Advanced medical technology visualization"
                className="w-full aspect-[21/9] object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Healthcare Intelligence, Simplified
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Our AI-powered platform delivers personalized medical insights when you need them most.
                Connecting cutting-edge technology with trusted healthcare expertise for better health outcomes.
              </p>
              <div className="mt-6 flex justify-center">
                <Link href={route('register')}>
                  <Button size="lg" className="font-medium">
                    Discover How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">How to Use Medical AI Chatbot</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Simple steps to get medical assistance anytime, anywhere
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-card/80">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ask Any Question</h3>
              <p className="text-center text-muted-foreground">
                Type your medical questions or concerns in a natural conversation format.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-card/80">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Instant Insights</h3>
              <p className="text-center text-muted-foreground">
                Receive AI-powered responses based on trusted medical knowledge and resources.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md dark:bg-card/80">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect With Doctors</h3>
              <p className="text-center text-muted-foreground">
                Find nearby healthcare providers and hospitals when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-primary/5 shadow-lg">
            <div className="grid items-center md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  Available 24/7 For Your Health Needs
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Our AI assistant is always ready to help you with medical information, symptom assessment,
                  and finding healthcare services near you.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href={route('register')}>
                    <Button className="w-full sm:w-auto">Start Now</Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-60 md:h-full">
                <img
                  src={`assets/img/image2.png`}
                  alt="Medical technology"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/50 bg-background p-6 shadow-sm">
              <Clock className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">24/7 Availability</h3>
              <p className="text-muted-foreground">Access medical assistance anytime, day or night.</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background p-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-8 w-8 text-primary">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
              <h3 className="mb-2 text-xl font-semibold">Accurate Information</h3>
              <p className="text-muted-foreground">Reliable medical knowledge based on trusted sources.</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background p-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-8 w-8 text-primary">
                <path d="M5 7V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" />
                <path d="M9 17v4" />
                <path d="M9 21h6" />
                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
              </svg>
              <h3 className="mb-2 text-xl font-semibold">Privacy-Focused</h3>
              <p className="text-muted-foreground">Your health data is private and secure with us.</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background p-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-8 w-8 text-primary">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <h3 className="mb-2 text-xl font-semibold">Simple to Use</h3>
              <p className="text-muted-foreground">User-friendly interface designed for everyone.</p>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
