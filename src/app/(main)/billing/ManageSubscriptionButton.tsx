"use client";

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreateCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton(){
    const {toast} = useToast();

    const [loading , setLoading] = useState(false);

    async function handleClick() {

        try {
            setLoading(true)
            const redirectUrl = await CreateCustomerPortalSession();

            window.location.href = redirectUrl;
            
        } catch (error) {

            console.error(error);
            toast({
                variant : "destructive",
                description : "Oops! Something went wrong. Please try again."


            });
            
        }

        finally{
            setLoading(false)
        }
        
    }

    return(
        <LoadingButton onClick={handleClick} loading = {loading}>
            Manage Subscriptions
        </LoadingButton>
    )
}