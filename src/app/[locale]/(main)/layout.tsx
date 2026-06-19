import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBanner from "@/components/TopBanner";

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
      <TopBanner locale={locale} />
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
