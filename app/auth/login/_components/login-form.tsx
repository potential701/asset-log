"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/app/auth/login/_actions/login-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Form from "next/form";
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Strong, Text, TextLink } from "@/components/ui/text";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }

    if (state?.success) {
      toast.success(state.message);
      router.push("/");
    }
  }, [state, router]);

  return (
    <Form action={action} className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Fieldset className="grid grid-cols-1 gap-8">
        <Legend>
          <Heading>Login to your account</Heading>
        </Legend>
        <Field>
          <Label>Name</Label>
          <Input type="text" name="name" />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" />
        </Field>
      </Fieldset>
      <Button disabled={pending} type="submit">
        {pending ? "Logging in..." : "Login"}
      </Button>
      <Text>
        Don&apos;t have an account?{" "}
        <TextLink href="/auth/signup">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </Form>
  );
}
