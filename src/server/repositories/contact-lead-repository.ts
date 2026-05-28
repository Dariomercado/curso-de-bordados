import { prisma } from "@/lib/db/prisma";
import type { ContactLeadInput } from "@/lib/validations/contact-lead";

export async function createContactLead(data: ContactLeadInput) {
  return prisma.contactLead.create({
    data,
  });
}
