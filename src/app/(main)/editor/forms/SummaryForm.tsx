import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummary from "./GenerateSummaryButton";

export default function SummaryForm({resumeData , setResumeData} : EditorFormProps) {

    const form = useForm<SummaryValues>({
        resolver : zodResolver(summarySchema),
        defaultValues: {
            summary: resumeData.summary || ""
        }
    })

       useEffect(() => {
            const {unsubscribe} = form.watch(async(values) => {
                const isValid = await form.trigger();
                if(!isValid) return;
    
    
                //update the resume data if the form inputs are valid
                setResumeData({...resumeData , ...values})
                
    
            })
    
            //Makes sure that multiple form watchers are not created on using UseEffect()
    
            return unsubscribe; 
    
        }, [form , resumeData , setResumeData ]);

        return (
            <div className="max-w-xl mx-auto space-y-6">

                <div className="space-y-1.5 text-center">

                    <h2 className="font-semibold text-2xl">Professional Summary</h2>

                    <p className="text-sm text-muted-foreground">
                        Add a brief professional summary, or use AI to generate it from your resume data.
                    </p>

                </div>
                <Form {...form}>

                    <form className="space-y-3">
                        <FormField
                        control={form.control}
                        name="summary"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Add Summary</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        {...field}
                                        placeholder="A brief engaging text about yourself"
                                    />
                                </FormControl>

                                <FormMessage />
                                <GenerateSummary 
                                resumeData={resumeData}
                                onSummaryGenerated={summary => form.setValue("summary" , summary)}
                                />
                            </FormItem>
                        )}
                        />
                    </form>

                </Form>
            </div>
        )

}