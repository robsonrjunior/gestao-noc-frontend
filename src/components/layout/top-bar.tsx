import { cn } from "@/lib/utils"

export function TopBar({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-4 border-b px-6",
        className
      )}
      {...props}
    >
      <h1 className="font-heading font-semibold text-lg tracking-wider uppercase">
        Portal Gestão NOC
      </h1>
    </header>
  )
}
