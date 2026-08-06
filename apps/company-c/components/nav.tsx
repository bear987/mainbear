import { SiteNav } from "@repo/ui/site-nav";
import { navCta, navLinks } from "../content/site";
import { Logo } from "./logo";

/**
 * GG Autos configuration of the shared nav: a full-bleed sticky bar with a
 * hairline rule and zero radius, as the Industrial Brutalist system requires.
 * The component itself stays generic — everything here is a prop.
 */
export function Nav() {
  return (
    <SiteNav
      variant="bar"
      shape="square"
      links={[...navLinks]}
      cta={navCta}
      logo={<Logo />}
      homeAriaLabel="GG Autos, home"
    />
  );
}
