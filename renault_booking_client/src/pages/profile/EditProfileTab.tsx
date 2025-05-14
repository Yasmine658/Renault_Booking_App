import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditProfileTab() {
  return (
    <form className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">Modifier Profil</h2>
      <Input placeholder="Nom d'utilisateur" />
      <Input placeholder="Email" type="email" />
      <Input placeholder="Téléphone" />
      <Button>Enregistrer</Button>
    </form>
  )
}
