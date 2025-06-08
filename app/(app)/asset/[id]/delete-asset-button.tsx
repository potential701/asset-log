"use client";

import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { remove } from "@/app/(app)/asset/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAssetButton({ assetId }: { assetId: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, action, pending] = useActionState(remove, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }

    if (state?.success) {
      toast.success(state.message);
      setIsOpen(false);
    }
  }, [state, router]);

  return (
    <>
      <Button color="red" onClick={() => setIsOpen(true)}>
        Delete asset
      </Button>
      <Alert onClose={setIsOpen} open={isOpen}>
        <AlertTitle>Are you sure you would like to delete this asset?</AlertTitle>
        <AlertDescription>The asset will be deleted forever. Consider decommissioning it instead.</AlertDescription>
        <Form action={action}>
          <Input defaultValue={assetId} name="id" className="hidden" />
          <AlertActions>
            <Button type="button" plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" color="red" disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </AlertActions>
        </Form>
      </Alert>
    </>
  );
}
