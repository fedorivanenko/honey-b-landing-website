import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import Image from "next/image";
import { MenuIcon, X } from "lucide-react";

type menuEl = {
    label: string
    link: string,
    disabled?: boolean
}

const menuData: menuEl[] = [
    { label: 'Home', link: '/'},
    { label: 'Lend', link: '/', disabled: true},
    { label: 'Borrow [Soon]', link: '/', disabled: true},
    { label: 'Loop [Soon]', link: '/', disabled: true},
]

function MenuContent() {
  return (
    <div className="flex flex-col lg:flex-row gap-x-8">
      {menuData.map((item, i) => (
        <Button variant={'link'} size={'inline'} data-disabled={item.disabled} key={i} asChild>
          <Link href={item.link}>{item.label}</Link>
        </Button>
      ))}
    </div>
  );
}

function Menu() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex">
        <MenuContent />
      </div>
      {/* Mobile */}
      <Sheet>
        <SheetTrigger className="ml-auto lg:hidden"><MenuIcon className="h-8 w-8"/></SheetTrigger>
        <SheetContent>
          <SheetClose><X className="h-8 w-8"/></SheetClose>
          <MenuContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

import Logo from '@/components/icons/logo.svg'

function MenuLogo() {
  return (
    <div className="w-24 h-6 text-foreground">
      <Logo />
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 lg:relative lg:mt-12.5 items-center gap-8 z-50">
      <MenuLogo />
      <Menu />
    </header>
  );
}
