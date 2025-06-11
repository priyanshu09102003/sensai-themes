import { cache } from "react";
import prisma from "./prisma";
import { env } from "@/env";


export type SubscriptionLevel = "free" | "pro" | "pro_plus" ;

//Avoids unnecessary request to the database and can have multiple places to call a single action using CACHE

export const getUserSubscriptionLevel = cache(

    async (userId : string) : Promise<SubscriptionLevel> => {

        const subscription = await prisma.userSubscription.findUnique({
            where:{
                userId
            }
        })

        //Fetching the subscription from the database

        if(!subscription || subscription.stripeCurrentPeriodEnd < new Date()){
            return "free"
        }

        if(subscription.stripePriceId===env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY){
            return "pro"
        }

        if(subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY){
            return "pro_plus"
        }

        throw new Error("Invalid Subscription");
    }

)