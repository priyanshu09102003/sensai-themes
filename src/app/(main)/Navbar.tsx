"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png"
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Toggle from "@/components/toggle";
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes";

export default function Navbar(){

    //Getting the current theme from the next themes to use the clerk dark theme mode of the user icon on toggling the theme
    const {theme} = useTheme(); 
    return(

        <header className="shadow-md">
            
            <div className="mx-auto max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">

                <Link href="/resumes" className="flex items-center gap-2">
                    <Image src= {logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full" />

                    <span className="text-xl font-bold tracking-tight gradient-title">THEMES
                    </span>
                </Link>

               <div className="flex items-center gap-3">
                    <Toggle />

                    <UserButton
                    appearance={{
                        baseTheme: theme === "dark" ? dark : undefined,
                        elements:{
                            avatarBox:{
                                width: 40,
                                height: 40
                            }
                        }
                    }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Link
                            label = "Subscription"
                            labelIcon = {<CreditCard className="size-4"/>}
                            href = "/billing"
                            />
                        </UserButton.MenuItems>

                    </UserButton>
               </div>
                 
            </div>

        </header>
    )
}