"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createClient } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React from 'react';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
  password: yup.string().min(5, 'La contraseña debe tener al menos 5 caracteres').required('Contraseña es requerida')
});

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const hacerRegistro = async (data: any) => {
    const supabase = createClient();
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({ email, password });

    if (!error) {
      router.push('/login');
    } else {
      console.error('Error al registrarse:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="bg-primary text-secondary border border-transparent w-4/5 max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Crea una cuenta nueva.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(hacerRegistro)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  className="bg-primary" 
                  type="email" 
                  placeholder="email@email.com" 
                  {...register('email')}
                />
                {errors.email && <p className="text-red-600">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  className="bg-primary" 
                  type="password" 
                  placeholder="********" 
                  {...register('password')}
                />
                {errors.password && <p className="text-red-600">{errors.password.message}</p>}
              </div>
            </div>
            <CardFooter className="justify-between mt-4 px-0">
              <Button className="text-primary" variant="outline" type="submit">
                Registrarse
              </Button>
              <div className="text-sm">
                ¿Ya tienes una cuenta? 
                <a href="/login" className="text-blue-500 hover:text-blue-600 ml-1">
                  Inicia sesión
                </a>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};