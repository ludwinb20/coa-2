"use client";

import { useState } from 'react';
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
import Link from 'next/link';

// Definir el esquema de validación con Yup
const schema = yup.object().shape({
  email: yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
  password: yup.string().min(5, 'La contraseña debe tener al menos 5 caracteres').required('Contraseña es requerida')
})

export const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const hacerlogin = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      const supabase = createClient()
      const { email, password } = data
      const { error: supabaseError, data: authData } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (supabaseError) {
        setError('Error al iniciar sesión: ' + supabaseError.message);
        return;
      }

      if (authData?.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card">
      <CardHeader>
        <CardTitle>Inicio de sesión</CardTitle>
        <CardDescription>Ingresa tu correo y contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(hacerlogin)}>
          {error && (
            <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          <div className="grid w-full gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link 
                href="/register" 
                className="text-primary hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
