import { CheckCircle } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const location = useLocation()
  const state = location.state as {
    carType?: string
    carData?: any
    center?: string
    service?: string
    date?: Date
    time?: string
  }

  const formattedDate = state?.date
    ? new Date(state.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-4">
      <img src="/logo.png" alt="Renault Logo" className="w-12 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Renault Booking
      </h1>
      <CheckCircle className="text-green-500 w-16 h-16 my-6" />
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Votre rendez-vous a été confirmé !
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Merci d'avoir pris rendez-vous avec Renault. Voici un résumé :
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 text-left w-full max-w-md mb-6">
        {state?.carType && (
          <p>
            <span className="font-semibold">Type de voiture :</span>{" "}
            {state.carType === "local" ? "Locale" : "Étrangère"}
          </p>
        )}
        {state?.carData?.registrationNumber && (
          <p>
            <span className="font-semibold">Numéro d'immatriculation :</span>{" "}
            {state.carData.registrationNumber}
          </p>
        )}
        <p>
          <span className="font-semibold">Centre :</span> {state.center}
        </p>
        <p>
          <span className="font-semibold">Service :</span> {state.service}
        </p>
        <p>
          <span className="font-semibold">Date :</span> {formattedDate}
        </p>
        <p>
          <span className="font-semibold">Heure :</span> {state.time}
        </p>
      </div>

      <div className="flex gap-4">
        <Link to="/">
          <Button variant="outline">Accueil</Button>
        </Link>
        <Link to="/">
          <Button>Prendre un autre rendez-vous</Button>
        </Link>
      </div>
    </div>
  )
}
