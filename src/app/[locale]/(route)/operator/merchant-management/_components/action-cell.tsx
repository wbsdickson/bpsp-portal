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
import { useMemo } from "react";
export default function ActionsCell<T>({
  item,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  t,
}: {
  item: T;
  onOpenDetail?: (item: T) => void;
  onOpenEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  t: (key: string) => string;
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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

        {/* <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onOpenEdit(item);
          }}
        >
          {t("actions.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            onDelete(item);
          }}
        >
          {t("actions.delete")}
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
