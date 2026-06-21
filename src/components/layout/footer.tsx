import { cn } from "@/lib/utils"

export function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex items-center justify-center border-t px-6 py-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      Portal Gestão NOC — Monitorando redes, garantindo conectividade.
    </footer>
  )
}
