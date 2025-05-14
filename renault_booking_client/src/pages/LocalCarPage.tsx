import { Home } from "lucide-react"
import { Link } from "react-router-dom"
import {LocalCarForm} from "@/components/LocalCarForm"
import { DropDownMenu } from "@/components/DropDownMenu"

const handleSuccess = (newCar: any) => {
  console.log("New car created:", newCar)
}
export default function LocalCarPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 relative bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url('/car.jpg')` }}
        />
        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
          {[
            { step: "Étape 1", label: "Connection", active: false },
            { step: "Étape 2", label: "Informations de la voiture", active: true },
            { step: "Étape 3", label: "Prise du rendez-vous", active: false },
            { step: "Étape 4", label: "Confirmation", active: false },
          ].map((item, index) => (
            <div key={index} className="flex items-start ml-20 gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full  ${item.active ? "border-5 border-white" : "bg-white"}`}></div>
                {index !== 3 && <div className="h-22 w-0.5 bg-white"></div>}
              </div>
              <div>
                <p className="text-sm">{item.step}</p>
                <p className="text-lg font-semibold">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="w-2/3 bg-gray-100 p-8 relative">
        <div className="absolute flex top-4 left-2 text-lg font-semibold text-gray-700">
        <img src="/logo.png" alt="Logo" className="w-7 mr-1" />

            Renault Booking</div>
        <div className="absolute top-4 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
          <Link to="/">
            <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
          </Link>
          <DropDownMenu />
        </div>
        <h1 className="text-3xl font-bold mb-6 mt-30 text-gray-800 mb-20 ml-30">Voiture Locale</h1>
        <LocalCarForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
