import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ComponentTypeDialog } from "@/components/component-type-dialog"
import { ComponentTypeTable } from "@/components/component-type-table"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import {
  fetchComponentTypes,
  createComponentType,
  updateComponentType,
  deleteComponentType,
} from "@/services/api"
import type { NetworkComponentType } from "@/types/network-component"
import { PlusIcon } from "lucide-react"

export function ComponentTypesPage() {
  const [items, setItems] = useState<NetworkComponentType[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<NetworkComponentType | null>(null)
  const [dialogKey, setDialogKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<NetworkComponentType | null>(
    null
  )

  useEffect(() => {
    fetchComponentTypes().then(setItems)
  }, [])

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
    setItems(await fetchComponentTypes())
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    await deleteComponentType(deleteTarget.id)
    setDeleteTarget(null)
    setItems(await fetchComponentTypes())
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
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

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
