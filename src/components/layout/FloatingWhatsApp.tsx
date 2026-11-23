import { MessageCircle } from "lucide-react";
import { getSiteData } from "@/lib/site-data";
import { whatsappLink } from "@/lib/utils";

export async function FloatingWhatsApp() {
  const { contact } = await getSiteData();
  return (
    <a
      href={whatsappLink(contact.whatsapp, contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
