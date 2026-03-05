import { prisma } from "../utils/prisma"


export const handleIdentity = async (
  email?: string,
  phoneNumber?: string
) => {

  // 1️⃣ Find contacts with same email or phone
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  // 2️⃣ If no contact exists → create primary
  if (contacts.length === 0) {

    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    })

    return {
      primaryContactId: newContact.id,
      emails: [newContact.email],
      phoneNumbers: [newContact.phoneNumber],
      secondaryContactIds: []
    }
  }

  // 3️⃣ Determine primary contact
  let primary = contacts.find(c => c.linkPrecedence === "primary") || contacts[0]

  // 4️⃣ Check if new info exists
  const emailExists = contacts.some(c => c.email === email)
  const phoneExists = contacts.some(c => c.phoneNumber === phoneNumber)

  if (!emailExists || !phoneExists) {

    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    })

  }

  // 5️⃣ Fetch all linked contacts
  const linkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  })

  // 6️⃣ Prepare response
  const emails = [...new Set(linkedContacts.map(c => c.email).filter(Boolean))]
  const phones = [...new Set(linkedContacts.map(c => c.phoneNumber).filter(Boolean))]

  const secondaryIds = linkedContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id)

  return {
    primaryContactId: primary.id,
    emails,
    phoneNumbers: phones,
    secondaryContactIds: secondaryIds
  }
}