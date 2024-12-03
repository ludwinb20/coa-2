import { completeCampo } from "@/services/salidas";
import { Button } from "../ui/button";

export default function CompleteCampo({id}:{id:number}) {
    return <Button onClick={() => completeCampo(id)}>Completar</Button>;
}   