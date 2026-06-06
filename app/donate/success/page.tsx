import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Donation Successful | Sansar Kalyan Trust",
  description: "Thank you for your generous donation.",
};

export default function DonationSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Thank You for Your Donation!
              </h1>
              <p className="text-lg text-muted-foreground">
                Your generous contribution will help us create a positive impact in communities.
              </p>
            </div>

            <div className="py-6 space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Confirmation:</strong> You will receive a confirmation email shortly with your donation receipt.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tax Benefit:</strong> Your donation is eligible for tax deduction under Section 80G.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/campaigns"
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                View Our Campaigns
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 px-6 border font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
