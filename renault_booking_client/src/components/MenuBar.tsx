"use client"

import { Link } from "react-router-dom"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenuBar() {
  return (
    <div className="flex items-center justify-between w-full px-6 py-4 shadow-md bg-white">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <p className="text-xl font-bold text-gray-700">Renault Booking</p>
      </div>

      <Menubar className="bg-white border-none shadow-none">

        <MenubarMenu>
          <MenubarTrigger>Prendre RDV</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link to="/international-car">Voiture étrangère</Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/local-car">Voiture locale</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>


        <MenubarMenu>
          <MenubarTrigger>Assistance</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link to="/help-center">Centre d’aide</Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link to="/contact-agent">Contacter un agent</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Mon compte</MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
            <Link to="/signin">Se connecter</Link>
            </MenubarItem>
            <MenubarItem asChild>
            <Link to="/profile">Profil</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
