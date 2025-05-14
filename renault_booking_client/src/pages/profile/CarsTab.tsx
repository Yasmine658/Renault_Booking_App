"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableFooter, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import LocalCarForm from "../LocalCarForm"
import InternationalCarForm from "../InternationalCarForm"
import { CarData, createCar, getAllCars } from "@/services/userService"
import { deleteCar } from "@/services/userService"

interface CarsTabProps {
  userId: string 
}

type Car = {
  _id : string;
  model: string;
  plateNumber: string;
  chassisNumber: string;
  carType: "LocalCar" | "InternationalCar";
  registrationCountry?: string; 
  internationalInsurance?: boolean; 
  registrationCard: File ;
};


type CarType = "LocalCar" | "InternationalCar"

export default function CarsTab({ userId }: CarsTabProps) {
  const [cars, setCars] = useState<Car[]>([])
  const [openCarDialog, setOpenCarDialog] = useState<boolean>(false)
  const [selectedCarType, setSelectedCarType] = useState<CarType | null>(null)

  useEffect(() => {
    if (!userId) return
    const fetchCars = async () => {
      try {
        const data = await getAllCars(userId);
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars()
  }, [userId])


const handleDelete = async (carId: string | undefined) => {
  if (!carId || !userId) return;

  try {
    await deleteCar(userId, carId);
    setCars((prev) => prev.filter((car) => car._id !== carId));
    toast.success("Voiture supprimée avec succès");
    
  } catch (error) {
    toast.error("Erreur lors de la suppression de la voiture");
    console.error("Error deleting car:", error);
  }
};


  const handleChoice = (type: CarType) => {
    setSelectedCarType(type)
  }

  const handleAddCar = (createdCar: Car) => {
    if (!userId) {
      toast.error("Utilisateur non identifié")
      return
    }
    setCars((prev) => [...prev, createdCar])
    setOpenCarDialog(false)
    setSelectedCarType(null)
    toast.success("Voiture ajoutée avec succès")
  }
    

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-20 mt-5 text-yellow-700">Mes Véhicules</h2>
      <Table className="w-400 text-xl">
      <TableHeader>
        <TableRow>
          <TableCell className="font-bold text-yellow-900">Type</TableCell>
          <TableCell className="font-bold text-yellow-900">Modèle</TableCell>
          <TableCell className="font-bold text-yellow-900">Immatriculation</TableCell>
          <TableCell className="font-bold text-yellow-900">Numéro de chassis</TableCell> 
          <TableCell className="font-bold text-yellow-900"></TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car._id}>
            <TableCell>{car.carType}</TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.plateNumber}</TableCell>
            <TableCell>{car.chassisNumber}</TableCell>           
            <TableCell className="flex justify-end">
              <Button
                onClick={() => handleDelete(car._id)}
                variant="destructive"
                className=" text-red-100"
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    <span className="text-sm text-muted-foreground">
                      Total: {cars.length} voitures
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
      </Table>

      <div className="flex justify-end mt-8">
        <Button onClick={() => setOpenCarDialog(true)} className="bg-yellow-600 text-white hover:bg-yellow-700 text-lg p-5">
          Ajouter une voiture
        </Button>
      </div>

      <Dialog open={openCarDialog} onOpenChange={(open) => {
        setOpenCarDialog(open)
        if (!open) setSelectedCarType(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              {selectedCarType === null ? "Choisissez le type de voiture" :
                selectedCarType === "LocalCar" ? "Nouvelle voiture locale" : "Nouvelle voiture étrangère"}
            </DialogTitle>
          </DialogHeader>

          {selectedCarType === null ? (
            <div className="flex flex-col gap-5 mt-7">
              <Button variant="outline" className="text-base py-6" onClick={() => handleChoice("LocalCar")}>
                🚗 Nouvelle voiture locale
              </Button>
              <Button variant="outline" className="text-base py-6" onClick={() => handleChoice("InternationalCar")}>
                🌍 Nouvelle voiture étrangère
              </Button>
            </div>
          ) : selectedCarType === "LocalCar" ? (
            <LocalCarForm userId={userId} onSuccess={handleAddCar} />
          ) : (
            <InternationalCarForm userId={userId} onSuccess={handleAddCar} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
