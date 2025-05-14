import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Building2, Wrench } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import "@/styles/fullcalendar.css"
import { getTunisianHolidays } from "@/lib/tunisianHolidays";

const formSchema = z.object({
  center: z.string().min(1, "Centre requis"),
  date: z.date({ required_error: "Date requise" }),
  time: z.string().min(1, "Heure requise"),
  service: z.string().min(1, "Service requis"),
})

type FormValues = z.infer<typeof formSchema>

interface AppointmentFormProps {
  carId?: string | null
}

export default function AppointmentForm({ carId }: AppointmentFormProps) {  
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [dateError, setDateError] = useState<string>("")

  const currentYear = new Date().getFullYear();
  const holidays = getTunisianHolidays(currentYear);

  const holidayEvents = [
    ...holidays.fixedHolidays.map(holiday => ({
      title: holiday.name,
      date: holiday.date,
      display: 'background',
      color: '#ffebee',
      className: 'holiday'
    })),
    ...holidays.islamicHolidays.map(holiday => ({
      title: holiday.name,
      date: holiday.date,
      display: 'background',
      color: '#e8f5e9',
      className: 'islamic-holiday'
    })),
    ...holidays.schoolVacations.map(vacation => ({
      title: vacation.name,
      start: vacation.start,
      end: vacation.end,
      display: 'background',
      color: '#e3f2fd',
      className: 'school-vacation'
    }))
  ];

  const lunchBreaks = {
    title: 'Pause déjeuner',
    startTime: '12:00',
    endTime: '14:00',
    daysOfWeek: [1, 2, 3, 4, 5, 6], 
    display: 'background',
    color: '#f5f5f5',
    className: 'lunch-break'
  };
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      center: "",
      time: "",
      service: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!selectedDateTime) {
      setDateError("Veuillez sélectionner une date et une heure.")
      return
    }
  
    navigate("/appointment/confirmation", {
      state: {
        ...location.state, 
        date: selectedDateTime,
        center: values.center,
        service: values.service,
        time: selectedDateTime.toLocaleTimeString(),
        
      },
    })
  }
  

  const handleDateClick = (arg: any) => {
    if (arg.start) {
      const selectedDate = new Date(arg.start)
      setSelectedDateTime(selectedDate)
      form.setValue("date", selectedDate)
      form.setValue("time", selectedDate.toLocaleTimeString())
      setDateError("")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl mx-auto"
      >
        <FormField
          control={form.control}
          name="center"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Centre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <Building2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Choisissez un centre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="akouda-garage-meriem">Sousse, Akouda garage Meriem - Route GP1 km9, 4022 Akouda</SelectItem>
                  <SelectItem value="artes-tunis">Tunis, ARTES Tunis - Av kheireddine pacha, 1002 Tunis</SelectItem>
                  <SelectItem value="ben-arous-henchir">Ben Arous, Ben Arous Henchir & cie - av. de la République, 2050 Ben Arous</SelectItem>
                  <SelectItem value="bizerte-auto-service">Bizerte, STE AUTO SERVICE SARL - Av. d'Afrique, 7000 Bizerte</SelectItem>
                  <SelectItem value="djerba-resta">Médenine, Djerba STE RESTA - Av. Salah Ben Youssef, 4180 Djerba</SelectItem>
                  <SelectItem value="ezzahra-saves">Ben Arous, Ezzahra SAVES - GP1 KM12, 2034 Ezzahra</SelectItem>
                  <SelectItem value="gabes-chaabane">Gabès, Gabes ETS Chaabane - Avenue Farhat Hached, 6000 Gabès</SelectItem>
                  <SelectItem value="gafsa-sts">Gafsa, STE STS - Route de Tozeur km4, 2100 Gafsa</SelectItem>
                  <SelectItem value="garage-des-amis">Tunis, Garage des amis - Avenue Ibn Jazzar, 2078 La Marsa</SelectItem>
                  <SelectItem value="hammamet-stpa">Nabeul, Hammamet STPA - Avenue du Koweit & Route Hammam Jedidi, 8050 Hammamet</SelectItem>
                  <SelectItem value="myrage-sfax">Sfax, STE MYRAGE - Rte de Gabès km 2.5, Imm. Rim, 3000 Sfax</SelectItem>
                  <SelectItem value="esa-kelibia">Nabeul, EXPERT SERVICES AUTO E.S.A - Oued Lahjar km4, 8090 Kelibia</SelectItem>
                  <SelectItem value="le-kef-auto">Kef, Dar l’Automobile - Zone industrielle Barnoussa, 7100 Kef</SelectItem>
                  <SelectItem value="medenine-milouchi">Médenine, ETS MILOUCHI MAJID - Route Ben Guerden km2, 4100 Medenine</SelectItem>
                  <SelectItem value="mahdia-auto-scanner">Mahdia, AUTO SCANNER - ROUTE KSOUR ESSEF, 5100 Mahdia</SelectItem>
                  <SelectItem value="monastir-ruspina">Monastir, Ruspina Garage - Avenue Mhamdia Route 6, 5000 Monastir</SelectItem>
                  <SelectItem value="msaken-technocar">Sousse, TECHNOCAR - Route GP1 Km1, 4000 Msaken</SelectItem>
                  <SelectItem value="nabeul-service-auto">Nabeul, STE service auto - Av Grand Maghreb Route Tunis km2, 8000 Nabeul</SelectItem>
                  <SelectItem value="rades-tech-auto">Ben Arous, TECH AUTO - 10 Rue Monji Slim, Rades Plage, 2040 Rades</SelectItem>
                  <SelectItem value="sfax-bouzguenda">Sfax, Bouzguenda - Route de Tunis Km2.5, 3000 Sfax</SelectItem>
                  <SelectItem value="sfax-cotupieces">Sfax, Cotupieces - Route de Gabes km0.5, 3000 Sfax</SelectItem>
                  <SelectItem value="sfax-somaserv">Sfax, SOMASERV - Rue Ibn Battouta, Z.I Madagascar, 3000 Sfax</SelectItem>
                  <SelectItem value="techline-mnihla">Ariana, TECHLINE - Route de Bizerte, 2094 Mnihla</SelectItem>
                  <SelectItem value="best-motors-manouba">Manouba, Best Motors - Route de Mateur, 2021 Oued Ellil</SelectItem>
                  <SelectItem value="techno-motors-kram">Tunis, Techno Motors - 22 Rue Socrate, Z.I Kram, 2015 Tunis</SelectItem>
                  <SelectItem value="start-auto-soukra">Ariana, START AUTO - Rue Jawdat Alhayat, La Soukra Chotrana, 2036 Ariana</SelectItem>
                  <SelectItem value="renault-tcr">Tunis, Agence Renault TCR - Route Mjez Elbeb KM5, Sejoumi 2072 Tunis</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Choisissez un service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="Vidange moteur">Vidange moteur</SelectItem>
                <SelectItem value="Remplacement des filtres">Remplacement des filtres</SelectItem>
                <SelectItem value="Contrôle et remplacement des bougies">Contrôle et remplacement des bougies</SelectItem>
                <SelectItem value="Remise à niveau des liquides">Remise à niveau des liquides</SelectItem>
                <SelectItem value="Contrôle de la batterie">Contrôle de la batterie</SelectItem>
                <SelectItem value="Entretien climatisation">Entretien climatisation</SelectItem>
                <SelectItem value="Contrôle du système de freinage">Contrôle du système de freinage</SelectItem>
                <SelectItem value="Contrôle des pneumatiques">Contrôle des pneumatiques</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Date et Heure</FormLabel>
          <div className="border rounded-md overflow-hidden fullcalendar-container">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            selectable={true}
            selectMirror={true}
            allDaySlot={false}
            slotDuration="00:30:00"
            nowIndicator={true}
            select={handleDateClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            hiddenDays={[0]} 
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6], 
              startTime: '08:00',
              endTime: '18:00',  
            }}
            events={[
              ...holidayEvents,
              {
                title: 'Pause déjeuner',
                startTime: '12:00',
                endTime: '14:00',
                daysOfWeek: [1, 2, 3, 4, 5, 6], 
                display: 'background',
                color: '#f5f5f5',
                className: 'lunch-break'
              }
            ]}
            selectAllow={(selectInfo) => {
              const startHour = selectInfo.start.getHours();
              const isLunchBreak = startHour >= 12 && startHour < 14;
              const dateStr = selectInfo.start.toISOString().split('T')[0];
              
              return !(
                isLunchBreak ||
                holidays.fixedHolidays.some(h => h.date === dateStr) || 
                holidays.islamicHolidays.some(h => h.date === dateStr) 
              );
            }}
            selectConstraint={{
              startTime: '08:00',
              endTime: '18:00',
              daysOfWeek: [1, 2, 3, 4, 5, 6] 
            }}
          />
          </div>
          {dateError && (
            <p className="text-red-500 text-sm mt-2">{dateError}</p>
          )}
        </FormItem>

        

        <div className="pt-8 flex justify-between">
          <Button 
          className="w-50"
          variant="outline" type="button" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button 
          className="w-50"
          type="submit">Suivant</Button>
        </div>
      </form>
    </Form>
  )
}

