import { getSession } from "@/lib/session";
import { db } from "@/db/drizzle";
import { count, eq } from "drizzle-orm";
import { asset, issue, log } from "@/db/schema";
import { Heading, Subheading } from "@/components/ui/heading";
import { toFormattedNumber } from "@/lib/string";
import { Divider } from "@/components/ui/divider";

export default async function Home() {
  const session = await getSession();
  const totalAssets = await db.select({ value: count() }).from(asset);
  const totalIssues = await db.select({ value: count() }).from(issue);
  const totalIssuesResolved = await db.select({ value: count() }).from(issue).where(eq(issue.is_resolved, true));
  const totalLogs = await db.select({ value: count() }).from(log);

  return (
    <main className="grid gap-12">
      <Heading>Welcome to Asset Log, {session?.name}</Heading>
      <section className="grid gap-8 lg:grid-cols-4">
        <Subheading className="col-span-full">Overview</Subheading>
        <StatisticsCard title="Total assets" value={totalAssets[0].value} />
        <StatisticsCard title="Total issues" value={totalIssues[0].value} />
        <StatisticsCard title="Total issues resolved" value={totalIssuesResolved[0].value} />
        <StatisticsCard title="Total logs" value={totalLogs[0].value} />
      </section>
    </main>
  );
}

function StatisticsCard({ title, value }: { title: string; value: number }) {
  return (
    <article className="grid gap-4">
      <Divider />
      <Subheading>{title}</Subheading>
      <h4 className="text-4xl">{toFormattedNumber(value)}</h4>
    </article>
  );
}
