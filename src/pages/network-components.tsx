import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { NetworkComponentDialog } from "@/components/network-component-dialog";
import { NetworkComponentTable } from "@/components/network-component-table";
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
    createComponent,
    deleteComponent,
    fetchComponentTypes,
    fetchComponents,
    fetchComponentsPaged,
    updateComponent,
} from "@/services/api";
import type {
    NetworkComponent,
    NetworkComponentType,
} from "@/types/network-component";
import { PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 5

export function NetworkComponentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [components, setComponents] = useState<NetworkComponent[]>([])
  const [allComponents, setAllComponents] = useState<NetworkComponent[]>([])
  const [types, setTypes] = useState<NetworkComponentType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [refetchKey, setRefetchKey] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<NetworkComponent | null>(null)
  const [dialogKey, setDialogKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<NetworkComponent | null>(
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

  // Busca lista completa para os mapas de nomes e para o dropdown do dialog
  useEffect(() => {
    Promise.all([fetchComponents(), fetchComponentTypes()])
      .then(([all, typeData]) => {
        setAllComponents(all)
        setTypes(typeData)
      })
  }, [refetchKey])

  // Busca apenas a página atual — chamado a cada mudança de página
  useEffect(() => {
    setLoading(true)
    fetchComponentsPaged(page, PAGE_SIZE)
      .then((result) => {
        setComponents(result.data)
        setTotalPages(result.pages)
      })
      .finally(() => setLoading(false))
  }, [page, refetchKey])

  const typeNames = useMemo(() => {
    const map: Record<number, string> = {}
    for (const t of types) {
      map[t.id] = t.name
    }
    return map
  }, [types])

  const componentNames = useMemo(() => {
    const map: Record<number, string> = {}
    for (const c of allComponents) {
      map[c.id] = c.name
    }
    return map
  }, [allComponents])

  function handleCreate() {
    setEditItem(null)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  function handleEdit(item: NetworkComponent) {
    setEditItem(item)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  async function handleSave(data: Omit<NetworkComponent, "id">) {
    if (editItem) {
      await updateComponent(editItem.id, data)
    } else {
      await createComponent(data)
    }
    setDialogOpen(false)
    setPage(1)
    setRefetchKey((k) => k + 1)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteComponent(deleteTarget.id)
    setDeleteTarget(null)
    setRefetchKey((k) => k + 1)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold tracking-tight">
            Componentes de Rede
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os componentes da infraestrutura de rede
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="size-4" />
          Novo Componente
        </Button>
      </div>

      <NetworkComponentTable
        items={components}
        typeNames={typeNames}
        componentNames={componentNames}
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

      <NetworkComponentDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editItem={editItem}
        types={types}
        components={allComponents}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Excluir componente de rede"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta acao nao pode ser desfeita.`}
      />
    </div>
  )
}
