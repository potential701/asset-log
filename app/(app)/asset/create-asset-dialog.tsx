"use client";

import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { create } from "@/app/(app)/asset/actions";
import Form from "next/form";
import { Field, Fieldset, Label, Legend } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AssetStatus, AssetType } from "@/lib/enums";
import { toTitleCase } from "@/lib/string";
import { toast } from "sonner";
import { InputError } from "@/components/ui/input-error";

export default function CreateAssetDialog() {
  const [state, action, pending] = useActionState(create, undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }

    if (state?.success) {
      toast.success(state.message);
      setIsOpen(false);
    }
  }, [state]);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Add asset
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add a new asset</DialogTitle>
        <DialogDescription>Newly created assets will be available on the assets page.</DialogDescription>
        <DialogBody>
          <Form action={action} className="grid grid-cols-1 gap-8">
            <Fieldset className="grid grid-cols-1 gap-8">
              <Legend className="sr-only">New asset</Legend>
              <Field>
                <Label>Name</Label>
                <Input type="text" name="name" />
                <InputError message={state?.errors?.name} />
              </Field>
              <Field>
                <Label>Serial number</Label>
                <Input type="text" name="serial_number" />
                <InputError message={state?.errors?.serial_number} />
              </Field>
              <Field>
                <Label>Type</Label>
                <Select name="type">
                  {Object.values(AssetType).map((type) => (
                    <option key={type} value={type}>
                      {toTitleCase(type)}
                    </option>
                  ))}
                </Select>
                <InputError message={state?.errors?.type} />
              </Field>
              <Field>
                <Label>Status</Label>
                <Select name="status">
                  {Object.values(AssetStatus).map((status) => (
                    <option key={status} value={status}>
                      {toTitleCase(status)}
                    </option>
                  ))}
                </Select>
                <InputError message={state?.errors?.status} />
              </Field>
            </Fieldset>
            <DialogActions>
              <Button plain type="button" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  );
}
