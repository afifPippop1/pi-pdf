import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export function MaxFileSizeDialog(props: {
  status: "open" | "continue" | null;
  onChange: (status: null | "continue") => void;
}) {
  return (
    <AlertDialog {...props} open={props.status === "open"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>File exceeds 2 MB</AlertDialogTitle>
          <AlertDialogDescription className="mb-2">
            This file is larger than 2&nbsp;MB, so it can&apos;t be saved to the
            cloud on the current plan.
          </AlertDialogDescription>
          <AlertDialogDescription className="mb-2">
            You can still edit the document and download it to your device.
          </AlertDialogDescription>
          <AlertDialogDescription className="mb-2 text-muted-foreground">
            Note: Changes will be stored locally and won&apos;t sync to the
            cloud.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              props.onChange(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onChange("continue");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
