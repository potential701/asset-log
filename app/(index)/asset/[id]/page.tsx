import { db } from "@/db/drizzle";
import { and, count, eq } from "drizzle-orm";
import { asset, issue, log } from "@/db/schema";
import { notFound } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Strong, Text } from "@/components/ui/text";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/ui/description-list";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  if (isNaN(parseInt(id))) return notFound();

  const selectedAsset = await db.query.asset.findFirst({ where: eq(asset.id, +id) });
  if (!selectedAsset) return notFound();

  const queryParams = await searchParams;

  const totalLogs = (await db.select({ value: count() }).from(log).where(eq(log.asset_id, +id)))[0];
  const logTableSize = 4;
  const currentPage = queryParams.page ? Math.max(1, +queryParams.page) : 1;
  const totalPages = Math.ceil(totalLogs.value / logTableSize);

  const logs = await db.query.log.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: (log, { desc }) => [desc(log.id)],
    limit: logTableSize,
    offset: (currentPage - 1) * logTableSize,
    where: eq(log.asset_id, +id),
  });

  const issues = await db.query.issue.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: (issue, { desc }) => [desc(issue.id)],
    where: and(eq(issue.asset_id, +id), eq(issue.is_resolved, false)),
  });

  return (
    <main className="grid grid-cols-1 gap-8">
      <header>
        <Heading className="flex flex-row items-center justify-between">{selectedAsset.name}</Heading>
        <Text>
          Serial number: <Strong>{selectedAsset.serial_number}</Strong>
        </Text>
      </header>
      <Divider />
      <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div>
          <Heading level={2}>Asset Information</Heading>
          <DescriptionList>
            <DescriptionTerm>Id</DescriptionTerm>
            <DescriptionDetails>{selectedAsset.id}</DescriptionDetails>

            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>{selectedAsset.name}</DescriptionDetails>

            <DescriptionTerm>Type</DescriptionTerm>
            <DescriptionDetails>{selectedAsset.type}</DescriptionDetails>

            <DescriptionTerm>Serial number</DescriptionTerm>
            <DescriptionDetails>{selectedAsset.serial_number}</DescriptionDetails>

            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>{selectedAsset.status}</DescriptionDetails>

            <DescriptionTerm>Created at</DescriptionTerm>
            <DescriptionDetails>{format(selectedAsset.created_at, "dd/MM/yyyy HH:mm")}</DescriptionDetails>

            <DescriptionTerm>Updated at</DescriptionTerm>
            <DescriptionDetails>
              {selectedAsset.updated_at !== null ? format(selectedAsset.updated_at, "dd/MM/yyyy HH:mm") : "-"}
            </DescriptionDetails>
          </DescriptionList>
        </div>
        {logs.length > 0 && (
          <div>
            <Heading level={2}>Asset Logs</Heading>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Id</TableHeader>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Taken at</TableHeader>
                  <TableHeader>Returned at</TableHeader>
                  <TableHeader>Condition</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.user.name}</TableCell>
                    <TableCell>{format(log.checked_out_at, "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell>
                      {log.checked_in_at !== null ? format(log.checked_in_at, "dd/MM/yyyy HH:mm") : "-"}
                    </TableCell>
                    <TableCell>{log.return_condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalLogs.value > logTableSize && (
              <Pagination className="mt-8">
                <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}` : null} />
                <PaginationList>
                  {/* The first page is always shown */}
                  <PaginationPage href="?page=1" current={currentPage === 1}>
                    1
                  </PaginationPage>

                  {/* Show ellipsis if the current page is far from the start */}
                  {currentPage > 4 && <PaginationGap />}

                  {/* Show pages around the current page */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    // Show pages that are within 1 of the current page (but not the first or last pages)
                    if (
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      pageNumber !== totalPages - 1 &&
                      Math.abs(pageNumber - currentPage) <= 1
                    ) {
                      return (
                        <PaginationPage
                          key={pageNumber}
                          href={`?page=${pageNumber}`}
                          current={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationPage>
                      );
                    }
                    return null;
                  })}

                  {/* Show ellipsis if the current page is far from the end */}
                  {currentPage < totalPages - 3 && <PaginationGap />}

                  {/* Show second-to-last page if total pages > 1 */}
                  {totalPages > 1 && (
                    <PaginationPage href={`?page=${totalPages - 1}`} current={currentPage === totalPages - 1}>
                      {totalPages - 1}
                    </PaginationPage>
                  )}

                  {/* Show last page if total pages > 1 */}
                  {totalPages > 1 && (
                    <PaginationPage href={`?page=${totalPages}`} current={currentPage === totalPages}>
                      {totalPages}
                    </PaginationPage>
                  )}
                </PaginationList>
                <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}` : null} />
              </Pagination>
            )}
          </div>
        )}
      </section>
      <section className="mt-8 grid grid-cols-1 gap-8">
        <Heading level={2}>Issues</Heading>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Id</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Reported at</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Resolved</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>{issue.id}</TableCell>
                <TableCell>{issue.user.name}</TableCell>
                <TableCell>{format(issue.reported_at, "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>{issue.description}</TableCell>
                <TableCell>{issue.is_resolved ? "Yes" : "No"}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
