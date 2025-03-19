import {
    AlertDialog as AlertDialogComponent,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AlertDialogProps {
    title: string;
    Description: string;
    onClickCancel?: () => void;
    textCancel?: string;
    onClickContinue?: () => void;
    textContinue?: string;
}
export function AlertDialog({ 
    title, 
    Description , 
    onClickCancel = undefined,
    textCancel = 'Cancel', 
    onClickContinue = undefined, 
    textContinue = 'Continue'
}: AlertDialogProps) {
    return (
        <AlertDialogComponent >
            <AlertDialogTrigger>Open</AlertDialogTrigger>
            <AlertDialogContent className="bg-base-100 border-[0.5px] border-base-300 rounded-md shadow-sm text-base-content">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {Description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        className="bg-neutral hover:bg-neutral  border-[0.5px] border-base-300 rounded-md" 
                        onClick={onClickCancel}
                    >
                        {textCancel}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        className="bg-neutral hover:bg-neutral  border-[0.5px] border-base-300 rounded-md" 
                        onClick={onClickContinue}
                    >
                        {textContinue}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogComponent>

    )
}