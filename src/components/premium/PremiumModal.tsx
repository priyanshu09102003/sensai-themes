"use client";

import { CheckCircle, SparklesIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCheckoutSession } from "./action";
import { env } from "@/env";





const premiumFeatures = ["AI support" , "Build up to 3 resumes"];
const premiumPlusFeatures = ["AI support" , "Infinite resumes" , "Designing & Customizations"];

export default function PremiumModal(){

    const {open , setOpen} = usePremiumModal();

    const {toast} = useToast();
    
    const [loading , setLoading] = useState(false)

    async function handlePremiumClick(priceId : string) {
        //performing the STRIPE checkout

        try {
            setLoading(true);

            const redirectURL = await createCheckoutSession(priceId)

            window.location.href = redirectURL;
            
        } catch (error) {

            console.error(error);

            toast({
                variant : "destructive" ,
                description: "Oops! Something went wrong. Please try again."
            });            
        }

        finally{
            setLoading(false)
        }
    }
    
    return(
        <Dialog 
        open={open} 
            onOpenChange={(isOpen) => {
                if (!loading) {
                    setOpen(isOpen);
                }
            }}
        >

            <DialogContent className="max-w-2xl">

                <DialogHeader>

                        <DialogTitle>Subscription Plans</DialogTitle>

                </DialogHeader> 

                <div className="space-y-6">

                    <p>
                        Get a subscription of your choice to unlock more features.
                    </p>

                    <div className="flex">


                        {/* PREMIUM FEATURES */}

                        <div className="flex w-1/2 flex-col space-y-5">

                        <h3 className="text-center text-lg font-bold">

                                Premium 
                        </h3>

                       <ul className="list-inside space-y-2">
                            {premiumFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-2">

                                    <CheckCircle className="size-4" />

                                    {feature}

                                    
                                </li>
                            ))}
                       </ul>

                       <Button
                       onClick={() => handlePremiumClick(
                        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
                       )}
                       disabled = {loading}>
                        
                        Get Premium</Button>
                        </div>



                        <div className="border-1 mx-6" />


                        
                        {/* PREMIUM PLUS FEATURE */}
                        <div className="flex w-1/2 flex-col space-y-5">

                         <h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">

                                Premium Plus 
                        </h3>

                        <ul className="list-inside space-y-2">
                            {premiumPlusFeatures.map(feature => (
                                <li key={feature} className="flex items-center gap-2">

                                    <CheckCircle className="size-4" />

                                    {feature}

                                    
                                </li>
                            ))}
                       </ul>

                       <Button variant="premium"
                       onClick={() => handlePremiumClick(
                        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
                       )}
                       disabled = {loading}
                       >Get Premium Plus <SparklesIcon className="size-3" /></Button>

                        </div>

                    </div>

                </div>

            </DialogContent>


        </Dialog>
    )

}