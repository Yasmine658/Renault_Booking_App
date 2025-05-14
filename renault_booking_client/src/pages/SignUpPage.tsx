import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { DropDownMenu } from "@/components/DropDownMenu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner"; 

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CIN: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signup(formData);
    toast.success("Compte créé avec succès !");
    navigate("/signin");
  } catch (err: any) {
    console.error("Signup error:", err);
    if (err.response?.status === 409) {
      toast.error("Un utilisateur avec ce CIN, email ou nom existe déjà.");
    } else {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  }
};


  return (
    <div className="flex min-h-screen">
      <div className="w-1/3 relative bg-black text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url('/car.jpg')` }}
        />
        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
          {[
            { step: "Étape 1", label: "Connection", active: true },
            { step: "Étape 2", label: "Informations de la voiture", active: false },
            { step: "Étape 3", label: "Prise du rendez-vous", active: false },
            { step: "Étape 4", label: "Confirmation", active: false },
          ].map((item, index) => (
            <div key={index} className="flex items-start ml-20 gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full ${item.active ? "border-5 border-white" : "bg-white"}`} />
                {index !== 3 && <div className="h-22 w-0.5 bg-white" />}
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
          Renault Booking
        </div>
        <div className="absolute top-4 right-6 flex items-center gap-4 text-gray-500 hover:text-gray-700 cursor-pointer">
          <Link to="/">
            <Home className="w-5 h-5 hover:text-yellow-500 transition-colors" />
          </Link>
          <DropDownMenu />
        </div>
        <h1 className="text-3xl font-bold mb-6 mt-30 text-gray-800 mb-20 flex justify-center">Créer un compte</h1>
        <form onSubmit={handleSignUp} className="mx-80 mt-30 space-y-4">
          <Input name="CIN" placeholder="CIN" value={formData.CIN} onChange={handleChange} required />
          <Input name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
          <Input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
          <Input name="phoneNumber" placeholder="Téléphone" value={formData.phoneNumber} onChange={handleChange} required />
          <Input name="password" placeholder="Mot de passe" type="password" value={formData.password} onChange={handleChange} required />
          <Button className="w-full mt-30">S’inscrire</Button>
        </form>
      </div>
    </div>
  );
}
