import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, Wrench, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { createGuestRDV, createRDV } from "@/services/userService"

export function ConfirmationCard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { center, date, time, service, carType, carData, carId } = location.state || {}

  
  const handleConfirm = async () => {
    if (!date || !time || !center || !service || !carData) {
      toast.error("Missing required information")
      return
    }
  
      try {
        const rdvData = {
          date: new Date(date).toISOString(),
          time,
          location: center,
          service,
          carModel: carData?.model,
          status: "en attente" as const,
          plateNumber: carType === "international" 
            ? `${carData?.registrationCountry} ${carData?.registrationNumber}`
            : `${carData?.num1}TUN${carData?.num2}`,
            carType,
            carData
        }
  
        if (user?._id) {
          if (!carId) {
            toast.error("Car information missing")
            return
          }
          await createRDV(user._id, carId, rdvData)
        } else {
          if (!carId) {
            toast.error("Car information missing");
            return;
          }
          await createGuestRDV(carId, rdvData);
        }    
        toast.success("RDV créé avec succès")
        navigate("/success", {
        state: {
          carType,
          carData,
          center,
          service,
          date,
          time,
        },
      })
      } catch (error) {
        toast.error("Erreur lors de la création du RDV")
        console.error(error)
      }
    }

  return (
    <>
      <Card className="w-full sm:w-[500px] md:w-[600px] mx-auto my-10">
        <CardHeader>
          <CardTitle>Confirmation</CardTitle>
          <CardDescription>Veuillez vérifier vos information avant de confirmer.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <CalendarDays className="text-red-500 mt-1" />
              <div>
                <p className="font-bold">Date et heure</p>
                <p>{date ? new Date(date).toLocaleString() : "Non définie"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-red-500 mt-1" />
              <div>
                <p className="font-bold">Centre sélectionné</p>
                <p>{center || "Non sélectionné"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wrench className="text-red-500 mt-1" />
              <div>
                <p className="font-bold">Service choisi</p>
                <p>{service || "Non choisi"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="text-red-500 mt-1" />
              <div>
                <p className="font-bold">Véhicule concerné</p>
                {carType === "international" ? (
                  <p>{carData?.model} - {carData?.registrationCountry} {carData?.registrationNumber}</p>
                ) : (
                  <p>{carData?.model} - {carData?.num1} TUN {carData?.num2}</p>
                )}
              </div>
            </div>


          </div>
        </CardContent>

      </Card>

      <div className="mx-95  mt-70 flex flex-col sm:flex-row justify-between gap-3">
        <Button 
        className="w-50"
        variant="outline" 
        onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Button 
          className="bg-yellow-400 hover:bg-yellow-500 text-black w-50" 
          onClick={handleConfirm}>
          Confirmer
        </Button>
      </div>
    </>
  )
}
