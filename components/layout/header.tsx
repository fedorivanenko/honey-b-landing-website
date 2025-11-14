import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

function MenuContent() {
  return <div>Menu Content</div>;
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
        <SheetTrigger>Open</SheetTrigger>
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
    <header className="justify-between">
      Logo
      <Menu />
    </header>
  );
}
