import { newLog } from "@/services/salidas";
import { UUID } from "crypto";

export default function NewLog({ id, evento,asset_id,usuario_id }: { id: number, evento: string,asset_id: number,usuario_id: UUID }) {
    newLog(id, evento,asset_id,usuario_id);
}