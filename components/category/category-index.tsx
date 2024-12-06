"use client";
import { Category } from "@/types/models";
import { Asset } from "@/types/asset";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { columnsCategory } from "./columns";
import { DataTableCategory } from "./table";

type Props = {
  categorys: Category[];
};

const CategoryIndex = ({ categorys }: Props) => {
  const router = useRouter();
  return (
    <div>
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Categoria</CardTitle>
        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={() => {
              router.push("/dashboard/category/create");
            }}
            variant="default"
            size="sm"
          >
            Agregar Categoria
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTableCategory columns={columnsCategory} data={categorys} />
      </CardContent>
    </Card>
    </div>
  );
};

export default CategoryIndex;
