import { Prisma } from "@prisma/client";
import { Resumevalues } from "./validation";

export interface EditorFormProps {
    resumeData: Resumevalues;
    setResumeData : (data : Resumevalues) => void;
}

export const resumeDataInclude = {
    
            workExperiences: true,
            educations: true
        
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
    include: typeof resumeDataInclude;
}>;