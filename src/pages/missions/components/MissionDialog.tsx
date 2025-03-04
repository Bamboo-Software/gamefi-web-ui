import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface IMissionDialog {
    title: string;
    description: string;
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
                    <DialogTitle className="text-lg">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm py-2">{description}</DialogDescription>
                    {actionBtn}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default MissionDialog