"use client";

import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenu , DropdownMenuContent , DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumevalues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { deleteResume } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import {useReactToPrint} from "react-to-print"

interface ResumeItemsProps{
    resume: ResumeServerData
}

export default function ResumeItems({resume} : ResumeItemsProps){

    //Creating the print function
    const contentRef = useRef<HTMLDivElement>(null);

    const reactToPrint = useReactToPrint({
        contentRef,
        documentTitle: resume.title || "Resume" //Resume will be saved as PDF/sent to print in this name


    })

    const wasUpdated = resume.updatedAt !== resume.createdAt;

    return(

        <div className="group relative border rounded-lg border-transparent hover:border-border cursor-pointer transition-colors bg-secondary p-3"> 

        <div className="space-y-3">
            <Link
            href={`/editor?resumeId=${resume.id}`}
            className="inline-block w-full text-center">
                <p className="font-semibold line-clamp-1 gradient-title-small">
                    {resume.title || "Untitled"}
                </p>
                {resume.description && (
                    <p className="line-clamp-2 text-xs">{resume.description}</p>
                )}

                <p className="text-xs text-muted-foreground">
                    {wasUpdated ? "Updated" : "Created"} on{" "}
                    {formatDate(resume.updatedAt , "MMM d, yyyy h:mm a")}
                </p>
            </Link>

            <Link
            href={`/editor?resumeId=${resume.id}`}
            className="relative inline-block w-full"
            >
                <ResumePreview
                    resumeData={mapToResumevalues(resume)}
                    contentRef={contentRef}
                    className=" overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
                />

                <div
                className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
                />
            </Link>
        </div>

        <MoreMenu resumeId={resume.id} onPrintClick={reactToPrint} />
            
        </div>
    )
}

interface MoreMenuProps{
    resumeId: string;
    onPrintClick: () => void;
}

function MoreMenu({resumeId , onPrintClick} : MoreMenuProps){
    const [showDeleteConfirmation , setShowDeleteConfirmation] = useState(false);

    return(
        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>

                    <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-0.5 opacity-100">
                        <MoreVertical className="size-4" />
                    </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-auto min-w-fit px-2 py-1">

                    {/* Delete Resume Option */}
                    <DropdownMenuItem
                    className="flex items-center gap-2 px-2 py-1 w-fit"
                    onClick={() => setShowDeleteConfirmation(true)}
                    >
                        Delete <Trash className="size-4" />
                    </DropdownMenuItem>

                    {/* Print Resume option */}

                    <DropdownMenuItem
                    className="flex items-center gap-2 px-2 py-1 w-fit"
                    onClick={onPrintClick}>
                        
                        
                        Print <Printer className="size-4" />

                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteConfirmationDialog 
            resumeId={resumeId}
            open={showDeleteConfirmation}
            onOpenChange={setShowDeleteConfirmation}
            />
        
        </>
    );

}

interface DeleteConfirmationDialogProps{
    resumeId : string;
    open: boolean
    onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
    resumeId,
    open,
    onOpenChange

} : DeleteConfirmationDialogProps){

    const {toast} = useToast();

    const [isPending , startTransition] = useTransition();

    async function handleDelete(){
        startTransition(async() => {
            try {

                await deleteResume(resumeId);
                onOpenChange(false)
                
            } catch (error) {
                
                console.error(error)
                toast({
                    variant: "destructive",
                    description: "Something went wrong. Please try again."
                });
            }
        })
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete resume?</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        This will permanently delete this resume. This action cannot be undone.
                        </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <LoadingButton
                    variant="destructive"
                    onClick={handleDelete}
                    loading = {isPending}>

                        Delete
                    </LoadingButton>

                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}