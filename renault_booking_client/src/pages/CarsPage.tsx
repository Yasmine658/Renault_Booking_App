import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type Car = {
  id: number;
  name: string;
  model: string;
  year: number;
  status: "available" | "sold";
};

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([
    { id: 1, name: "Peugeot 208", model: "Active", year: 2022, status: "available" },
    { id: 2, name: "Golf GTI", model: "GT", year: 2021, status: "sold" },
    { id: 3, name: "Tesla Model 3", model: "Performance", year: 2023, status: "available" },
  ]);

  const handleDelete = (id: number) => {
    const updatedCars = cars.filter((car) => car.id !== id);
    setCars(updatedCars);
    toast.success("Voiture supprimée avec succès");
  };

  const handleEdit = (id: number) => {
    toast.info(`Modification de la voiture avec l'ID ${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-5 mt-5 text-yellow-700">Vos Voitures</h2>
      <Table className="lg:w-4/5 sm:w-full mx-auto bg-yellow-50 shadow-lg rounded-md">
        <TableCaption>Liste des voitures disponibles et vendues.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Nom</TableHead>
            <TableHead className="text-lg">Modèle</TableHead>
            <TableHead className="text-lg">Année</TableHead>
            <TableHead className="text-lg">Statut</TableHead>
            <TableHead className="text-lg text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id} className="h-12">
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.model}</TableCell>
              <TableCell>{car.year}</TableCell>
              <TableCell>{car.status === "available" ? "Disponible" : "Vendu"}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" className="text-yellow-600 hover:bg-yellow-500" onClick={() => handleEdit(car.id)}>
                  Modifier
                </Button>
                <Button variant="destructive" className="hover:bg-red-600" onClick={() => handleDelete(car.id)}>
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
                Total: {cars.length} voiture(s)
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-end mt-8">
        <Button onClick={() => toast.info("Ajout d'une nouvelle voiture")} className="bg-yellow-600 text-white hover:bg-yellow-700">
          Ajouter une voiture
        </Button>
      </div>
    </div>
  );
}
