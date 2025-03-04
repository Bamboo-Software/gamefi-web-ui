import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ICustomDialog {
    open: boolean;
    onHandle?: React.ReactNode;
    onClose: (value: boolean) => void;
    title: React.ReactNode;
    description: string | React.ReactNode;
    className?: string
}

const CustomDialog = ({ open, onHandle, onClose, title, description, className }: ICustomDialog) => (

    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`${className}`}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                {onHandle}
            </DialogFooter>
        </DialogContent>
    </Dialog>

);

export default CustomDialog;