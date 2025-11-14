import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

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
        <SheetTrigger className="ml-auto lg:hidden">Open</SheetTrigger>
        <SheetContent>
          <SheetClose>Close</SheetClose>
          <MenuContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 lg:relative items-center gap-8">
      Logo
      <Menu />
    </header>
  );
}
