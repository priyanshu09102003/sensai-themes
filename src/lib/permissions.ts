// Locks certin feaatures based on subscriotion and provides the actual use of a payement gateway
import { SubscriptionLevel } from "./subscription";



//This function helps to put a check on the number of resumes that can be created based on the tier of subscription
export function canCreateResume(
    subscriptionLevel: SubscriptionLevel,
    currentResumeCount: number
){
    const maxResumeMap : Record<SubscriptionLevel , number> = {
        free: 1,
        pro: 3,
        pro_plus: Infinity
    }

    const maxResumes = maxResumeMap[subscriptionLevel]

    return currentResumeCount < maxResumes
}


//Checking if the user can use the AI tool
export function canUseAITools(subscriptionLevel: SubscriptionLevel){

    return subscriptionLevel !== "free";
}

//Checking if the user can use customizations

export function canUseCustomizations(subscriptionLevel : SubscriptionLevel){
    return subscriptionLevel === "pro_plus" ;
}

