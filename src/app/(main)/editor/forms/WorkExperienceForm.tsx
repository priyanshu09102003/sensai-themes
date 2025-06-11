import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GripHorizontal, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {CSS} from "@dnd-kit/utilities"
import { cn } from "@/lib/utils";
import GenerateWorkExperienceButton from "./GenerateWorkExperience";


export default function WorkExperienceForm({
    resumeData , 
    setResumeData}: EditorFormProps) {

    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues:{
            workExperiences : resumeData.workExperiences || []
        }
    })

    
        useEffect(() => {
            const {unsubscribe} = form.watch(async(values) => {
                const isValid = await form.trigger();
                if(!isValid) return;
    
    
                //update the resume data if the form inputs are valid
                setResumeData({...resumeData , 
                    workExperiences: values.workExperiences?.filter((exp) => 
                    exp !== undefined) || [],
                });
                
    
            })
    
            //Makes sure that multiple form watchers are not created on using UseEffect()
            return unsubscribe; 
    
        }, [form , resumeData , setResumeData ]);

        const {fields , append , remove , move} = useFieldArray({
            control: form.control,
            name: "workExperiences"
        });

        const sensors = useSensors(
            useSensor(PointerSensor), //responses to the pointer events of the mouse pointer

            
            useSensor(KeyboardSensor , {
                coordinateGetter: sortableKeyboardCoordinates
            })
        );

        function handleDragEnd(event: DragEndEvent){
            const {active , over} = event

            if(over && active.id !== over.id){
                const oldIndex = fields.findIndex(field => field.id === active.id )

                const newIndex = fields.findIndex(field => field.id === over.id)

                move(oldIndex , newIndex)


                //Function from the dnd kit that tells the react hook form about the reordering

                //Reorders the fields oldIndex with the newIndex
                return arrayMove(fields , oldIndex , newIndex)
            }
        }

        return(

            <div className="max-w-xl mx-auto space-y-6">
                <div className="space-y-1.5 text-center">
                    <h2 className="text-2xl font-semibold">Work Experience</h2>
                    <p className="text-sm text-muted-foreground">List your past work experiences/internships. You can add multiple experiences.</p>

                </div>

                <Form {...form}>

                    <form className="space-y-3">
                        <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                        >
                        
                        <SortableContext
                        items={fields}
                        strategy={verticalListSortingStrategy}
                        >
                            {fields.map((field , index)=> (
                                <WorkExperienceItem key={field.id} 
                                id={field.id}
                                index={index}
                                form = {form}
                                remove={remove}
                                />

                            ))}
                        </SortableContext>
                        </DndContext>

                        <div className="flex justify-center">
                            <Button
                            type="button"
                            onClick={() => append({
                                position: "",
                                company: "",
                                startDate: "",
                                endDate: "",
                                description: ""
                            })}>
                                Add Work Experience <PlusCircle />
                            </Button>
                        </div>

                    </form>

                </Form>
                
            </div>

        )
}

interface WorkExperienceItemProps{
    id: string;
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index : number) => void;
}

function WorkExperienceItem({id, form , index , remove} : WorkExperienceItemProps){

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } =useSortable({id})

    return(
        <div className={cn("space-y-3 border rounded-md bg-background p-3",

            isDragging && "shadow-xl z-50 cursor-grab relative"
        )}

        //using the destructured values to tell DnD that the entire div with the info needs to be moved and draggable

        ref = {setNodeRef}

        //Providing the drag and drop styling and animation

        style={{

            transform: CSS.Transform.toString(transform), //This takes care of the styling


            transition //This takes care of the animation of drag and drop
        }}

        >
            
            <div className="flex justify-between gap-2">
                <span className="font-semibold">Work Experience {index+1}</span>
                <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" 
                
                //Making this icon the draggable handle and reordering handle using the destructured values in the useSortable

                {...attributes}
                {...listeners}
                
                />
            </div>

            <div className="flex justify-center">
                <GenerateWorkExperienceButton 
                onWorkExperienceGenerated={exp => form.setValue(
                    `workExperiences.${index}`, exp)}
                />
            </div>

            <FormField 
            control={form.control}
            name={`workExperiences.${index}.position`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <Input {...field} autoFocus />
                    </FormControl>
                </FormItem>
            )}
            />

            <FormField 
            control={form.control}
            name={`workExperiences.${index}.company`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Company / Organization</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-3">
                 <FormField 
            control={form.control}
            name={`workExperiences.${index}.startDate`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Input {...field} type="date" value={field.value?.slice(0 , 10)} />
                    </FormControl>
                </FormItem>
            )}
            />

             <FormField 
            control={form.control}
            name={`workExperiences.${index}.endDate`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input {...field} type="date" value={field.value?.slice(0 , 10)} />
                    </FormControl>
                </FormItem>
            )}
            />
            </div>

            <FormDescription>
                Still working here? You can skip the <span className="font-semibold">end date</span>.
            </FormDescription>


             <FormField 
            control={form.control}
            name={`workExperiences.${index}.description`}
            render={({field}) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea {...field} />
                    </FormControl>
                </FormItem>
            )}
            />


            <Button variant="destructive" type="button" 
            onClick={() => remove(index)}
            >
                Remove
            </Button>

        </div>
    )
}