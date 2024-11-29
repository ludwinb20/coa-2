"use client";
import { Asset } from "@/types/asset";
import { DataTableAsset } from "./table";
import { columnsAsset } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  asset: Asset[];
};

const AssetIndex = ({ asset }: Props) => {
  const router = useRouter();
  return (
    <div>
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Activos</CardTitle>
        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={() => {
              router.push("/dashboard/asset_Management/create");
            }}
            variant="default"
            size="sm"
          >
            Agregar Activo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTableAsset columns={columnsAsset} data={asset} />
      </CardContent>
    </Card>
    </div>
  );
};

export default AssetIndex;
