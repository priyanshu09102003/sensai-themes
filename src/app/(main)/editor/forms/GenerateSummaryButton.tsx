import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { Resumevalues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryProps {
    resumeData: Resumevalues;
    onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummary({ resumeData, onSummaryGenerated }: GenerateSummaryProps) {

    const subscripptionLevel = useSubscriptionLevel();
    const premiumModal = usePremiumModal();



    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        
        // Block for NON-premium users

        if(!canUseAITools(subscripptionLevel)){
                premiumModal.setOpen(true);
                return
            }

        console.log("🎯 Generate Summary clicked");
        console.log("📋 Resume data:", resumeData);

        try {
            setLoading(true);

            console.log("🚀 Calling generateSummary...");
            const aiResponse = await generateSummary(resumeData);
            
            console.log("✅ AI Response received:", aiResponse);
            
            if (!aiResponse || aiResponse.trim().length === 0) {
                throw new Error("Empty response from AI");
            }

            onSummaryGenerated(aiResponse);
            
            toast({
                description: "Summary generated successfully!",
            });

        } catch (error) {
            console.error("💥 Error in handleClick:", error);

            // More specific error handling
            let errorMessage = "Something went wrong. Please try again.";
            
            if (error instanceof Error) {
                console.error("Error details:", error.message);
                
                // Provide more specific error messages based on error type
                if (error.message.includes("API key")) {
                    errorMessage = "API configuration error. Please contact support.";
                } else if (error.message.includes("network") || error.message.includes("fetch")) {
                    errorMessage = "Network error. Please check your connection and try again.";
                } else if (error.message.includes("validation")) {
                    errorMessage = "Invalid resume data. Please check your information and try again.";
                }
            }

            toast({
                variant: "destructive",
                description: errorMessage,
            });

        } finally {
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            variant="secondary"
            type="button"
            onClick={handleClick}
            loading={loading}
        >
            <WandSparklesIcon className="size-4" />
            Generate from AI
        </LoadingButton>
    );
}