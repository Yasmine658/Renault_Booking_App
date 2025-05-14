"use client"

import { useEffect, useState } from "react"
import { z } from "zod"; 
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import authService from "@/services/authService"
import { getAllCars , getAllRDV , createCar } from "@/services/userService"
import { useAuth } from "@/hooks/useAuth"
import LocalCarForm from "../LocalCarForm"
import InternationalCarForm from "../InternationalCarForm"
import { deleteRDV, editRDV } from "@/services/userService"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Building2, Wrench } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import "@/styles/fullcalendar.css"
import { Label } from "@/components/ui/label"
import { changeRDVStatus } from "@/services/adminService";

interface RDVsTabProps {
  userId?: string
}

type CarType = "local" | "international" | "existing"

type RDV = {
  location: any
  service: any
  _id?: string
  date: string
  time: string
  carModel: string
  status: "en attente" | "terminé" | "annulé"
  carId?: string
}

const formSchema = z.object({
  center: z.string().min(1, "Centre requis"),
  service: z.string().min(1, "Service requis"),
  date: z.date({ required_error: "Date requise" }),
  time: z.string().min(1, "Heure requise"),
});

type FormValues = z.infer<typeof formSchema>;

const formatPlateNumber = (car: any) => {
  if (!car) return 'N/A';
  if (car.plateNumber) return car.plateNumber;
  if (car.num1 && car.num2) return `${car.num1}TUN${car.num2}`;
  return 'N/A';
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'UTC'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function RDVsTab({ userId: propUserId }: RDVsTabProps) {
  const [appointments, setAppointments] = useState<RDV[]>([])
  const [userId, setUserId] = useState<string | null>(propUserId ?? null)
  const [openCarDialog, setOpenCarDialog] = useState(false)
  const [carChoice, setCarChoice] = useState<CarType | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedRDV, setSelectedRDV] = useState<RDV | null>(null)
  const [cars, setCars] = useState<any[]>([]);
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const [selectedCarObject, setSelectedCarObject] = useState<any | null>(null)
  const [openRDVDialog, setOpenRDVDialog] = useState(false)
  const [carForRDV, setCarForRDV] = useState<any | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        const user = await authService.getCurrentUser()
        if (user?._id) setUserId(user._id)
      }
    }
    fetchUser()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const userCars = await getAllCars(userId)
        const userRDVs = await getAllRDV(userId)
        setCars(userCars)
        setAppointments(userRDVs)
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
      }
    }

    fetchData()
  }, [userId])

  const handleDelete = async (rdvId: string | undefined) => {
    if (!rdvId || !userId ) return

    try {
      const rdvToCancel = appointments.find(rdv => rdv._id === rdvId);
    if (!rdvToCancel || !rdvToCancel.carId) {
      toast.error("Impossible de trouver les détails du RDV");
      return;
    }
    await changeRDVStatus(
      userId, 
      rdvToCancel.carId, 
      rdvId, 
      "annulé"
    );
      setAppointments((prev) => prev.filter((rdv) => rdv._id !== rdvId))
      toast.success("RDV supprimé avec succès")
    } catch (err) {
      toast.error("Erreur lors de la suppression du RDV")
      console.error("Delete error:", err)
    }
  }

  const handleEdit = (rdv: RDV) => {
    setSelectedRDV(rdv)
    const rdvDate = new Date(rdv.date)
    setSelectedDateTime(rdvDate)
    setOpenEditDialog(true)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      center: "",
      service: "",
      time: "",
      date: new Date(),
    },
  })

  useEffect(() => {
    if (selectedRDV) {
      form.reset({
        center: selectedRDV.location,
        service: selectedRDV.service,
        time: new Date(selectedRDV.date).toLocaleTimeString(),
        date: new Date(selectedRDV.date),
      })
    }
  }, [selectedRDV, form])

  const handleEditSubmit = async (values: FormValues) => {
    if (!selectedRDV || !selectedRDV._id || !selectedRDV.carId || !userId) return;
  
    try {
      const updated = await editRDV(userId, selectedRDV.carId, selectedRDV._id, {
        date: values.date.toISOString(),
        location: values.center,
        service: values.service,
        status: selectedRDV.status,
      });
  
      setAppointments((prev) =>
        prev.map((rdv) => (rdv._id === updated._id ? updated : rdv))
      );
      toast.success("RDV modifié avec succès");
      setOpenEditDialog(false);
      setSelectedRDV(null);
    } catch (err) {
      toast.error("Erreur lors de la modification du RDV");
      console.error(err);
    }
  };

  const handleDateClick = (arg: any) => {
    if (arg.start) {
      const selectedDate = new Date(arg.start)
      setSelectedDateTime(selectedDate)
      form.setValue("date", selectedDate)
      form.setValue("time", selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
  }

  useEffect(() => {
    console.log("Appointments data:", appointments);
  }, [appointments]);

  
  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-20 mt-5 text-yellow-700">Mes RDVs</h2>

      <Table className="w-400 text-xl">
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold text-yellow-900">Date</TableCell>
            <TableCell className="font-bold text-yellow-900">Heure</TableCell>
            <TableCell className="font-bold text-yellow-900">Voiture</TableCell>
            <TableCell className="font-bold text-yellow-900">Immatriculation</TableCell>
            <TableCell className="font-bold text-yellow-900">Centre</TableCell>
            <TableCell className="font-bold text-yellow-900">Service</TableCell>
            <TableCell className="font-bold text-yellow-900">Statut</TableCell>
            <TableCell className="font-bold text-yellow-900 text-center"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((rdv) => {
            const car = cars.find(c => c._id === rdv.carId);
            const rdvDate = new Date(rdv.date);
            const formattedDate = rdvDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const formattedTime = rdvDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <TableRow key={rdv._id}>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{formattedTime}</TableCell>
                <TableCell>{rdv.carModel || car?.model || "Modèle inconnu"}</TableCell>
                <TableCell>{formatPlateNumber(car)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{rdv.location}</TableCell>
                <TableCell className="max-w-[200px] truncate">{rdv.service}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rdv.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                    rdv.status === 'terminé' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rdv.status}
                  </span>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleEdit(rdv)}>Modifier</Button>
                  <Button variant="destructive" onClick={() => handleDelete(rdv._id)}>Supprimer</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>


        <TableFooter> 
          <TableRow>
            <TableCell colSpan={8}>
              <span className="text-sm text-muted-foreground">
                Total: {appointments.length} rendez-vous
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-end mt-8">
        <Button
          variant="secondary"
          onClick={() => setOpenCarDialog(true)}
          className="bg-yellow-600 text-white hover:bg-yellow-700 text-lg p-5"
        >
          Ajouter un RDV
        </Button>
      </div>

      <Dialog open={openCarDialog && !carChoice} onOpenChange={setOpenCarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              Choisissez le type de votre voiture
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 mt-7">
            <Button variant="outline" className="text-base py-6" onClick={() => setCarChoice("local")}>
              🚗 Nouvelle voiture locale
            </Button>
            <Button variant="outline" className="text-base py-6" onClick={() => setCarChoice("international")}>
              🌍 Nouvelle voiture étrangère
            </Button>
            <Button variant="outline" className="text-base py-6" onClick={() => setCarChoice("existing")}>
              🚙 Une de vos voitures
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!carChoice} onOpenChange={() => { setCarChoice(null); setOpenCarDialog(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {carChoice === "local" ? "Nouvelle voiture locale" : carChoice === "international" ? "Nouvelle voiture étrangère" : "RDV pour voiture existante"}
            </DialogTitle>
          </DialogHeader>
          {carChoice === "local" && (
              <LocalCarForm
                userId={userId!}
                onSuccess={(newCar) => {
                  setCars((prev) => [...prev, newCar])
                  setCarForRDV(newCar)
                  setOpenCarDialog(false)
                  setOpenRDVDialog(true)
                }}
                source="rdv"
              />
            )}
            {carChoice === "international" && (
            <InternationalCarForm
              userId={userId!}
              onSuccess={(newCar) => {
                setCars((prev) => [...prev, newCar])
                setCarForRDV(newCar)
                setOpenCarDialog(false)
                setOpenRDVDialog(true)
              }}      
              source="rdv"        
            />
          )}
          {carChoice === "existing" && (
            <div className="flex flex-col gap-4 mt-4">
              <Label>Choisissez une voiture</Label>
              <select
                className="border rounded p-2"
                onChange={(e) => {
                  const carId = e.target.value
                  const car = cars.find((c: any) => c._id === carId)
                  setSelectedCarId(carId)
                  setSelectedCarObject(car || null)

                  console.log("Selected car ID:", carId)
                  console.log("Selected car object:", car)

                  setSelectedRDV((prev) => ({
                    ...prev!,
                    carId,
                    carModel: car?.model || "",
                    date: prev?.date || "",
                    time: prev?.time || "",
                    location: prev?.location || "",
                    service: prev?.service || "",
                    status: prev?.status || "en attente"
                  }))
                }}
              >
                <option value="">-- Sélectionner --</option>
                {cars.map((car: any) => (
                  <option key={car._id} value={car._id}>
                    {car.model} - {formatPlateNumber(car)}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => {
                  if (!selectedCarId) {
                    toast.error("Veuillez sélectionner une voiture")
                    return
                  }
                  navigate(`/appointment?carId=${selectedCarId}`, {
                    state: {
                      carType: "existing",
                      carData: selectedCarObject,
                      carId: selectedCarId
                    }
                  })
                }}
                className="bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Prendre RDV
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Modifier le RDV</DialogTitle>
          </DialogHeader>
          {selectedRDV && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="center"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centre</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <Building2 className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Choisissez un centre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="akouda-garage-meriem">Sousse, Akouda garage Meriem</SelectItem>
                            <SelectItem value="artes-tunis">Tunis, ARTES Tunis</SelectItem>
                            <SelectItem value="ben-arous-henchir">Ben Arous, Ben Arous Henchir</SelectItem>
                            <SelectItem value="bizerte-auto-service">Bizerte, STE AUTO SERVICE SARL</SelectItem>
                            <SelectItem value="djerba-resta">Médenine, Djerba STE RESTA</SelectItem>
                            <SelectItem value="ezzahra-saves">Ben Arous, Ezzahra SAVES</SelectItem>
                            <SelectItem value="gabes-chaabane">Gabès, Gabes ETS Chaabane</SelectItem>
                            <SelectItem value="gafsa-sts">Gafsa, STE STS</SelectItem>
                            <SelectItem value="garage-des-amis">Tunis, Garage des amis</SelectItem>
                            <SelectItem value="hammamet-stpa">Nabeul, Hammamet STPA</SelectItem>
                            <SelectItem value="myrage-sfax">Sfax, STE MYRAGE</SelectItem>
                            <SelectItem value="esa-kelibia">Nabeul, EXPERT SERVICES AUTO E.S.A</SelectItem>
                            <SelectItem value="le-kef-auto">Kef, Dar l'Automobile</SelectItem>
                            <SelectItem value="medenine-milouchi">Médenine, ETS MILOUCHI MAJID</SelectItem>
                            <SelectItem value="mahdia-auto-scanner">Mahdia, AUTO SCANNER</SelectItem>
                            <SelectItem value="monastir-ruspina">Monastir, Ruspina Garage</SelectItem>
                            <SelectItem value="msaken-technocar">Sousse, TECHNOCAR</SelectItem>
                            <SelectItem value="nabeul-service-auto">Nabeul, STE service auto</SelectItem>
                            <SelectItem value="rades-tech-auto">Ben Arous, TECH AUTO</SelectItem>
                            <SelectItem value="sfax-bouzguenda">Sfax, Bouzguenda</SelectItem>
                            <SelectItem value="sfax-cotupieces">Sfax, Cotupieces</SelectItem>
                            <SelectItem value="sfax-somaserv">Sfax, SOMASERV</SelectItem>
                            <SelectItem value="techline-mnihla">Ariana, TECHLINE</SelectItem>
                            <SelectItem value="best-motors-manouba">Manouba, Best Motors</SelectItem>
                            <SelectItem value="techno-motors-kram">Tunis, Techno Motors</SelectItem>
                            <SelectItem value="start-auto-soukra">Ariana, START AUTO</SelectItem>
                            <SelectItem value="renault-tcr">Tunis, Agence Renault TCR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <Wrench className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Choisissez un service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Vidange moteur">Vidange moteur</SelectItem>
                            <SelectItem value="Remplacement des filtres">Remplacement des filtres</SelectItem>
                            <SelectItem value="Contrôle et remplacement des bougies">Contrôle et remplacement des bougies</SelectItem>
                            <SelectItem value="Remise à niveau des liquides">Remise à niveau des liquides</SelectItem>
                            <SelectItem value="Contrôle de la batterie">Contrôle de la batterie</SelectItem>
                            <SelectItem value="Entretien climatisation">Entretien climatisation</SelectItem>
                            <SelectItem value="Contrôle du système de freinage">Contrôle du système de freinage</SelectItem>
                            <SelectItem value="Contrôle des pneumatiques">Contrôle des pneumatiques</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormItem>
                  <FormLabel>Date et Heure</FormLabel>
                  <div className="border rounded-md overflow-hidden fullcalendar-container">
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      selectable={true}
                      selectMirror={true}
                      allDaySlot={false}
                      slotDuration="00:30:00"
                      nowIndicator={true}
                      select={handleDateClick}
                      initialDate={selectedDateTime || undefined}
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay'
                      }}
                      height="auto"
                      slotMinTime="08:00:00"
                      slotMaxTime="18:00:00"
                      businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5, 6], 
                        startTime: '08:00',
                        endTime: '18:00',
                      }}
                    />
                  </div>
                  {form.formState.errors.date && (
                    <p className="text-red-500 text-sm mt-2">{form.formState.errors.date.message}</p>
                  )}
                </FormItem>

                <DialogFooter>
                  <Button 
                    type="submit"
                    className="bg-yellow-600 text-white hover:bg-yellow-700"
                  >
                    Enregistrer les modifications
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}