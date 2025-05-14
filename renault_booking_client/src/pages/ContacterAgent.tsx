"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MenuBar } from "@/components/MenuBar";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function ContacterAgent() {
  return (
    <>
      <MenuBar/>
      <div className="min-h-screen flex">
      <div
        className="w-1/3 bg-cover bg-center inset-0 opacity-80"
        style={{ backgroundImage: "url('/car2.jpg')" }}
      ></div>
      <div className="w-2/3 min-h-screen bg-[#f5f6f8] flex flex-col items-center py-13">
      <div className="absolute top-22 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
          <Link to="/">
            <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
          </Link>
      </div>
      <h1 className="text-4xl font-bold text-[#303135] mb-4">Contacter un agent</h1>
      <p className="text-gray-600 mb-6 max-w-3xl mt-5 text-lg">
        Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
      </p>

      <Card className="w-200 h-150 p-6 bg-white shadow-md rounded-xl flex justify-center mt-17">
        <CardContent className="space-y-5 ">
          <Input placeholder="Votre nom complet" className="h-12" />
          <Input placeholder="Votre adresse email" type="email" className="h-12" />
          <Input placeholder="Objet de votre demande" className="h-12" />
          <Textarea placeholder="Votre message" className="min-h-[170px]" />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full">
            Envoyer le message
          </Button>
        </CardContent>
      </Card>
    </div>
    </div>

    </>
  );
}
