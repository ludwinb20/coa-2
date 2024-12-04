"use client";
import QRCodeGenerator from "@/components/qr/qr";
export default function QRPage() {
   return (
       <div className="">
         <QRCodeGenerator text="Texto para el código QR" />
       </div>
   );}
