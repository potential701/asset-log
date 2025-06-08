import { Heading } from "@/components/ui/heading";
import { db } from "@/db/drizzle";
import { asset } from "@/db/schema";
import CreateAssetDialog from "@/app/(index)/asset/_components/create-asset-dialog";

export default async function Page() {
  const assets = await db.select().from(asset);

  return (
    <main className="">
      <Heading className="flex flex-row items-center justify-between">
        Assets
        <CreateAssetDialog />
      </Heading>
      {assets.map((asset) => (
        <div key={asset.id}>{asset.name}</div>
      ))}
    </main>
  );
}
