/**
 * About page content. PLACEHOLDER copy in the brand's voice, swap freely.
 * The kitchen lead is presented by role (no invented named individuals);
 * replace with the real chef's name, photo and bio when available.
 */

export const about = {
  hero: {
    eyebrow: "Our story",
    title: "Two kitchens, one standard.",
    lede: "GG FOODS cooks the food we grew up on and the food we fell for abroad, side by side, with no shortcuts in either.",
  },

  story: [
    "GG FOODS started with a simple frustration: in Lagos you could find good Nigerian food or good intercontinental food, but rarely both under one roof, cooked with the same seriousness. So we built one kitchen that refuses to choose.",
    "Our jollof is cooked low and smoky the way party jollof should be, and our salmon is grilled with the same care you would expect from a hotel kitchen. Smoothies and fruit drinks are blended in-house from fresh fruit, never from concentrate.",
    "We are part of the GG BEARERS group, which means the same rule that governs the group's trade business governs our kitchen: integrity first. If it is not fresh, it does not leave the pass.",
  ],

  kitchen: {
    title: "The kitchen",
    lede: "Led by our head chef and a small team that treats every plate as a signature.",
    roles: [
      {
        role: "Head Chef",
        focus:
          "Sets the menu and holds every dish, Nigerian or intercontinental, to the same standard.",
      },
      {
        role: "Grill Chef",
        focus: "Owns the open flame: suya, ribs, chicken and the smoky base of our jollof.",
      },
      {
        role: "Juice & Smoothie Lead",
        focus: "Blends every smoothie and natural fruit drink fresh, to order, daily.",
      },
    ],
  },

  values: [
    {
      title: "Fresh, every day",
      body: "We shop the market daily. What is not fresh does not get cooked, and what is not finished is not served tomorrow.",
    },
    {
      title: "Both kitchens, full respect",
      body: "Nigerian classics are not a side hustle here and intercontinental dishes are not decoration. Both get the full craft.",
    },
    {
      title: "Made to order",
      body: "Your food is fired when you order it. It takes a few minutes longer and tastes like it.",
    },
  ],
} as const;
