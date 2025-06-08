"use client";

import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { checkIn } from "@/app/(app)/asset/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Description, Field, Fieldset, Label, Legend } from "@/components/ui/fieldset";
import { Select } from "@/components/ui/select";
import { AssetCondition } from "@/lib/enums";
import { toTitleCase } from "@/lib/string";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InputError } from "@/components/ui/input-error";

export default function ReturnAssetDialog({ logId }: { logId: number }) {
  const [state, action, pending] = useActionState(checkIn, undefined);
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
      <Button type="button" onClick={() => setIsOpen(true)} className="w-full">
        Return
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Return an asset</DialogTitle>
        <DialogDescription>
          Please select the condition of the asset. If there are any problems with the asset, please describe them.
        </DialogDescription>
        <DialogBody>
          <Form action={action} className="grid grid-cols-1 gap-8">
            <Fieldset className="grid grid-cols-1 gap-8">
              <Legend className="sr-only">Return asset</Legend>
              <Input defaultValue={logId} name="id" className="hidden"></Input>
              <Field>
                <Label>Condition</Label>
                <Select name="return_condition">
                  {Object.values(AssetCondition).map((condition) => (
                    <option key={condition} value={condition}>
                      {toTitleCase(condition)}
                    </option>
                  ))}
                </Select>
                <InputError message={state?.errors?.return_condition} />
              </Field>
              <Field>
                <Label>Description</Label>
                <Description>Leave empty if there are no problems to report</Description>
                <Textarea name="description" />
                <InputError message={state?.errors?.description} />
              </Field>
            </Fieldset>
            <DialogActions>
              <Button plain type="button" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Returning..." : "Return"}
              </Button>
            </DialogActions>
          </Form>
        </DialogBody>
      </Dialog>
    </>
  );
}
