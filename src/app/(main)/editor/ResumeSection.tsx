import ResumePreview from "@/components/ResumePreview";
import { Resumevalues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyle";
import { cn } from "@/lib/utils";

interface ResumeSectionProps{
    resumeData : Resumevalues;
    setResumeData : (data : Resumevalues) => void;
    className ? : string
}

export default function ResumeSection({
    resumeData,
    setResumeData,
    className
} : ResumeSectionProps) {


    return(

        <div className={cn("group relative hidden md:flex w-full", className)}>

            <div className=" opacity-50 xl:opacity-100 group-hover:opacity-100 absolute left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3 transition-opacity">
                <ColorPicker 
                color={resumeData.colorHex}
                onChange={(color) => 
                    setResumeData({...resumeData , colorHex: color.hex})}
                />


                    <BorderStyleButton 
                    borderStyle={resumeData.borderStyle}
                    onChange={(borderStyle) => 
                        setResumeData({...resumeData , borderStyle})
                    }
                    />

            </div>

            <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">

                <ResumePreview resumeData={resumeData} 
                className="max-w-2xl shadow-md"
                />

            </div>

        </div>
    )
}