"use client";

import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { createClient } from '@/utils/supabase/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSession } from "@/app/session-provider"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getValidSubdomain } from '@/utils/multi-tenant';

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
  password: yup.string().min(5, 'La contraseña debe tener al menos 5 caracteres').required('Contraseña es requerida')
})

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { user } = useSession();
  const router = useRouter();
  console.log(user)
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const { subdomain, baseDomain } = getValidSubdomain(window.location.host);

    if (!subdomain) {
      console.log('No hay subdominio');
      router.push('/'); // Redirige a la página principal
      return;
    }
  }, [router]);

  const hacerlogin = async (data: any) => {
    const supabase = createClient()
    const { email, password } = data
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error) {
      window.location.reload()
    } else {
      console.error('Error al iniciar sesión:', error.message);
    }
  }

  return (
    <Card className="bg-primary text-secondary border border-transparent w-4/5">
      <CardHeader>
        <CardTitle>Inicio de sesión</CardTitle>
        <CardDescription>Ingresa tu correo y contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(hacerlogin)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Correo electronico</Label>
              <Input id="email" className="bg-primary" type="email" placeholder="email@email.com" {...register('email')}/>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" className="bg-primary" type="password" placeholder="********" {...register('password')}/>
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
          </div>
          <CardFooter className="justify-end mt-4">
            <Button className="text-primary" variant="outline" type="submit">Login</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
