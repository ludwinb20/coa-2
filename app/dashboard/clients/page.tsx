import { getUser } from "@/actions/user";
import DashboardLayout from "@/app/dashboard/layout";
import ClientsIndex from "@/components/clients/clients-index";
import { getClients } from "@/services/clients";

export default async function Clients() {
    const user = await getUser();
    const clientes = await getClients({empresa_id: user.data?.empresa.id ?? null});
  return (
    <div className="p-6">
      <h1>Clientes</h1>
        <ClientsIndex clients={clientes} />
    </div>
  );
}
