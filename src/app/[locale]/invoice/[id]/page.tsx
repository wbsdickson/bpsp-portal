import PublicInvoicePage from "../_components/public-invoice";

const InvoicePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PublicInvoicePage invoiceId={id} />;
};

export default InvoicePage;
