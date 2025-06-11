"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { useState } from "react";
import { Resumevalues } from "@/lib/validation";
import ResumeSection from "./ResumeSection";
import { cn, mapToResumevalues } from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import autosaveResume from "./AutosaveResume";
import { ResumeServerData } from "@/lib/types";


interface ResumeEditorProps{
    resumeToEdit: ResumeServerData | null;
}


export default function ResumeEditor({resumeToEdit} : ResumeEditorProps){

    const searchParams = useSearchParams();

    //Storing the stored data by the user so that it doesnt disappear on refresh

    const [resumeData , setResumeData] = useState<Resumevalues>(
        resumeToEdit ? mapToResumevalues(resumeToEdit) : {},
    );

    const [showSmResumePreview , setShowSmResumePreview] = useState(false);

    const {isSaving , hasUnsavedChanges} = autosaveResume(resumeData)

    useUnloadWarning(hasUnsavedChanges)

    const currentStep  = searchParams.get("step") || steps[0].key;

    function setStep(key:string){
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("step" , key)

        //using pushState so that the form transitions are very fast instead of useRouter as it has to send request and the transitions will take time

        window.history.pushState(null , "" , `?${newSearchParams.toString()}`)
    }


    const FormComponent = steps.find(
        step => step.key === currentStep
    )?.component;



    return(
        <div className="flex grow flex-col">

            <header className="space-y-1.5 border-b px-3 py-5 text-center">
                    <h1 className="text-2xl font-bold">Design your resume</h1>
                    <p className="text-sm text-muted-foreground">Build your personalized, customizable, AI-powered resume in a few simple steps. Your progress will be saved automatically.
                    </p>
            </header>

            <main className="relative grow">

                <div className="absolute bottom-0 top-0 flex w-full">

                    <div className={cn("w-full md:w-1/2 p-3 overflow-y-auto space-y-7 md:block" , 
                        showSmResumePreview && "hidden"
                    )}>
                    <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
                    {FormComponent && 
                        <FormComponent
                        resumeData = {resumeData}
                        setResumeData={setResumeData}

                        />
                    }
                    </div>

                    <div className="grow md:border-r" />


                    <ResumeSection
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    className={cn(showSmResumePreview && "flex")}
                    />

                </div>

            </main>


           <Footer currentStep={currentStep} setCurrentStep={setStep} 
           showSmResumePreview = {showSmResumePreview}
           setShowSmResumePreview={setShowSmResumePreview}
           isSaving = {isSaving}
           />

        </div>
    )
}