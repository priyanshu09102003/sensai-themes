"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
    DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"



import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function Toggle(){
    const {setTheme} = useTheme();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>

                    <Button variant="ghost" size="icon" className="cursor-pointer" >
                        <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

                        <Moon className="size-[1.2rem] absolute rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0" />

                        <span className="sr-only">Toggle Theme</span>
                    </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}