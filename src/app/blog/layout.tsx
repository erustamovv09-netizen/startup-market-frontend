import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | StartUp Market",
  description: "IT Startaplar, biznes oldi-sotdisi va so'nggi tendensiyalar haqida maqolalar.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
