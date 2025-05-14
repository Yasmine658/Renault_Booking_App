import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getAllCars } from "@/services/userService"
import { getAllRDVs } from "@/services/adminService"

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Calendar,
  CarFront,
  Home,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import RDVsTab from "./profile/RDVsTab"
import CarsTab from "./profile/CarsTab"
import SettingsTab from "./profile/SettingsTab"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface Car {
  marque: string
  carburant: string
  matricule: string
}

interface RDV {
  type: string
  date: string
  heure: string
}

const menuItems = [
  { title: "Mon profil", value: "profile", icon: UserCircle },
  { title: "Mes RDVs", value: "rdvs", icon: Calendar },
  { title: "Mes Voitures", value: "cars", icon: CarFront },
  { title: "Paramètres", value: "settings", icon: Settings },
  { title: "Déconnexion", value: "logout", icon: LogOut },
]

export default function ProfileLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [selected, setSelected] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [cars, setCars] = useState<Car[]>([])
  const [rdvs, setRdvs] = useState<RDV[]>([])

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    cin: user?.CIN || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.username,
        cin: user.CIN,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })
    }
  }, [user])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get("tab")
    if (tab && menuItems.some(item => item.value === tab)) {
      setSelected(tab)
    }
  }, [location.search])

  useEffect(() => {
    if (!user) {
      navigate("/signin")
      return
    }

    const fetchData = async () => {
      try {
        const [fetchedCars, fetchedRDVs] = await Promise.all([
          getAllCars(user._id),
          getAllRDVs(user._id),
        ])
        setCars(fetchedCars)
        setRdvs(fetchedRDVs)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClick = () => {
    if (isEditing) {
      console.log("Saving profile:", formData)
      // TODO: call update API
    }
    setIsEditing(prev => !prev)
  }

  const handleLogout = () => {
    localStorage.clear()
    toast.success("Déconnexion réussie 👋", {
      description: "Vous avez été déconnecté avec succès.",
      duration: 2000,
    })
    setTimeout(() => {
      navigate("/signin")
    }, 1000)
  }

  const renderProfileForm = () => (
    <>
      <div className="flex items-center mt-10 ml-8 gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://randomuser.me/api/portraits/men/4.jpg" />
          <AvatarFallback>YK</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{formData.fullName}</h2>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
      </div>

      <div className="absolute top-4 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
        <Link to="/">
          <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
        </Link>
      </div>

      <div className="mt-20 lg:ml-70 p-6 lg:w-6xl sm:ml-5 sm:w-xl bg-white">
        <div className="grid grid-cols-1 gap-6">
          {["fullName", "cin", "email", "phoneNumber"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-lg font-medium mb-1">
                {field === "fullName"
                  ? "Nom et prénom"
                  : field === "cin"
                  ? "Numéro CIN"
                  : field === "email"
                  ? "Adresse Email"
                  : "Numéro téléphone"}
              </label>
              <input
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full border rounded-md p-2"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            onClick={handleEditClick}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isEditing ? "Enregistrer" : "Modifier le profil"}
          </Button>
        </div>
      </div>
    </>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-gray-600">Chargement du profil...</p>
        </div>
      )
    }

    switch (selected) {
      case "profile":
        return renderProfileForm()
      case "rdvs":
        return <RDVsTab rdvs={rdvs} />
      case "cars":
        return <CarsTab cars={cars} />
      case "settings":
        return <SettingsTab />
      case "logout":
        handleLogout()
        return <p className="p-6 text-yellow-600 font-semibold">Déconnexion en cours...</p>
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="bg-yellow-100 text-yellow-800">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xl text-yellow-900 mb-10">Menu Profil</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => setSelected(item.value)}
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-yellow-200 transition-colors duration-200 ${
                            selected === item.value ? "bg-yellow-400 font-semibold" : ""
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 bg-white overflow-auto">{renderContent()}</main>
      </div>
    </SidebarProvider>
  )
}
