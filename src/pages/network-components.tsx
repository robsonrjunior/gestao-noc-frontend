import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { NetworkComponentDialog } from "@/components/network-component-dialog"
import { NetworkComponentTable } from "@/components/network-component-table"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import {
  fetchComponentTypes,
  fetchComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} from "@/services/api"
import type {
  NetworkComponent,
  NetworkComponentType,
} from "@/types/network-component"
import { PlusIcon } from "lucide-react"

export function NetworkComponentsPage() {
  const [components, setComponents] = useState<NetworkComponent[]>([])
  const [types, setTypes] = useState<NetworkComponentType[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<NetworkComponent | null>(null)
  const [dialogKey, setDialogKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<NetworkComponent | null>(
    null
  )

  useEffect(() => {
    Promise.all([fetchComponents(), fetchComponentTypes()]).then(
      ([compData, typeData]) => {
        setComponents(compData)
        setTypes(typeData)
      }
    )
  }, [])

  const typeNames = useMemo(() => {
    const map: Record<number, string> = {}
    for (const t of types) {
      map[t.id] = t.name
    }
    return map
  }, [types])

  const componentNames = useMemo(() => {
    const map: Record<number, string> = {}
    for (const c of components) {
      map[c.id] = c.name
    }
    return map
  }, [components])

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
    const [compData, typeData] = await Promise.all([
      fetchComponents(),
      fetchComponentTypes(),
    ])
    setComponents(compData)
    setTypes(typeData)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteComponent(deleteTarget.id)
    setDeleteTarget(null)
    const [compData, typeData] = await Promise.all([
      fetchComponents(),
      fetchComponentTypes(),
    ])
    setComponents(compData)
    setTypes(typeData)
  }

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
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
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

      <NetworkComponentDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editItem={editItem}
        types={types}
        components={components}
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
