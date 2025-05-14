import { useState, useEffect } from "react"
import { getAllUsers, getAllRDVs, changeRDVStatus } from "../services/adminService"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type User = {
  _id: string
  username: string
  email: string
  cars: { rdvs: any[] }[]
}

type Car = {
  _id: string
  model: string
  userId?: {
    _id: string
    username: string
    email: string
  }
}

type RDV = {
  _id: string
  createdAt: string
  status: "en attente" | "annulé" | "terminé"
  carId?: Car
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [rdvs, setRDVs] = useState<RDV[]>([])

  useEffect(() => {
    fetchUsers()
    fetchRDVs()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users", err)
    }
  }

  const fetchRDVs = async () => {
    try {
      const fetchedRDVs = await getAllRDVs()
      setRDVs(fetchedRDVs)
    } catch (err) {
      console.error("Error fetching RDVs", err)
    }
  }

  // const handleStatusChange = async (rdv: RDV, newStatus: RDV["status"]) => {
  //   if (rdv.carId?.userId) {
  //     await changeRDVStatus(rdv.carId.userId._id, rdv.carId._id, rdv._id, newStatus)
  //     fetchRDVs()
  //   }
  // }
  const handleStatusChange = async (rdv: RDV, newStatus: RDV["status"]) => {
    try {
      await changeRDVStatus(
        rdv.carId?.userId?._id || null, // Pass null for guest appointments
        rdv.carId?._id || "", 
        rdv._id, 
        newStatus
      );
      fetchRDVs(); // Refresh the list after status change
    } catch (err) {
      console.error("Error changing RDV status:", err);
      // Add error toast notification here if you want
    }
  };

  const getStatusColor = (status: RDV["status"]) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-400 text-black"
      case "annulé":
        return "bg-red-500 text-white"
      case "terminé":
        return "bg-green-500 text-white"
      default:
        return ""
    }
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">👥 Users</TabsTrigger>
          <TabsTrigger value="rdvs">📅 Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="grid md:grid-cols-2 gap-4">
            {users.map((user) => (
              <Card key={user._id}>
                <CardContent className="p-4">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm">Cars: {user.cars.length}</p>
                  <p className="text-sm">
                    RDVs:{" "}
                    {user.cars.reduce((acc: number, car) => acc + (car.rdvs?.length ?? 0), 0)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rdvs">
          <div className="space-y-4">
            {rdvs.map((rdv) => (
              <Card key={rdv._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    {rdv.carId?.userId ? (
                      <>
                        <p className="font-semibold">{rdv.carId.userId.username}</p>
                        <p className="text-sm text-muted-foreground">{rdv.carId.userId.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-yellow-600">Invité</p>
                        <p className="text-sm text-muted-foreground">Pas de compte utilisateur</p>
                      </>
                    )}
                  </div>
                  <Badge className={getStatusColor(rdv.status)}>{rdv.status}</Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-xl font-bold">{rdv.carId?.model ?? "Modèle inconnu"}</div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(rdv.createdAt), "dd/MM/yyyy")}
                  </p>
                  {rdv.status === "en attente" && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(rdv, "terminé")}
                      >
                        ✅ Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(rdv, "annulé")}
                      >
                        ❌ Rejeter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
