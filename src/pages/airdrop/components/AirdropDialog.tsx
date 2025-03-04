import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface IAirdropDialog {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    icon?: React.ReactNode
}

const AirdropDialog = ({ title, description, icon }: IAirdropDialog) => {
    return (
        <Dialog>
            <DialogTrigger>
               {icon ? icon : <FaInfoCircle className="size-6" />}
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4 rounded-lg bg-background shadow-lg">
                <DialogHeader>
                    <FaInfoCircle/>
                    <DialogTitle className="text-lg">{title}</DialogTitle>
                    <DialogDescription className="text-sm text-justify">{description}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AirdropDialog