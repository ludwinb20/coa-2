"use client";
import QRCodeGenerator from "@/components/qr/qr";
export default function Clients() {
   return (
       <div className="p-6">
         <QRCodeGenerator text="Texto para el código QR" />
       </div>
   );}
