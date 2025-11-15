"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { contactPayloadSchema, ContactPayload } from "@/lib/contact";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";

function ContactForm() {
  const form = useForm<ContactPayload>({
    mode: "onChange",
    resolver: zodResolver(contactPayloadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organization: "",
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ContactPayload) {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        organization: data.organization,
        message: data.message?.trim() || undefined,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to submit form");
      }

      form.reset();
      toast("Thanks! We’ll be in touch shortly.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast(message);
      form.reset(data);
    }
  }

  return (
    <form
      className="flex flex-col border border-border space-y-4 rounded-2xl p-6.5 sm:p-8.5 max-w-xl w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="fullName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="w-full flex justify-between">
              <FieldLabel htmlFor="form-rhf-demo-title">Full Name</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
            <Input
              {...field}
              id="form-full-name"
              aria-invalid={fieldState.invalid}
              placeholder="John Doe"
              autoComplete="off"
              required
              minLength={1}
              maxLength={255}
            />
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="w-full flex justify-between">
              <FieldLabel htmlFor="form-email">E-mail</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
            <Input
              {...field}
              id="form-email"
              aria-invalid={fieldState.invalid}
              placeholder="john@acme.com"
              autoComplete="off"
              required
              minLength={1}
              maxLength={255}
            />
          </Field>
        )}
      />
      <Controller
        name="organization"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="w-full flex justify-between">
              <FieldLabel htmlFor="form-org">Organization</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
            <Input
              {...field}
              value={field.value ?? ""}
              id="form-org"
              aria-invalid={fieldState.invalid}
              placeholder="Acme inc."
              autoComplete="off"
              required
              minLength={1}
              maxLength={255}
            />
          </Field>
        )}
      />
      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="w-full flex justify-between">
              <FieldLabel htmlFor="form-message">Message</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id="form-message"
              aria-invalid={fieldState.invalid}
              placeholder="How can we help you?"
              autoComplete="off"
              className="h-24"
              maxLength={2000}
            />
          </Field>
        )}
      />
      <Button
        type="submit"
        className="h-16 mt-7 text-base rounded-2xl cursor-pointer transition-color duration-250"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

import { Copy } from "lucide-react";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText("contact@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      onClick={copy} 
      variant={'secondary'}
      className="w-58 cursor-copy"
    >
      {copied ? "Copied!" : <><Copy />contact@example.com</>}
    </Button>
  );
}

type AddHoverStateProps = {
  id: string
}

function AddHoverState({ id }: AddHoverStateProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pointerHoverRef = useRef(false);
  const centerHoverRef = useRef(false);
  const { scrollY } = useScroll();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const updateHoverState = useCallback(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const isHovering = pointerHoverRef.current || centerHoverRef.current;
    el.setAttribute("data-hover", isHovering ? "true" : "false");
  }, [id]);

  const handleEnter = () => {
    pointerHoverRef.current = true;
    updateHoverState();
  };

  const handleLeave = () => {
    pointerHoverRef.current = false;
    updateHoverState();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 512px)");

    const applyMatch = (matches: boolean) => {
      setIsSmallScreen(matches);

      if (!matches && centerHoverRef.current) {
        centerHoverRef.current = false;
        updateHoverState();
      }
    };

    applyMatch(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyMatch(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [updateHoverState]);

  useEffect(() => {
    if (!isSmallScreen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const centerY = window.innerHeight / 2;

    const overlapsCenter =
      rect.top <= centerY && rect.bottom >= centerY;

    if (centerHoverRef.current !== overlapsCenter) {
      centerHoverRef.current = overlapsCenter;
      updateHoverState();
    }
  }, [isSmallScreen, scrollY, updateHoverState]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-10 cursor-pointer pointer-events-auto select-none"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={(e) => e.stopPropagation()}
    />
  )
}


export { ContactForm, CopyEmail, AddHoverState };
