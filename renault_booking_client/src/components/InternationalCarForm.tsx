"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { createCar, createGuestCar } from "@/services/userService"
import { useNavigate } from "react-router-dom"
import React from "react"
import { toast } from "sonner"

const formSchema = z.object({
  registrationCountry: z.string().min(1),
  plateNumber: z.string().min(1),
  model: z.string().min(1),
  chassisNumber: z.string().min(1),
  internationalInsurance: z.string().min(1),
  registrationCard: z.instanceof(FileList).optional(),
})

type LocalCarFormProps = {
  userId: string | undefined
  onSuccess: (car: any) => void
}

export default function InternationalCarForm( { userId, onSuccess }: LocalCarFormProps ) {
  const fileInputRef1 = useRef<HTMLInputElement>(null)
  const fileInputRef2 = useRef<HTMLInputElement>(null)
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
    const navigate = useNavigate()
    const fileInputRef = React.useRef<HTMLInputElement>(null)
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
          const newCar = await createGuestCar(formData)
          onSuccess(newCar)
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
        } catch (error) {
          console.error("Error creating car:", error)
          toast.error("Failed to create car. Please try again.");
        }
  }

  return (
    <Form {...form}>
      <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mx-30  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <FormField name="registrationCountry" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Pays d'immatriculation</FormLabel>
              <FormControl><Input className="h-13" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="plateNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'immatriculation</FormLabel>
              <FormControl><Input className="h-13" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="model" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel className="mt-5">Modèle</FormLabel>
            <FormControl><Input className="h-13 " {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="chassisNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-5">Numéro de châssis</FormLabel>
              <FormControl><Input className="h-13" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="internationalInsurance" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-5">Assurance internationale</FormLabel>
              <FormControl><Input className="h-13" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField
                  name="registrationCard"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mt-5">Carte grise</FormLabel>
                      <FormControl>
                        <>
                          <input
                            type="file"
                            ref={fileInputRef}
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
                            {field.value?.[0]?.name || "Téléverser un fichier"}
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
        </div>
      </form>
    </Form>
  )
}
