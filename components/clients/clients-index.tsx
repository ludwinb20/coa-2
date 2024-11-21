import { Client } from "@/types/clients";
import { DataTableClients } from "@/components/clients/table";
import { columnsClients} from "@/components/clients/columns";

type Props = {
  clients: Client[];
};

const ClientsIndex = ({clients}: Props) => {
  return (
    <div>
        <DataTableClients columns={columnsClients} data={clients}/>
    </div>
  );
};

export default ClientsIndex;