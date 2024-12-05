"use client";


import { useRouter } from "next/navigation";
import { columnsCategory } from "./columns";
import { Events_category } from "@/types/models";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTableCategorys } from "./table";


type Props = {
  categorys: Events_category[];
};

const CategorysIndex = ({ categorys }: Props) => {
  const router = useRouter();
  return (
    <div>
    <Card className="rounded-md border">
      <CardHeader>
        <CardTitle>Categoria</CardTitle>
        <div className="flex justify-end items-center mb-4">
          <Button
            onClick={() => {
              router.push("/dashboard/events/category/create");
            }}
            variant="default"
            size="sm"
          >
            Agregar Categoria
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTableCategorys columns={columnsCategory} data={categorys} />
      </CardContent>
    </Card>
    </div>
  );
};

export default CategorysIndex;
