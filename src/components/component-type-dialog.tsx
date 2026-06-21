import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NetworkComponentType } from "@/types/network-component"

type FormData = {
  name: string
  description: string
}

type FormErrors = {
  name?: string
}

interface ComponentTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<NetworkComponentType, "id">) => Promise<void>
  editItem?: NetworkComponentType | null
}

export function ComponentTypeDialog({
  open,
  onOpenChange,
  onSave,
  editItem,
}: ComponentTypeDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: editItem?.name ?? "",
    description: editItem?.description ?? "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const isEditing = !!editItem

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = "Nome e obrigatorio"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tipo" : "Novo Tipo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="type-name">Nome</FieldLabel>
              <Input
                id="type-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome do tipo"
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="type-description">Descricao</FieldLabel>
              <Textarea
                id="type-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descricao do tipo"
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
