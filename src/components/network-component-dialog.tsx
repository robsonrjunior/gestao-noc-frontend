import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type {
  NetworkComponent,
  NetworkComponentType,
} from "@/types/network-component"

type FormData = {
  typeId: string
  name: string
  description: string
  ipAddress: string
  connectedToId: string
}

type FormErrors = {
  typeId?: string
  name?: string
  ipAddress?: string
}

interface NetworkComponentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<NetworkComponent, "id">) => Promise<void>
  editItem?: NetworkComponent | null
  types: NetworkComponentType[]
  components: NetworkComponent[]
}

export function NetworkComponentDialog({
  open,
  onOpenChange,
  onSave,
  editItem,
  types,
  components,
}: NetworkComponentDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    typeId: editItem ? String(editItem.typeId) : "",
    name: editItem?.name ?? "",
    description: editItem?.description ?? "",
    ipAddress: editItem?.ipAddress ?? "",
    connectedToId: editItem?.connectedToId
      ? String(editItem.connectedToId)
      : "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const isEditing = !!editItem

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!formData.typeId) {
      newErrors.typeId = "Tipo e obrigatorio"
    }
    if (!formData.name.trim()) {
      newErrors.name = "Nome e obrigatorio"
    }
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "Endereco IP e obrigatorio"
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
        typeId: Number(formData.typeId),
        name: formData.name.trim(),
        description: formData.description.trim(),
        ipAddress: formData.ipAddress.trim(),
        connectedToId: formData.connectedToId
          ? Number(formData.connectedToId)
          : null,
      })
    } finally {
      setSaving(false)
    }
  }

  const connectedOptions = isEditing
    ? components.filter((c) => c.id !== editItem!.id)
    : components

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Componente" : "Novo Componente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <Select
                value={formData.typeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, typeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.typeId && <FieldError>{errors.typeId}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="comp-name">Nome</FieldLabel>
              <Input
                id="comp-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome do componente"
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="comp-description">Descricao</FieldLabel>
              <Textarea
                id="comp-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descricao do componente"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="comp-ip">Endereco IP</FieldLabel>
              <Input
                id="comp-ip"
                value={formData.ipAddress}
                onChange={(e) =>
                  setFormData({ ...formData, ipAddress: e.target.value })
                }
                placeholder="10.0.0.1"
              />
              {errors.ipAddress && <FieldError>{errors.ipAddress}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Conectado a</FieldLabel>
              <Select
                value={formData.connectedToId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    connectedToId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {connectedOptions.map((comp) => (
                    <SelectItem key={comp.id} value={String(comp.id)}>
                      {comp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
