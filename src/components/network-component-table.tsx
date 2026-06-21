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
import type { NetworkComponent } from "@/types/network-component"

interface NetworkComponentTableProps {
  items: NetworkComponent[]
  typeNames: Record<number, string>
  componentNames: Record<number, string>
  loading?: boolean
  onEdit: (item: NetworkComponent) => void
  onDelete: (item: NetworkComponent) => void
}

export function NetworkComponentTable({
  items,
  typeNames,
  componentNames,
  loading = false,
  onEdit,
  onDelete,
}: NetworkComponentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Descricao</TableHead>
          <TableHead>Endereco IP</TableHead>
          <TableHead>Conectado a</TableHead>
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
                  <Skeleton className="h-5 w-full" />
                </TableCell>
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
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  Nenhum componente de rede cadastrado
                </TableCell>
              </TableRow>
            )
            : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {typeNames[item.typeId] ?? "Tipo desconhecido"}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>{item.ipAddress}</TableCell>
                  <TableCell>
                    {item.connectedToId
                      ? (componentNames[item.connectedToId] ?? "-")
                      : "-"}
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
