import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface IMissionDialog {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const MissionDialog = ({ title, description, ...props }: IMissionDialog) => {
    const { dialogClassName, actionBtn, triggerBtn, dialogIcon } = props;
    return (
        <Dialog>
            <DialogTrigger>
                {triggerBtn}
            </DialogTrigger>
            <DialogContent className={dialogClassName}>
                <DialogHeader>
                    {dialogIcon}
                    <DialogTitle className="text-md font-semibold pb-3 mb-2 border-b border-[#ffffff40]">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm py-2 text-gray-100">{description}</DialogDescription>
                    {actionBtn}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default MissionDialog