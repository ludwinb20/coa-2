import { acceptCampo } from "@/services/salidas";
import { Button } from "../ui/button";

export default function AcceptCampo({id}:{id:number}) {
    return <Button onClick={() => acceptCampo(id)}>Aceptar</Button>;
}   