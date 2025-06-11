import { EditorFormProps } from "@/lib/types";
import { educationSchema, EducationValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm , useFieldArray , UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { GripHorizontal , PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {CSS} from "@dnd-kit/utilities"
import { cn } from "@/lib/utils";



export default function Education({resumeData , setResumeData} : EditorFormProps) {

    const form  = useForm<EducationValues>({
        resolver : zodResolver(educationSchema),
        defaultValues: {
            educations: resumeData.educations || []
        }
    })

            useEffect(() => {
                const {unsubscribe} = form.watch(async(values) => {
                    const isValid = await form.trigger();
                    if(!isValid) return;
        
        
                    //update the resume data if the form inputs are valid
                    setResumeData({...resumeData , 
                        educations: values.educations?.filter((edu) => 
                        edu !== undefined) || [],
                    });
                    
        
                })
        
                //Makes sure that multiple form watchers are not created on using UseEffect()
                return unsubscribe; 
        
            }, [form , resumeData , setResumeData ]);
    
            const {fields , append , remove , move} = useFieldArray({
                control: form.control,
                name: "educations"
            })

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
                    <h2 className="text-2xl font-semibold">Education</h2>
                    <p className="text-sm text-muted-foreground">Add your educational details / qualifications here.</p>

                </div>

                <Form {...form}>

                    <form className="space-y-3">

                    <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}>
                                        
                    <SortableContext
                    items={fields}
                    strategy={verticalListSortingStrategy}>

                        {fields.map((field , index)=> (

                            <EducationItem 
                            id={field.id}
                            key={field.id} 
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
                               degree: "",
                               school: "",
                               startDate: "",
                               endDate: ""
                            })}>
                                Add Education <PlusCircle />
                            </Button>
                        </div>

                    </form>

                </Form>
                
            </div>

    )
}

interface EducationItemProps{
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index : number) => void;
}

function EducationItem({id , form , index , remove} : EducationItemProps) {

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } =useSortable({id})

    return(
        <div className={cn("space-y-3 border rounded-md bg-background p-3" ,
            isDragging && "shadow-xl z-50 cursor-grab relative"
        )}
             ref = {setNodeRef}
            
             style={{
             
                transform: CSS.Transform.toString(transform), //This takes care of the styling
                transition //This takes care of the animation of drag and drop
                }}>

            <div className="flex justify-between gap-2">
                <span className="font-semibold">Education {index+1}</span>
                <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" 

                 {...attributes}
                {...listeners}
                />
                
            </div>

                    <FormField 
                        control={form.control}
                        name={`educations.${index}.degree`}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                    <Input {...field} autoFocus />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />


                        <FormField 
                        control={form.control}
                        name={`educations.${index}.school`}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    <div className="grid grid-cols-2 gap-3">
                             <FormField 
                                        control={form.control}
                                        name={`educations.${index}.startDate`}
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
                                        name={`educations.${index}.endDate`}
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

         <Button variant="destructive" type="button" onClick={() => remove(index)}>
            Remove</Button>

        </div>
    )


}