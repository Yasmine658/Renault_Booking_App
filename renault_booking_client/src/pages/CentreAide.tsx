"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MenuBar } from "@/components/MenuBar";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { DropDownMenu } from "@/components/DropDownMenu";

export default function CentreAide() {
  return (
    <>
      <MenuBar/>
      <div className="min-h-screen flex">
      <div
        className="w-1/3 bg-cover bg-center inset-0 opacity-80"
        style={{ backgroundImage: "url('/car2.jpg')" }}
      >
      </div>
      <div className="min-h-screen w-2/3 bg-[#f5f6f8] flex flex-col items-center py-13 ">
      <div className="absolute top-22 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
          <Link to="/">
            <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
          </Link>
      </div>
      <h1 className="text-4xl font-bold text-[#303135] mb-4">Centre d’aide</h1>
      <p className="text-gray-600 mb-6 max-w-3xl text-lg mt-5 mb-15">
        Trouvez des réponses à vos questions les plus fréquentes ou contactez notre support.
      </p>

      <div className="mb-10 w-200">
        <Input placeholder="Rechercher une question..." className="rounded-xl shadow-sm" />
      </div>

      <Accordion type="single" collapsible className="w-200 space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>Comment prendre un rendez-vous ?</AccordionTrigger>
          <AccordionContent>
            Cliquez sur "Prendre RDV" en haut à droite, sélectionnez votre type de voiture et suivez les étapes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Quels documents dois-je fournir ?</AccordionTrigger>
          <AccordionContent>
            Carte grise, assurance (pour les voitures internationales), et numéro de châssis.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Puis-je modifier ou annuler mon RDV ?</AccordionTrigger>
          <AccordionContent>
            Oui, depuis votre espace "Mon compte" → "Mes rendez-vous".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>L’entretien est-il gratuit ?</AccordionTrigger>
          <AccordionContent>
          Certains entretiens sont couverts par la garantie. Sinon, un devis vous sera proposé avant toute intervention.          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>PComment contacter un agent ?</AccordionTrigger>
          <AccordionContent>
          Cliquez sur « Assistance » puis « Contacter un agent » dans le menu. Remplissez le formulaire pour être rappelé rapidement.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-30">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-40 h-13">
          Contacter un agent
        </Button>
      </div>
    </div>
    </div>
    </>
  );
}
