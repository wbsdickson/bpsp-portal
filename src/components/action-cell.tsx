import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ActionItem<T> {
  title: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onPress: (item: T) => void;
  confirmation?: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
  };
}

export default function ActionsCell<T>({
  item,
  actions,
  t,
}: {
  item: T;
  actions: ActionItem<T>[];
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionItem<T> | null>(null);

  const handleAction = (action: ActionItem<T>) => {
    if (action.confirmation) {
      setActiveAction(action);
      setOpen(true);
    } else {
      action.onPress(item);
    }
  };

  const handleConfirm = () => {
    if (activeAction) {
      activeAction.onPress(item);
      setOpen(false);
      setActiveAction(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
          {actions.map((res) => {
            return (
              <DropdownMenuItem
                key={res.title}
                variant={res.variant}
                onSelect={(e) => {
                  e.preventDefault();
                  handleAction(res);
                }}
              >
                {res.title}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-card p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeAction?.confirmation?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeAction?.confirmation?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {activeAction?.confirmation?.cancelText || t("dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {activeAction?.confirmation?.confirmText || t("dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
