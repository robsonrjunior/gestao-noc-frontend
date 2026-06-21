import type {
  NetworkComponentType,
  NetworkComponent,
} from "@/types/network-component"

const API_BASE = "/api"

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, init)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export async function fetchComponentTypes(): Promise<NetworkComponentType[]> {
  return request<NetworkComponentType[]>("/network-component-types")
}

export async function fetchComponentType(
  id: number
): Promise<NetworkComponentType> {
  return request<NetworkComponentType>(`/network-component-types/${id}`)
}

export async function createComponentType(
  data: Omit<NetworkComponentType, "id">
): Promise<NetworkComponentType> {
  return request<NetworkComponentType>("/network-component-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function updateComponentType(
  id: number,
  data: Omit<NetworkComponentType, "id">
): Promise<NetworkComponentType> {
  return request<NetworkComponentType>(`/network-component-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function deleteComponentType(id: number): Promise<void> {
  await fetch(`${API_BASE}/network-component-types/${id}`, {
    method: "DELETE",
  })
}

export async function fetchComponents(): Promise<NetworkComponent[]> {
  return request<NetworkComponent[]>("/network-components")
}

export async function fetchComponent(
  id: number
): Promise<NetworkComponent> {
  return request<NetworkComponent>(`/network-components/${id}`)
}

export async function createComponent(
  data: Omit<NetworkComponent, "id">
): Promise<NetworkComponent> {
  return request<NetworkComponent>("/network-components", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function updateComponent(
  id: number,
  data: Omit<NetworkComponent, "id">
): Promise<NetworkComponent> {
  return request<NetworkComponent>(`/network-components/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function deleteComponent(id: number): Promise<void> {
  await fetch(`${API_BASE}/network-components/${id}`, { method: "DELETE" })
}
