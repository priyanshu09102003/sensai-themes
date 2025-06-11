import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateWorkExperienceInput, generateWorkExperienceSchema, WorkExperience } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import { Dialog, DialogHeader , DialogContent , DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { canUseAITools } from "@/lib/permissions";

interface GenerateWorkExperienceButtonProps{
    onWorkExperienceGenerated: (workExperience: WorkExperience)=> void;
}

export default function GenerateWorkExperienceButton({onWorkExperienceGenerated} : GenerateWorkExperienceButtonProps){

    const subscripptionLevel = useSubscriptionLevel();
    const premiumModal = usePremiumModal();

    const [showInputDialog , setShowInputDialog] = useState(false);

    return(

        <>
            <Button
            variant="outline"
            type="button"

            //Block for NON PREMIUM USERS
            
            onClick={() => {
                
                if(!canUseAITools(subscripptionLevel)){
                    premiumModal.setOpen(true);
                    return
                }
                
                setShowInputDialog(true)}}
            >

                <WandSparklesIcon className="size-4" />
                Smart fill with AI

            </Button>

            <InputDialog 
            open = {showInputDialog}
            onOpenChange={setShowInputDialog}
            onWorkExperienceGenerated={(workExperience)=> {
                onWorkExperienceGenerated(workExperience);
                setShowInputDialog(false);
            }}
            />

        
        </>
    )
}

interface InputDialogProps{
    open: boolean,
    onOpenChange: (open: boolean) => void;
    onWorkExperienceGenerated: (workExperience : WorkExperience) => void;
}

function InputDialog({open , onOpenChange, onWorkExperienceGenerated} : InputDialogProps) {

    const {toast} = useToast();

    const form = useForm<generateWorkExperienceInput>({
        resolver: zodResolver(generateWorkExperienceSchema),
        defaultValues:{
            description: ""
        }
    })

    async function onSubmit(input: generateWorkExperienceInput) {

        try {

            const response = await generateWorkExperience(input)
            onWorkExperienceGenerated(response);
            
        } catch (error) {

            console.error(error);

            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again"
            });
            
        }
        
    }

    return(

        <Dialog
        open = {open}
        onOpenChange={onOpenChange}
        >

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Work Experience</DialogTitle>

                    <DialogDescription>Share your experience — our AI will craft a polished version for your resume.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                    >

                        <FormField 
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>

                                <FormControl>
                                    <Textarea 
                                    {...field}
                                    placeholder={`E.g "from nov 2019 to dec 2020 I worked at google as a Software Engineer, where my tasks were ...`}
                                    autoFocus
                                    />

                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <LoadingButton type="submit" loading = {form.formState.isSubmitting}>
                            Generate
                        </LoadingButton>

                    </form>
                     
                </Form>
            </DialogContent>

        </Dialog>

    )
}