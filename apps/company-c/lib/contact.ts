import { contact } from "../content/site";
import type { Vehicle } from "../content/vehicles";

/* Every CTA on this site ends in a phone call or a WhatsApp chat.
   There is no cart and no checkout. Retail and wholesale messages are
   worded differently so the team can tell them apart on arrival. */

function waLink(message: string): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** General retail enquiry, used in the nav and page-level CTAs. */
export const whatsappGeneral = waLink(
  "Hi GG Autos, I would like to ask about the mini buses and mini trucks you supply.",
);

/** Names the exact model, so the reply can start with the real answer. */
export function whatsappForVehicle(vehicle: Vehicle): string {
  return waLink(
    `Hi GG Autos, I'm interested in the ${vehicle.brand} ${vehicle.name} listed on your site. Is it available?`,
  );
}

/** For models that are announced but not stocked yet. */
export function whatsappWhenAvailable(vehicle: Vehicle): string {
  return waLink(
    `Hi GG Autos, please let me know when the ${vehicle.name} is available. I would like to be told when it lands.`,
  );
}

/** Wholesale opens with company and volume so it routes to the right desk. */
export const whatsappWholesale = waLink(
  "Hi GG Autos, I'm enquiring about wholesale purchase. Company name: [YOUR COMPANY]. Quantity needed: [HOW MANY]. Preferred model: [MODEL].",
);

export function whatsappWholesaleForVehicle(vehicle: Vehicle): string {
  const qty = vehicle.minWholesaleQty ?? 2;
  return waLink(
    `Hi GG Autos, I'm enquiring about wholesale pricing on the ${vehicle.brand} ${vehicle.name}. Company name: [YOUR COMPANY]. Quantity needed: [${qty} OR MORE].`,
  );
}

/** Coupling / assembly enquiry from the services page. */
export const whatsappAssembly = waLink(
  "Hi GG Autos, I would like to talk about coupling and attachment for a mini bus or mini truck.",
);

export const phoneHref = contact.phoneHref;
export const phoneAltHref = contact.phoneAltHref;
