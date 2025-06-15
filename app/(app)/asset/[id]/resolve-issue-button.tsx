"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { resolve } from "@/app/(app)/asset/actions";
import { toast } from "sonner";

export default function ResolveIssueButton({ issueId, assetId }: { issueId: number; assetId: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [state, action, pending] = useActionState(resolve, undefined);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <Button color="green" onClick={() => setIsOpen(true)}>
        Resolve
      </Button>
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Are you sure you would like to resolve this issue?</AlertTitle>
        <AlertDescription>The issue will be resolved and the asset will become available.</AlertDescription>
        <Form action={action}>
          <Input defaultValue={issueId} name="id" className="hidden" />
          <Input defaultValue={assetId} name="asset_id" className="hidden" />
          <AlertActions>
            <Button plain type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="green" type="submit">
              {pending ? "Resolving..." : "Resolve"}
            </Button>
          </AlertActions>
        </Form>
      </Alert>
    </>
  );
}
