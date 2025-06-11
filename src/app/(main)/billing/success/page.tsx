import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight, CreditCard, Shield } from "lucide-react";

export default function Page() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
            {/* Success Icon with Animation */}
            <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 mb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Payment Successful!
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Welcome to premium! Your selected plan is now active and all premium features have been unlocked.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Premium Features</h3>
                    <p className="text-sm text-muted-foreground">Access to all advanced AI tools and templates</p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Secure & Protected</h3>
                    <p className="text-sm text-muted-foreground">Your data is encrypted and fully secure</p>
                </div>
                
                <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Billing Active</h3>
                    <p className="text-sm text-muted-foreground">Your subscription is now active and ready</p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Link href="/resumes" className="inline-flex items-center gap-2">
                        Continue to Resume Vault
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
                
                <p className="text-sm text-muted-foreground">
                    Ready to create amazing resumes with SensAI? Let's get started!
                </p>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Instant activation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>Premium support</span>
                    </div>
                </div>
            </div>
        </main>
    );
}