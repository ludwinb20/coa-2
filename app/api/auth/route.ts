import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Aquí puedes realizar la lógica de autenticación
  const isAuthenticated = true; // Simulación de autenticación

  if (isAuthenticated) {
    const response = NextResponse.json({ success: true });

    // Establecer una cookie en el lado del servidor
    response.cookies.set('authToken', 'your-auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
} 