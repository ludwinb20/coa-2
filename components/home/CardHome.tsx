'use client'
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { useHome } from "../../hooks/use-home"

export const CardHome = () => {
    const {enviarCodigo, codigo, setcodigo} = useHome();
    return(
        <Card className="bg-secondary text-primary border-transparent w-1/2 rounded-md border">
        <CardHeader>
          <CardTitle>Codigo de seguridad</CardTitle>
          <CardDescription>Por favor introduzca el codigo de seguridad que su proveedor le facilito.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="grid grid-cols-5">
                {/* <Label htmlFor="name">Codigo</Label> */}
                <Input id="codigo" type="text" placeholder="Codigo" className="col-span-4" value={codigo} onChange={(e)=>setcodigo(e.target.value)}/>
                <Button className="col-span-1" onClick={enviarCodigo}>Acceder</Button>
              </div>
            </div>
        </CardContent>
        <CardFooter className="justify-end">
        </CardFooter>
      </Card>
    )
}