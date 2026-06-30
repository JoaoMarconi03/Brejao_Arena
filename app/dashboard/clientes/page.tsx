import { buscarClientes, buscarUsuariosClientes } from "./actions"
import { ClientesLista } from "@/components/dashboard/clientes-lista"

export default async function ClientesPage() {
  const [clientes, usuarios] = await Promise.all([
    buscarClientes(),
    buscarUsuariosClientes(),
  ])

  return <ClientesLista clientes={clientes} usuarios={usuarios} />
}
