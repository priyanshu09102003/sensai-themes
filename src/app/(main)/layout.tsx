import PremiumModal from "@/components/premium/PremiumModal";
import Navbar from "./Navbar";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default async function Layout({children} : {children: React.ReactNode}) {
    const {userId} = await auth();

    if(!userId){
        return null;
    }

    const userSubscriptionLevel = await getUserSubscriptionLevel(userId);


    return(
        <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                {children}
                <PremiumModal />
            </div>
        </SubscriptionLevelProvider>
    )
}