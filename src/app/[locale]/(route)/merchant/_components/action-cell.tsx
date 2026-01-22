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
export default function ActionsCell<T>({
  item,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  t,
  variant = "dropdown",
}: {
  item: T;
  onOpenDetail?: (item: T) => void;
  onOpenEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  t: (key: string) => string;
  variant?: "dropdown" | "verbose";
}) {
  const actions = [];
  if (onOpenDetail)
    actions.push({
      title: t("actions.view"),
      onPress: () => onOpenDetail(item),
    });
  if (onOpenEdit)
    actions.push({ title: t("actions.edit"), onPress: () => onOpenEdit(item) });
  if (onDelete)
    actions.push({ title: t("actions.delete"), onPress: () => onDelete(item) });

  if (variant === "verbose") {
    return (
      <div className="flex items-center gap-1">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-secondary hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 />
          </Button>
        )}
        {onOpenEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:bg-secondary"
            onClick={() => onOpenEdit(item)}
          >
            <Pencil />
          </Button>
        )}
        {onOpenDetail && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:bg-secondary"
            onClick={() => onOpenDetail(item)}
          >
            <Eye />
          </Button>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((res) => {
          return (
            <DropdownMenuItem
              key={res.title}
              onSelect={(e) => {
                e.preventDefault();
                res.onPress();
              }}
            >
              {res.title}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
