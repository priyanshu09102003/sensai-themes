import { FormControl, FormField, FormItem, FormLabel , Form, FormDescription, FormMessage} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({resumeData , setResumeData} : EditorFormProps){
    const form = useForm<SkillsValues>({
        resolver: zodResolver(skillsSchema),
        defaultValues:{
            skills: resumeData.skills || []
        }
    })


            useEffect(() => {
                const {unsubscribe} = form.watch(async(values) => {
                    const isValid = await form.trigger();
                    if(!isValid) return;
        
        
                    //update the resume data if the form inputs are valid
                    setResumeData({...resumeData , 
                        skills: values.skills
                        ?.filter(skill => skill !== undefined)
                        .map(skill => skill.trim())
                        .filter(skill => skill !== "") || [],
                    });   
                })
        
                //Makes sure that multiple form watchers are not created on using UseEffect()
                return unsubscribe; 
        
            }, [form , resumeData , setResumeData ]);


            return(

                <div className="max-w-xl mx-auto space-y-6">

                    <div className="space-y-1.5 text-center">

                        <h2 className="text-2xl font-semibold">Skills</h2>
                        <p className="text-sm text-muted-foreground"><b>What are you good at?</b>
                        <br />
                        Add your key skills and let your resume shine.
                        </p>
                    </div>

                    <Form {...form}>
                        
                        <form className="space-y-3">
                            <FormField
                                control={form.control}
                                name = "skills"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Add Skills</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="(e.g. Sales, Leadership, Graphic Designing,  Javascript ...)"

                                                onChange={(e) => {
                                                    const skills = e.target.value.split(",")
                                                    field.onChange(skills);
                                                }}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            Seperate each skill with a comma.
                                        </FormDescription>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>

                    </Form>

                </div>
            )


    
}