import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { resumeDataInclude } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"
import { PlusSquare } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import ResumeItems from "./ResumeItems"
import CreateResumeButton from "./CreateResumeButton"
import { getUserSubscriptionLevel } from "@/lib/subscription"
import { canCreateResume } from "@/lib/permissions"


export const metadata: Metadata = {
    title : "Your resumes"
}

export default async function Page() {
    const {userId} = await auth();

    if(!userId){
        return null;
    }

    //Helps to excute two functions simultaneously. we pass the functions (finding the Resumes & counting the resume) in array to execute them together
    const [resumes , totalCount , subscriptionLevel] = await Promise.all([

        //Finding the resumes in descending order
                await prisma.resume.findMany({
                where: {
                    userId
                },

                orderBy: {
                    updatedAt: "desc"
                },

                include: resumeDataInclude
                }),

        //Counting the total resumes

        prisma.resume.count({
            where: {
                userId
            }
        }),

        //Getting the subscription level

        getUserSubscriptionLevel(userId)

    ]);

    //TODO: Check for the NON-PREMIUM USERS

    
    return(
        <main className="max-w-7xl mx-auto w-full px-3 py-6 space-y-6">
           
           <CreateResumeButton
           canCreate = {canCreateResume(subscriptionLevel , totalCount)}
           />

            <div className="space-y-1">

                <h1 className="text-3xl font-bold">Resume Vault</h1>
                <p className="text-muted-foreground">Total Resumes: {totalCount}</p>
            </div>


            <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-3">


                
                {resumes.map(resume => (
                    <ResumeItems
                    key={resume.id}
                    resume={resume}
                 />

                ))}

            </div>
        </main>
    )
}