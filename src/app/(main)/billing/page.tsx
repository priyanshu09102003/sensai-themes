import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import Stripe from "stripe";
import GetSubscriptionButton from "./GetSubscriptionButton";
import {formatDate} from "date-fns"
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import subscriptionImage from "@/assets/subscription.png"
import Image from "next/image";

export const metadata: Metadata = {
    title: "Billing"
}

export default async function Page(){

    const {userId} = await auth();

    if(!userId){
        return null;
    }

    const subscription = await prisma.userSubscription.findUnique({
        where : {
            userId
        }
    })

    const priceInfo = subscription ? 
    await stripe.prices.retrieve(subscription.stripePriceId , 
        {
            expand: ["product"]
        }
    )
    : null

    return(
        <main className="max-w-7xl mx-auto w-full space-y-6 px-3 py-6">

            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Subscriptions
            </h1>

            <p>
                Your current plan: {" "}
                <span className="font-bold">
                    {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free Plan"}
                </span>
            </p>

            {subscription ? (
                <>
                    {subscription.stripeCancelAtPeriodEnd && (
                        <p className="text-destructive">
                            Your subscription will cancelled on{" "}
                            {formatDate(subscription.stripeCurrentPeriodEnd  ,"MMMM dd, yyyy")}
                        </p>
                    )}

                    <ManageSubscriptionButton />
                </>
            ):(
                <GetSubscriptionButton />
            )}

             <div className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Content Section */}
                    <div className="order-2 lg:order-1 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Welcome to Your Subscription Portal
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                Manage all your subscriptions, billing information, and account preferences in one convenient location.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                What you can do here:
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        View current subscription status
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Update billing information
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Upgrade or downgrade plans
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        View invoices
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="inline-flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Secure & Encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="relative">
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-3xl blur-3xl transform rotate-3"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-3xl blur-3xl transform -rotate-3"></div>
                            
                            {/* Image container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                                <Image
                                    src={subscriptionImage}
                                    alt="AI and Human Managing Subscriptions"
                                    width={400}
                                    height={400}
                                    className="w-full h-auto max-w-md mx-auto rounded-2xl"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Features Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Flexible Billing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Choose between <b>Premium</b> or <b>Premium Plus</b> subscriptions with easy plan changes.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure Payments</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Your payment information is protected with industry-standard encryption.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M12 12h.01M12 12h.01" />
                        </svg>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">24/7 Support</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Get help anytime with our dedicated customer support team.</p>
                </div>
            </div>
            
        </main>
    )
}