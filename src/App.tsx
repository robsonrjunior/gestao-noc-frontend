import { Routes, Route } from "react-router-dom"
import { LoginPage } from "@/pages/login"
import { HomePage } from "@/pages/home"
import { ComponentTypesPage } from "@/pages/component-types"
import { NetworkComponentsPage } from "@/pages/network-components"
import { Layout } from "@/components/layout/layout"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/component-types" element={<ComponentTypesPage />} />
        <Route path="/network-components" element={<NetworkComponentsPage />} />
      </Route>
    </Routes>
  )
}

export default App
