"use client";

import { useActionState, useEffect } from "react";
import { checkOut } from "@/app/(app)/asset/actions";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckOutButton({ userId, assetId }: { userId: number; assetId: number }) {
  const [state, action, pending] = useActionState(checkOut, undefined);

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }

    if (state?.success) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <>
      <Form action={action}>
        <Input defaultValue={userId} name="user_id" className="hidden" />
        <Input defaultValue={assetId} name="asset_id" className="hidden" />
        <Button type="submit" outline disabled={pending} className="w-full">
          {pending ? "Checking out..." : "Check out"}
        </Button>
      </Form>
    </>
  );
}
