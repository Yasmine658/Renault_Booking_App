import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { User } from "lucide-react"

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
import RDVsTab from "./RDVsTab"
import CarsTab from "./CarsTab"
import SettingsTab from "./SettingsTab"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

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
  const [selected, setSelected] = useState("profile")
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    cin: user?.CIN || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.username || "",
        cin: user.CIN || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);
  

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get("tab")
    if (tab && ["profile", "rdvs", "cars", "settings", "logout"].includes(tab)) {
      setSelected(tab)
    }
  }, [location.search])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        await updateUser({
          username: formData.fullName,
          CIN: formData.cin,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        });
      } catch (e) {
        console.error("Update failed", e);
      }
    }
    setIsEditing(!isEditing);
  };
  
  

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
      <div className="flex items-center justify-center ml-50 mt-10 ">
        <div className="flex items-center justify-center flex-col" >
        <Avatar className="w-50 h-50">
          <AvatarImage src="" />
          <AvatarFallback className="flex items-center justify-center w-full h-full">
            <User className="w-30 h-30 text-gray-400" />
          </AvatarFallback>
        </Avatar> 

        <div className="flex items-center justify-center flex-col">
          <h2 className="text-3xl font-bold">{formData.fullName}</h2>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
        </div>
      </div>

      <div className="absolute top-4 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
        <Link to="/">
          <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
        </Link>
      </div>

      <div className="mt-20 lg:ml-70 p-6 lg:w-6xl sm:ml-5 sm:w-xl bg-white">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-lg font-medium mb-1">Nom et prénom</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Numéro CIN</label>
            <input
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Adresse Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Numéro téléphone</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div className="mt-40 flex justify-end">
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
  useEffect(() => {
    if (selected === "logout") {
      handleLogout();
    }
  }, [selected]);
  

  const renderContent = () => {
    switch (selected) {
      case "profile":
        return renderProfileForm()
      case "rdvs":
        return <RDVsTab userId={user?._id} />
      case "cars":
        return user?._id ? <CarsTab userId={user._id} /> : <p>Please log in</p>;
      case "settings":
        return <SettingsTab />
      case "logout":
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
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-yellow-200 transition-colors duration-200 ${selected === item.value ? "bg-yellow-400 font-semibold" : ""}`}
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
