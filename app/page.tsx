import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./page.client";

function HeroImage(){

  const panelNumber = 11

  return (
    <div className="h-full w-full py-[20%] lg:py-[15%] px-[20%] lg:px-0 relative">
      <div className="h-full aspect-square mx-auto bg-accent-step-1 rounded-full"/>
      <div className="absolute inset-0 z-10 flex divide-background/32 divide-x">
      {Array.from({ length: panelNumber }).map((_, i) => (
        <div key={i} className="box-border bg-background/16 w-full h-full backdrop-blur-[36px]"/>
      ))}
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <Section className="lg:h-[86dvh] lg:flex-row gap-10">
      <div className="mx-auto lg:mx-0 w-fit flex flex-col text-center lg:text-left lg:mt-20">
        <h1 className="mb-6 whitespace-nowrap">
          <em>Honey</em> from
          <br />
          hard money
        </h1>
        <p className="text-lg-minus sm:text-lg-plus mb-7 w-0 min-w-full">
          Put your Bitcoin to work
        </p>
        <div className="w-[75dvw] mx-auto lg:hidden mb-7">
          <HeroImage/>
        </div>
        <p className="mb-9 w-0 min-w-full px-10 sm:px-[15%] lg:px-0">
          Earn institutional-grade yield, powered by Bitcoin <span className="whitespace-nowrap">and real-world</span>
          assets.
        </p>
        <div className="flex space-x-4 w-0 min-w-full justify-center lg:justify-start">
          <Button>Request Access</Button>
          <Button variant={"secondary"}>Contact</Button>
        </div>
      <div className="mt-auto">

      </div>
      </div>
      <div className="hidden lg:block max-w-[75dvw] h-full ml-auto">
        <HeroImage/>
      </div>
    </Section>
  );
}

function ContactSection() {
  return (
    <Section className="mb-80">
      <ContactForm/>
    </Section>
  )
}

export default function Home() {
  return (
    <article>
      <HeroSection />
      <ContactSection/>
    </article>
  );
}
