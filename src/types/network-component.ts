export interface NetworkComponentType {
  id: number
  name: string
  description: string
}

export interface NetworkComponent {
  id: number
  typeId: number
  name: string
  description: string
  ipAddress: string
  connectedToId: number | null
}
