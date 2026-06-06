import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Donation Failed | Sansar Kalyan Trust",
  description: "Your donation could not be processed.",
};

export default function DonationFailurePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20">
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Donation Could Not Be Processed
              </h1>
              <p className="text-lg text-muted-foreground">
                We're sorry, but your donation could not be completed at this time.
              </p>
            </div>

            <div className="py-6 space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>What happened?</strong> The payment could not be processed due to a technical issue or payment method problem.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>No charges:</strong> Your account has not been charged. You can try again or contact us for assistance.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/donate"
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex-1 py-3 px-6 border font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
