"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil, Eye } from "lucide-react";
import { useState } from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { BaseModal } from "@/components/modals/base-modal";
import { useTranslations } from "next-intl";

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
  onOpenDetail,
  onOpenEdit,
  onDelete,
  t,
  variant = "dropdown",
}: {
  item: T;
  actions?: ActionItem<T>[];
  onOpenDetail?: (item: T) => void;
  onOpenEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  t: (key: string) => string;
  variant?: "dropdown" | "verbose";
}) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionItem<T> | null>(null);
  const tDialog = useTranslations("CommonComponent.Dialog");

  // Build actions from callbacks if not provided as array
  const actionsList: ActionItem<T>[] = actions || [];
  if (!actions) {
    if (onOpenDetail) {
      actionsList.push({
        title: t("actions.view"),
        onPress: () => onOpenDetail(item),
      });
    }
    if (onOpenEdit) {
      actionsList.push({
        title: t("actions.edit"),
        onPress: () => onOpenEdit(item),
      });
    }
    if (onDelete) {
      actionsList.push({
        title: t("actions.delete"),
        variant: "destructive",
        onPress: () => onDelete(item),
      });
    }
  }

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

  if (variant === "verbose") {
    return (
      <>
        <div className="flex items-center gap-1">
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={() =>
                handleAction({
                  title: t("actions.delete"),
                  variant: "destructive",
                  onPress: () => onDelete(item),
                  confirmation: {
                    title: t("dialog.deleteTitle"),
                    description: t("dialog.deleteDescription"),
                  },
                })
              }
            >
              <Trash2 />
            </Button>
          )}
          {onOpenEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-primary/10 hover:text-primary"
              onClick={() => onOpenEdit(item)}
            >
              <Pencil />
            </Button>
          )}
          {onOpenDetail && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:bg-accent hover:text-accent-foreground"
              onClick={() => onOpenDetail(item)}
            >
              <Eye />
            </Button>
          )}
        </div>

        <BaseModal
          open={open}
          onOpenChange={setOpen}
          title={activeAction?.confirmation?.title}
          description={activeAction?.confirmation?.description}
          className="bg-card p-4"
        >
          <AlertDialogFooter>
            <AlertDialogCancel>
              {activeAction?.confirmation?.cancelText || tDialog("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {activeAction?.confirmation?.confirmText || tDialog("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </BaseModal>
      </>
    );
  }

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
          {actionsList.map((res) => {
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

      <BaseModal
        open={open}
        onOpenChange={setOpen}
        title={activeAction?.confirmation?.title}
        description={activeAction?.confirmation?.description}
        className="bg-card p-4"
      >
        <AlertDialogFooter>
          <AlertDialogCancel>
            {activeAction?.confirmation?.cancelText || tDialog("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {activeAction?.confirmation?.confirmText || tDialog("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </BaseModal>
    </>
  );
}
