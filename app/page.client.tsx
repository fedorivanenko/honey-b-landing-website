"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { contactFormSchema } from "@/db/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function ContactForm() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organization: "",
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof contactFormSchema>) {}

  return (
    <form
      className="flex flex-col border border-border space-y-4 rounded-2xl p-8.5 max-w-xl"
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
      <Button type="submit" className="h-16 mt-7 text-base rounded-2xl">
        Submit
      </Button>
    </form>
  );
}

export { ContactForm };
