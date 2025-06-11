import { generalInfoSchema, generateInfoValues } from "@/lib/validation"
import { useForm } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditorFormProps } from "@/lib/types"
import { useEffect } from "react"

export default function GeneralInfoForm({resumeData , setResumeData} : EditorFormProps) {
    const form  = useForm<generateInfoValues> //connecting the form to the react hook form schema that is created
    ({
        resolver: zodResolver(generalInfoSchema),
        defaultValues:{
            title: resumeData.title || "",
            description : resumeData.description || ""
        }
    });

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
    
    return(

        <div className="max-w-xl mx-auto space-y-6">

            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">General Information</h2>
                <p className="text-sm text-muted-foreground">Let us know more about you! This will not appear on your resume.</p>
            </div>

            <Form {...form}>
                <form className="space-y-3">
                    <FormField 
                        control={form.control}
                        name = "title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Project name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Name your resume" 
                                    autoFocus />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name = "description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Add a short description" />
                                </FormControl>
                                <FormDescription>
                                    Describe what this resume is for.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />


                </form>
            </Form>

        </div>
    )
}