"use server";

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, Resumevalues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import {del, put} from "@vercel/blob"
import path from "path";

export async function saveResume (values : Resumevalues) {

    const {id} = values;

    console.log("received values" , values);

    const {
        photo,
        workExperiences,
        educations,
        ...resumeValues
    } = resumeSchema.parse(values)

    const {userId} = await auth();

    if(!userId){
        throw new Error("User not authenticated")
    }

    // Check resume count for non-premium users

    const subscriptionLevel = await getUserSubscriptionLevel(userId)

    if(!id){
        const resumeCount = await prisma.resume.count({where: {userId}})

        if(!canCreateResume(subscriptionLevel , resumeCount)){
            throw new Error(
                "Maximum resume count reached for this plan"
            );
        }
    }



    const existingResume = id
    ? await prisma.resume.findUnique({where: {id , userId}})
    : null

    if(id && !existingResume){
        throw new Error("Resume not found")
    }

    const hasCustomizations = (resumeValues.borderStyle && 
        resumeValues.borderStyle !== existingResume?.borderStyle) ||
         (resumeValues.colorHex &&
        resumeValues.colorHex !== existingResume?.colorHex
    )

    if(hasCustomizations && !canUseCustomizations(subscriptionLevel)){
        throw new Error("Customizations not allowed for this subscription level")
    }

    let newPhotoUrl : string | undefined | null = undefined;

    if(photo instanceof File){

        //If exisiting photo is there, we first delete the existing photo before uploading the new one to blob storage

        if(existingResume?.photoUrl){
            await del(existingResume.photoUrl)
        }

        //Uploading the new image if the usr uploads a new photo to the resume

        const blob = await put(`resume_photos/${path.extname(photo.name)}` , photo , {
            access: "public"
        })

        newPhotoUrl  = blob.url;

    } else if (photo===null){

        if(existingResume?.photoUrl){
            await del(existingResume.photoUrl)
        }

        newPhotoUrl = null;
    }

    //Saving the changes in the database

    //if the resume id is defined i.e we make changes to a already created resume, we update the changes in the database
    if (id) {

        return prisma.resume.update({
            where: {id},
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,

                workExperiences: {
                    deleteMany: {}, //Deletes the existing entries from the work ex table

                    create: workExperiences?.map(exp => ({
                        ...exp,

                        startDate : exp.startDate ? new Date(exp.startDate) : undefined,

                        endDate : exp.endDate ? new Date(exp.endDate) : undefined
                    }
                
                ))
                } , 

                educations: {
                    deleteMany: {}, //Deletes the existing entries from the education table

                    create: educations?.map(edu => ({
                        ...edu,

                        startDate : edu.startDate ? new Date(edu.startDate) : undefined,

                        endDate : edu.endDate ? new Date(edu.endDate) : undefined
                    }
                
                ))
                } ,

                updatedAt : new Date(),
            }
        })
    }

    //if the resume id is not defined i.e we are creating a new resume
    else {

         return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });

    }

}