import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Heart, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Submitted",
  description: "Thank you for volunteering at EWC Calgary.",
};

export default function VolunteerSuccessPage() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-ewc-gold-50 via-white to-ewc-cream" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl" />

      <div className="relative section-container">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ewc-charcoal mb-4">
            Thank You!
          </h1>
          <p className="text-ewc-slate text-lg leading-relaxed mb-3">
            Your volunteer application has been submitted successfully.
          </p>
          <p className="text-ewc-silver text-sm mb-10">
            A ministry leader will review your application and get in touch with
            you soon. We&apos;re excited to have you on the team!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-gold px-8 py-3.5">
              <Home size={16} className="mr-2" /> Back to Home
            </Link>
            <Link href="/ministries" className="btn-outline px-8 py-3.5">
              Explore Ministries <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="mt-12 p-6 card-warm rounded-2xl">
            <Heart size={20} className="text-ewc-gold mx-auto mb-2" />
            <p className="text-ewc-slate text-sm italic">
              &ldquo;For we are God&apos;s handiwork, created in Christ Jesus to do
              good works, which God prepared in advance for us to do.&rdquo;
            </p>
            <p className="text-ewc-gold text-xs font-heading mt-2">— Ephesians 2:10</p>
          </div>
        </div>
      </div>
    </section>
  );
}
