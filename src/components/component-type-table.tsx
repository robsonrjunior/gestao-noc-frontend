import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PencilIcon, Trash2Icon } from "lucide-react"
import type { NetworkComponentType } from "@/types/network-component"

interface ComponentTypeTableProps {
  items: NetworkComponentType[]
  loading?: boolean
  onEdit: (item: NetworkComponentType) => void
  onDelete: (item: NetworkComponentType) => void
}

export function ComponentTypeTable({
  items,
  loading = false,
  onEdit,
  onDelete,
}: ComponentTypeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descricao</TableHead>
          <TableHead className="w-[100px]">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="size-9" />
                    <Skeleton className="size-9" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          : items.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-sm text-muted-foreground">
                  Nenhum tipo de componente cadastrado
                </TableCell>
              </TableRow>
            )
            : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(item)}
                        title="Editar"
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(item)}
                        title="Excluir"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
      </TableBody>
    </Table>
  )
}
