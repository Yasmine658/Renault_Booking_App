"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { UploadCloud } from "lucide-react"
import { createGuestCar } from "@/services/userService"

const formSchema = z.object({
  num1: z.string().min(1),
  num2: z.string().min(1),
  chassisNumber: z.string().min(1),
  model: z.string().min(1),
  registrationCard: z.instanceof(FileList).optional(),
})

interface LocalCarFormProps {
  onSuccess: (newCar: any) => void;
}

export function LocalCarForm( {onSuccess}: LocalCarFormProps ) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      num1: "",
      num2: "",
      chassisNumber: "",
      model: "",
    },
  })

  
  const onSubmit = async (data: any) => {

    const plateNumber = `${data.num1}TUN${data.num2}`
    const formData = new FormData();
    formData.append("model", data.model);
    formData.append("plateNumber", plateNumber);
    formData.append("chassisNumber", data.chassisNumber);
    formData.append("carType", "LocalCar"); 
    if (data.registrationCard?.[0]) {
      formData.append("registrationCard", data.registrationCard[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
          const newCar = await createGuestCar(formData)
          onSuccess(newCar)
          
          
            navigate(`/appointment?carId=${newCar._id}`, {
              state: {
                carType: "local",
                carData: {
                  ...newCar,
                  num1: data.num1,
                  num2: data.num2,
                  model: data.model
                },
                carId: newCar._id
              }
            });
          
          } catch (error) {
            console.error("Error creating car:", error)
          }
      }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 mx-30">
        <div className="flex gap-4 justify-center flex-col">
          <FormLabel>Numéro Immatriculation</FormLabel>
          <div className="flex gap-6 justify-center">
            <FormField
              control={form.control}
              name="num1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-130 h-13" placeholder="999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="pt-2">TUN</FormLabel>
            </FormItem>

            <FormField
              control={form.control}
              name="num2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-130 h-13" placeholder="9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="chassisNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro Châssis</FormLabel>
              <FormControl>
                <Input className="h-13" placeholder="Numéro Châssis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input className="h-13" placeholder="Clio, Megane, Captur..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registrationCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carte Grise</FormLabel>
              <FormControl>
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                  <Button
                    className="h-13"
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {field.value?.[0]?.name || "Choisir un fichier"}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-50 flex justify-between">
          <Button 
          className="w-50 h-10"
          variant="outline" type="button" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button 
          className="w-50 h-10"
          type="submit">Suivant</Button>
        </div>
      </form>
    </Form>
  )
}
