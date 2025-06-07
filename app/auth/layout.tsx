import { AuthLayout as CatalystAuthLayout } from "@/components/ui/auth-layout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <CatalystAuthLayout>{children}</CatalystAuthLayout>;
}
