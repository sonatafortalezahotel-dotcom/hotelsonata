import type { PopoverContentProps } from "@radix-ui/react-popover";

/** Evita que o Popover feche ao interagir com Select (conteúdo renderizado em portal). */
export const preventPopoverCloseOnSelect: NonNullable<
  PopoverContentProps["onInteractOutside"]
> = (event) => {
  const target = event.target as HTMLElement;
  if (
    target.closest("[data-radix-select-content]") ||
    target.closest("[data-radix-select-viewport]") ||
    target.closest('[role="listbox"]')
  ) {
    event.preventDefault();
  }
};
