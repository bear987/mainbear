/**
 * GG FOODS global site data. Single source for identity, contact and
 * navigation. Phone, WhatsApp and address currently REUSE THE PARENT
 * COMPANY'S details (user-approved) until the restaurant's own are confirmed,
 * swap them in the admin app only.
 *
 * Editable values live in data/site.json. The tel:, wa.me and Google Maps
 * links are built here from the plain number and address, so editing the
 * number updates the link too.
 */
import data from "./data/site.json";

const {
  phoneNumber,
  whatsappNumber,
  whatsappPrefill,
  address: { mapsQuery, ...address },
  ...rest
} = data.site;

export const site = {
  ...rest,

  phone: {
    label: phoneNumber,
    tel: `tel:+234${phoneNumber.replace(/^0/, "")}`,
  },
  whatsapp: {
    number: whatsappNumber,
    href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappPrefill)}`,
  },

  address: {
    ...address,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapsQuery),
  },
};

export type Site = typeof site;
