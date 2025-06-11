import { title } from "process";
import {optional, z} from "zod";



export const optionalField = z.string().trim().optional().or(z.literal(""));

//Creating form schema for the General Info
export const generalInfoSchema = z.object({
    title: optionalField,
    description : optionalField,  
});

export type generateInfoValues = z.infer<typeof generalInfoSchema>;



//Creating form schema for the records of Personal INFO

export const personalInfoSchema = z.object({
    photo : z.custom<File | undefined>()

    //When we declare the zod custom property, we define our own rules using the refine property

    .refine(
        (file) => !file || (file instanceof File && file.type.startsWith("image/")),
        "Must be an image file"
    )
    //setting appropriate constraints so that the image is not big enough

    .refine(file => !file || file.size <= 1024 * 1024 * 4 , "File must be less than 4MB"), //Not more than 4 MB as NEXTJS supports only 4MB file upload at a time

    firstName: optionalField,
    lastName : optionalField,
    jobTitle : optionalField,
    city : optionalField,
    country: optionalField,
    phone: optionalField,
    email: optionalField
});
export type personalInfoValues = z.infer<typeof personalInfoSchema>;




//Creating form schema for the records of Work Experience
export const workExperienceSchema = z.object({
    workExperiences : z.array(
        z.object({
            position: optionalField,
            company: optionalField,
            startDate: optionalField,
            endDate : optionalField,
            description : optionalField,
        })
    ).optional()
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperiences"]>[number];


//Creating form schema for the records of Skills
export const skillsSchema = z.object({
    skills: z.array(z.string().trim()).optional()
})

export type SkillsValues = z.infer<typeof skillsSchema>;

//Creating form schema for the records of Summary

export const summarySchema = z.object({
    summary : optionalField
})

export type SummaryValues = z.infer<typeof summarySchema>;


//Creating form schema for the records of Education

export const educationSchema = z.object({
    educations : z.array(
        z.object({
            degree: optionalField,
            school: optionalField,
            startDate : optionalField,
            endDate: optionalField
        })
    ).optional(),
})

export type EducationValues = z.infer<typeof educationSchema>


//combining all the schema of the react hook form into a large schema
export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape ,
    ...summarySchema.shape ,
    colorHex : optionalField,
    borderStyle : optionalField
})

export type Resumevalues = Omit<z.infer<typeof resumeSchema> , "photo"> & {
    id?: string ;
    photo ? : File | string | null ;

};

export const generateWorkExperienceSchema = z.object({
    description : z.string().trim().min(1 , "Required").min(20 , "Must be atleast 20 characters"),

});

export type generateWorkExperienceInput = z.infer<typeof generateWorkExperienceSchema>;


//to generate the AI based content, we need to provide some data to the LLM model. SO we create a validation schema to provide on that data to the LLM that it can use to generate relavant content

export const generateSummarySchema = z.object({
    jobTitle : optionalField,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;
