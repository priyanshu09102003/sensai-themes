"use server";

import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { GenerateSummaryInput, generateSummarySchema, generateWorkExperienceInput, generateWorkExperienceSchema, WorkExperience } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummary(input: GenerateSummaryInput) {
    //  Block for non premium users
    
    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if(!canUseAITools(subscriptionLevel)){
        throw new Error ("Upgrade to Premium Plus to use this feature")
    }


    
    console.log("🚀 generateSummary called with input:", input);
    
    const {
        jobTitle,
        workExperiences,
        educations,
        skills
    } = generateSummarySchema.parse(input);
    
    console.log("✅ Parsed data:", { jobTitle, workExperiences, educations, skills });

    const systemMessage = `
        You are an expert resume writer and career consultant. Create a compelling, professional career summary that will grab recruiters' attention and showcase the candidate's value proposition.

        Guidelines for the summary:
        - Write 3-4 well-structured sentences (60-100 words)
        - Use strong action words and industry-relevant keywords
        - Highlight key achievements, skills, and experience
        - Focus on value the candidate brings to employers
        - Use professional, polished language with varied sentence structure
        - Avoid generic phrases - make it specific and impactful
        - Start with the candidate's professional identity or years of experience
        - Include quantifiable achievements when possible
        - End with what they're seeking or their key strengths

        Return only the polished summary text without any headings, labels, or explanations.
    `;

    const userMessage = `
    Create a compelling professional summary for this candidate:

    Target Role: ${jobTitle || "Professional"}

    Professional Experience:
    ${workExperiences
        ?.map(
            (exp, index) => `
    ${index + 1}. ${exp.position || "Position"} at ${exp.company || "Company"}
       Duration: ${exp.startDate || "Start"} to ${exp.endDate || "Present"}
       Key Responsibilities & Achievements: ${exp.description || "No description provided"}
    `,
        )
        .join("\n") || "No professional experience provided"}

    Educational Background:
    ${educations
        ?.map(
            (edu, index) => `
    ${index + 1}. ${edu.degree || "Degree"} from ${edu.school || "Institution"}
       Completed: ${edu.startDate || "Start"} to ${edu.endDate || "End"}
    `,
        )
        .join("\n") || "No educational background provided"}

    Core Skills & Expertise: ${skills || "Skills to be highlighted"}

    Please craft a professional summary that positions this candidate as an ideal hire, emphasizing their unique value proposition and career progression.
    `;

    console.log("📝 System message:", systemMessage);
    console.log("💬 User message:", userMessage);

    // Use server-side environment variable instead of NEXT_PUBLIC_
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔑 API Key exists:", !!apiKey);
    
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY environment variable is not set");
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", // Changed from gemini-1.5-pro to flash
    });

    try {
        console.log("🤖 Calling Gemini API...");
        
        const result = await model.generateContent(systemMessage + "\n\n" + userMessage);
        console.log("📊 API Response received:", !!result);

        const response = result.response;
        const aiResponse = response.text();
        
        console.log("✨ Generated summary:", aiResponse);

        if (!aiResponse) {
            console.error("❌ Empty AI response");
            throw new Error("Failed to generate AI response");
        }

        console.log("🎉 Summary generation successful");
        return aiResponse;
    } catch (error) {
        console.error("💥 Error in generateSummary:", error);
        
        // Handle specific error types
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            
            // Check for quota exceeded error
            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Too Many Requests")) {
                throw new Error("API quota exceeded. Please try again later or upgrade your plan.");
            }
            
            // Check for API key issues
            if (error.message.includes("API key") || error.message.includes("401")) {
                throw new Error("Invalid API key. Please check your configuration.");
            }
            
            // Generic API error
            if (error.message.includes("GoogleGenerativeAI")) {
                throw new Error("AI service temporarily unavailable. Please try again later.");
            }
        }
        
        throw new Error(`Failed to generate resume summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateWorkExperience(
    input: generateWorkExperienceInput

) {

    // Block for non premium users

    const {userId} = await auth();

    if(!userId){
        throw new Error("Unauthorized")
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if(!canUseAITools(subscriptionLevel)){
        throw new Error ("Upgrade to Premium Plus to use this feature")
    }



    
    console.log(" generateWorkExperience called with input:", input);
    
    const { description } = generateWorkExperienceSchema.parse(input);
    
    console.log(" Parsed data:", { description });

    const systemMessage = `
        You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
        Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

        Job title: <job title>
        Company: <company name>
        Start date: <format: YYYY-MM-DD> (only if provided)
        End date: <format: YYYY-MM-DD> (only if provided)
        Description: <an optimized description in bullet format, might be inferred from the job title>
    `;

    const userMessage = `
        Please provide a work experience entry from this description:
        ${description}
    `;

    console.log(" System message:", systemMessage);
    console.log(" User message:", userMessage);

    // Use server-side environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(" API Key exists:", !!apiKey);
    
    if (!apiKey) {
        console.error(" GEMINI_API_KEY environment variable is not set");
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    try {
        console.log(" Calling Gemini API...");
        
        const result = await model.generateContent(systemMessage + "\n\n" + userMessage);
        console.log(" API Response received:", !!result);

        const response = result.response;
        const aiResponse = response.text();
        
        console.log("✨ Generated work experience:", aiResponse);

        if (!aiResponse) {
            console.error(" Empty AI response");
            throw new Error("Failed to generate AI response");
        }

        console.log("🎉 Work experience generation successful");

        // Parse the structured response using regex (same as original)
        return {
            position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
            company: aiResponse.match(/Company: (.*)/)?.[1] || "",
            description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
            startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
            endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
        } satisfies WorkExperience;

    } catch (error) {
        console.error("💥 Error in generateWorkExperience:", error);
        
        // Handle specific error types
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            
            // Check for quota exceeded error
            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("Too Many Requests")) {
                throw new Error("API quota exceeded. Please try again later or upgrade your plan.");
            }
            
            // Check for API key issues
            if (error.message.includes("API key") || error.message.includes("401")) {
                throw new Error("Invalid API key. Please check your configuration.");
            }
            
            // Generic API error
            if (error.message.includes("GoogleGenerativeAI")) {
                throw new Error("AI service temporarily unavailable. Please try again later.");
            }
        }
        
        throw new Error(`Failed to generate work experience: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}