import { Heading } from "@/components/ui/heading";
import { db } from "@/db/drizzle";
import CreateAssetDialog from "@/app/(index)/asset/_components/create-asset-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isAfter } from "date-fns";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import CheckOutButton from "@/app/(index)/asset/_components/check-out-button";

export default async function Page() {
  const session = await getSession();
  const assets = await db.query.asset.findMany({
    with: {
      issue: {
        orderBy: (issue, { desc }) => [desc(issue.reported_at)],
        limit: 1,
      },
      log: {
        orderBy: (log, { desc }) => [desc(log.checked_out_at)],
        limit: 1,
        with: { user: { columns: { id: true, name: true } } },
      },
    },
  });

  return (
    <main className="grid grid-cols-1 gap-8">
      <Heading className="flex flex-row items-center justify-between">
        Assets
        <CreateAssetDialog />
      </Heading>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Id</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Last Activity</TableHeader>
            <TableHeader>Assigned To</TableHeader>
            <TableHeader>Condition</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>
                {asset.log[0] === undefined
                  ? "-"
                  : isAfter(asset.log[0].checked_in_at ?? 0, asset.log[0].checked_out_at)
                    ? `Returned: ${format(asset.log[0].checked_in_at!, "MMM do yyyy HH:mm")}`
                    : `Checked out: ${format(asset.log[0].checked_out_at, "MMM do yyyy HH:mm")}`}
              </TableCell>
              <TableCell>
                {asset.log[0] === undefined
                  ? "-"
                  : isAfter(asset.log[0].checked_in_at ?? 0, asset.log[0].checked_out_at)
                    ? "-"
                    : asset.log[0].user.name}
              </TableCell>
              <TableCell>{asset.log[0] === undefined ? "-" : asset.log[0].return_condition}</TableCell>
              <TableCell className="w-40">
                {asset.log[0] === undefined ? (
                  <CheckOutButton userId={session!.id} assetId={asset.id} />
                ) : (
                  <Button className="w-full" disabled>
                    Unavailable
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
