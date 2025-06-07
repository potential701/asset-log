"use client";

import { useActionState, useEffect } from "react";
import { signup } from "@/app/auth/signup/_actions/signup-actions";
import Form from "next/form";
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { InputError } from "@/components/ui/input-error";
import { Select } from "@/components/ui/select";
import { Role } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Strong, Text, TextLink } from "@/components/ui/text";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toTitleCase } from "@/lib/string";
import { Heading } from "@/components/ui/heading";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.message(state.message);
    }

    if (state?.success) {
      toast.success(state.message);
      router.push("/auth/login");
    }
  }, [router, state]);

  return (
    <Form action={action} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Fieldset className="grid grid-cols-1 gap-8">
        <Legend>
          <Heading>Create your account</Heading>
        </Legend>
        <Field>
          <Label>Name</Label>
          <Input type="text" name="name" />
          <InputError message={state?.errors?.name} />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" />
          <InputError message={state?.errors?.password} />
        </Field>
        <Field>
          <Label>Role</Label>
          <Select name="role">
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {toTitleCase(role)}
              </option>
            ))}
          </Select>
        </Field>
      </Fieldset>
      <Button disabled={pending} type="submit">
        {pending ? "Creating account..." : "Create account"}
      </Button>
      <Text>
        Already have an account?{" "}
        <TextLink href="/auth/login">
          <Strong>Login</Strong>
        </TextLink>
      </Text>
    </Form>
  );
}
