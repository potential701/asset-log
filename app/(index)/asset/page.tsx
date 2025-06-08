import { Heading } from "@/components/ui/heading";
import { db } from "@/db/drizzle";
import CreateAssetDialog from "@/app/(index)/asset/_components/create-asset-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isAfter } from "date-fns";
import { getSession } from "@/lib/session";
import CheckOutButton from "@/app/(index)/asset/_components/check-out-button";
import { AssetStatus } from "@/lib/enums";
import ReturnAssetDialog from "@/app/(index)/asset/_components/return-asset-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/lib/string";

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
    orderBy: (asset, { asc }) => [asc(asset.id)],
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
              <TableCell>{toTitleCase(asset.type)}</TableCell>
              <TableCell>
                <StatusBadge status={asset.status} />
              </TableCell>
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
              <TableCell>{toTitleCase(asset.log[0] === undefined ? "-" : asset.log[0].return_condition)}</TableCell>
              <TableCell className="w-40">
                <ActionButton
                  userId={session!.id}
                  assetId={asset.id}
                  logId={asset.log[0]?.id}
                  assetStatus={asset.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

function ActionButton({
  userId,
  assetId,
  logId,
  assetStatus,
}: {
  userId: number;
  assetId: number;
  logId: number;
  assetStatus: AssetStatus;
}) {
  switch (assetStatus) {
    case AssetStatus.AVAILABLE:
      return <CheckOutButton userId={userId} assetId={assetId} />;
    case AssetStatus.BUSY:
      return <ReturnAssetDialog logId={logId} />;
    default:
      return (
        <Button plain disabled className="w-full">
          Unavailable
        </Button>
      );
  }
}

function StatusBadge({ status }: { status: AssetStatus }) {
  switch (status) {
    case AssetStatus.AVAILABLE:
      return <Badge color="green">Available</Badge>;
    case AssetStatus.BUSY:
      return <Badge color="blue">Busy</Badge>;
    case AssetStatus.MAINTENANCE:
      return <Badge color="amber">Maintenance</Badge>;
    default:
      return <Badge color="red">{status}</Badge>;
  }
}
