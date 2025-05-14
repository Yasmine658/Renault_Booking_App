import { Home } from "lucide-react"
import { Link } from "react-router-dom"
import { ConfirmationCard } from "@/components/ConfirmationCard"
import { DropDownMenu } from "@/components/DropDownMenu"

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 relative bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url('/car.jpg')` }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center">
          {[
            { step: "Connection", active: false },
            { step: "Informations de la voiture", active: false },
            { step: "Prise du rendez-vous", active: false },
            { step: "Confirmation", active: true },
          ].map((item, index) => (
            <div key={index} className="flex items-start ml-40 gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full ${item.active ? "border-5 border-white" : "bg-white"}`}></div>
                {index !== 3 && <div className="h-24 w-0.5 bg-white"></div>}
              </div>
              <div>
                <p className="text-sm">Étape {index + 1}</p>
                <p className="text-lg font-semibold">{item.step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3 bg-gray-100 p-8 relative">
        <div className="absolute flex top-4 left-2 text-lg font-semibold text-gray-700">
          <img src="/logo.png" alt="Logo" className="w-7 mr-1" />
          Renault Booking
        </div>
        <div className="absolute top-4 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
          <Link to="/">
            <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
          </Link>
          <DropDownMenu />
        </div>
        <h1 className="text-3xl font-bold mt-28 mb-10 text-gray-800 flex items-center justify-center">Confirmation du rendez-vous</h1>
        <ConfirmationCard />
      </div>
    </div>
  )
}
