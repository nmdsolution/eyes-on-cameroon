import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
