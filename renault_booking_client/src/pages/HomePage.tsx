import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { MenuBar } from "@/components/MenuBar";

type CarType = "local" | "international";

export default function HomePage() {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChoice = (type: CarType) => {
    setOpen(false);
    navigate(type === "local" ? "/local-car" : "/international-car");
  };

  return (
    <>
    <MenuBar/>
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      
      <div className="grid grid-cols-1 lg-grid-cols-2 md:grid-cols-2 items-center gap-10 p-6">
        <div 
        style={{ marginLeft: "90px" , marginRight: "90px" }}
        className="space-y-6 text-center md:text-left ">
          <h1 className="text-5xl md:text-8xl font-bold text-gray-900">
            Prenez soin de votre voiture avec Renault
          </h1>
          <p className="text-gray-900 text-lg" style={{ marginTop: "50px" }}>Bienvenue sur Renault Booking, votre plateforme dédiée à la prise de rendez-vous pour l’entretien de votre véhicule. Que votre voiture soit immatriculée en Tunisie ou à l’étranger, nous vous accompagnons pour un service rapide et efficace.</p>
          <Button
            style={{ marginTop: "30px" ,
                     width: "200px" ,
                     height: "60px" ,
                     fontSize: "20px"
            }}
            onClick={() => setOpen(true)}
          >
            Planifier ma visite
          </Button>
          
        </div>

        <div className="flex justify-center">
          <img
            src="/renault-car.png"
            alt="Renault Car"
            className="w-full"
          />
        </div>
      </div>

      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle className="text-lg text-center">Choisissez le type de votre voiture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 mt-7">
            <Button
              variant="outline"
              className="text-base py-6"
              onClick={() => handleChoice("local")}
            >
              🚗 Voiture Locale
            </Button>
            <Button
              variant="outline"
              className="text-base py-6"
              onClick={() => handleChoice("international")}
            >
              🌍 Voiture Étrangère
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );}