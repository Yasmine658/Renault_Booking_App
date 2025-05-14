"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { UploadCloud } from "lucide-react"
import React from "react"
import { createCar } from "@/services/userService"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
  registrationCountry: z.string().min(1),
  plateNumber: z.string().min(1),
  model: z.string().min(1),
  chassisNumber: z.string().min(1),
  internationalInsurance: z.string().min(1),
  registrationCard: z.instanceof(FileList).optional(),
})
interface LocalCarFormProps {
  userId: string ;
  onSuccess: (newCar: any) => void;
  source?: 'rdv' | 'cars';
}

export default function InternationalCarForm(
  { userId, 
    onSuccess, 
    source = 'cars' } : LocalCarFormProps) 
 {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationCountry: "",
      plateNumber: "",
      model: "",
      chassisNumber: "",
      internationalInsurance: "",
    },
  })

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  
  const onSubmit = async (data: any) => {
    const formData = new FormData()
    formData.append("carType", "InternationalCar")
    formData.append("registrationCountry", data.registrationCountry)
    formData.append("plateNumber", data.plateNumber)
    formData.append("model", data.model)
    formData.append("chassisNumber", data.chassisNumber)
    formData.append("internationalInsurance", data.internationalInsurance)
    if (data.registrationCard?.[0]) {
      formData.append("registrationCard", data.registrationCard[0])
    }

    try {
      const newCar = await createCar(userId!, formData)
      onSuccess(newCar)
      if (source === 'rdv') {
        navigate(`/appointment?carId=${newCar._id}`, {
          state: {
            carType: "international",
            carData: {
              ...newCar,
              plateNumber: data.plateNumber,
              model: data.model
            },
            carId: newCar._id
          }
        });
      }
    } catch (error) {
      console.error("Error creating car:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="registrationCountry"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays d'immatriculation</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="plateNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro d'immatriculation</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="model"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="chassisNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de châssis</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="internationalInsurance"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assurance internationale</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="registrationCard"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carte grise</FormLabel>
              <FormControl>
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {field.value?.[0]?.name || "Téléverser un fichier"}
                  </Button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          Ajouter
        </Button>
      </form>
    </Form>
  )
}
