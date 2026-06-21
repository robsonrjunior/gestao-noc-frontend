import { ComponentTypeDialog } from "@/components/component-type-dialog";
import { ComponentTypeTable } from "@/components/component-type-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
    createComponentType,
    deleteComponentType,
    fetchComponentTypesPaged,
    updateComponentType,
} from "@/services/api";
import type { NetworkComponentType } from "@/types/network-component";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 5

export function ComponentTypesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<NetworkComponentType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [refetchKey, setRefetchKey] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<NetworkComponentType | null>(null)
  const [dialogKey, setDialogKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<NetworkComponentType | null>(
    null
  )

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))

  function setPage(p: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("page", String(p))
      return next
    })
  }

  function getPageNumbers(total: number, current: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | "...")[] = [1]
    if (current > 3) pages.push("...")
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      pages.push(p)
    }
    if (current < total - 2) pages.push("...")
    pages.push(total)
    return pages
  }

  useEffect(() => {
    setLoading(true)
    fetchComponentTypesPaged(page, PAGE_SIZE)
      .then((result) => {
        setItems(result.data)
        setTotalPages(result.pages)
      })
      .finally(() => setLoading(false))
  }, [page, refetchKey])

  function handleCreate() {
    setEditItem(null)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  function handleEdit(item: NetworkComponentType) {
    setEditItem(item)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  async function handleSave(data: Omit<NetworkComponentType, "id">) {
    if (editItem) {
      await updateComponentType(editItem.id, data)
    } else {
      await createComponentType(data)
    }
    setDialogOpen(false)
    setPage(1)
    setRefetchKey((k) => k + 1)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteComponentType(deleteTarget.id)
    setDeleteTarget(null)
    setRefetchKey((k) => k + 1)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Tipos de Componente
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os tipos de componentes de rede
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="size-4" />
          Novo Tipo
        </Button>
      </div>

      <ComponentTypeTable
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-9 w-20" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="size-9" />
            ))}
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ) : totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Anterior"
                onClick={(e) => { e.preventDefault(); setPage(Math.max(1, page - 1)) }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getPageNumbers(totalPages, page).map((p, i) =>
              p === "..." ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => { e.preventDefault(); setPage(p) }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Próxima"
                onClick={(e) => { e.preventDefault(); setPage(Math.min(totalPages, page + 1)) }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

      <ComponentTypeDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editItem={editItem}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Excluir tipo de componente"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta acao nao pode ser desfeita.`}
      />
    </div>
  )
}
