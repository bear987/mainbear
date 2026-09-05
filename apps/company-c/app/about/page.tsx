import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@repo/ui/reveal";
import { PageHeader, breadcrumbSchema } from "../../components/page-header";
import { Section, SectionHead, RegistrationMarks } from "../../components/section";
import {
  about,
  groupBand,
  mission,
  stats,
  story,
  team,
  values,
  whatWeDo,
} from "../../content/about";
import { contact, group, site } from "../../content/site";
import { whatsappGeneral } from "../../lib/contact";
import { sequence } from "../../lib/format";

export const metadata: Metadata = {
  title: "About GG Autos, Mini Bus Assembly in Lagos",
  description:
    "GG Autos couples, sells and distributes mini buses from Okota, Lagos, as the automotive arm of the GG Bearers group. A workshop first, a showroom second.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${site.name}`,
    description: about.standfirst,
    url: `${site.url}/about`,
  },
};

const crumbs = [{ label: "About", href: "/about" }];
import { sectionsFor } from "../../lib/layout";

export default function AboutPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        label={about.label}
        title={about.title}
        crumbs={crumbs}
        intro={about.standfirst}
      />
    ),

    section2: (
      <Section space="loose">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHead label={story.label} title={story.title} />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <div className="space-y-6">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="max-w-[62ch] text-[1.05rem] leading-relaxed text-fg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    ),

    /* MISSION. The statement carries at display scale; the commitments sit under it as a ruled ledger so the section reads as a pledge. */
    section3: (
      <Section tone="ink" space="loose">
        <Reveal>
          <SectionHead label={mission.label} title={mission.title} size="xl" />
        </Reveal>

        <ul className="mt-14 border-t border-line">
          {mission.points.map((point, index) => (
            <Reveal key={point} delay={index * 80}>
              <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[4rem_1fr] md:gap-8">
                <span aria-hidden className="stamp pt-1.5 text-action-600">
                  &mdash;
                </span>
                <p className="max-w-[62ch] text-[1.15rem] leading-relaxed text-[#cfcdc7]">
                  {point}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>
    ),

    /* WHAT WE DO. Two jobs running in parallel, so paired cells rather than a numbered sequence. */
    section4: (
      <Section rules>
        <Reveal>
          <SectionHead
            label={whatWeDo.label}
            title={whatWeDo.title}
            align="split"
            intro="Importing, clearing and building are not separate departments here. The same yard does all of it."
          />
        </Reveal>

        <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
          {whatWeDo.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 90}>
              <div className="h-full bg-paper p-8">
                <h3 className="text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight">
                  {point.title}
                </h3>
                <p className="mt-4 max-w-[42ch] text-fg">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    /* Stats stay visibly unfilled rather than being invented. */
    section5: (
      <Section tone="tint" space="tight">
        <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const pending = stat.value.startsWith("[");
            return (
              <div key={stat.label} className="bg-highlight px-6 py-8">
                <dt className="stamp">{stat.label}</dt>
                <dd
                  className={`tnum mt-3 leading-none tracking-[-0.03em] ${
                    pending
                      ? "text-sm font-normal text-muted"
                      : "text-[clamp(2rem,4vw,3rem)] font-semibold text-heading"
                  }`}
                >
                  {stat.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>
    ),

    section6: (
      <Section rules>
        <Reveal>
          <SectionHead
            label="What we hold to"
            title="Four things we do not bend on"
            align="split"
            intro="Not slogans. Each one costs us something, which is how you know it is real."
          />
        </Reveal>
        <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 70}>
              <div className="h-full bg-paper p-8">
                <span className="stamp tnum text-action-600">{sequence(index)}</span>
                <h3 className="mt-4 text-[1.25rem] leading-tight">{value.title}</h3>
                <p className="mt-3 max-w-[52ch] text-fg">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    /* Roles, not invented people. */
    section7: (
      <Section tone="tint">
        <Reveal>
          <SectionHead
            label="Who you deal with"
            title="The people on the yard"
            align="split"
            intro="Names and photographs go here once the team is ready to be listed. The roles are real and each one is a person you will actually speak to."
          />
        </Reveal>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.role} className="relative bg-highlight p-6">
              <div className="relative flex aspect-square items-center justify-center border border-dashed border-line-strong">
                <div aria-hidden className="grid-rules-fine absolute inset-0 opacity-50" />
                <span className="stamp relative text-line-strong">[ADD PHOTO]</span>
              </div>
              <h3 className="mt-5 text-[1.1rem] leading-tight">{member.role}</h3>
              <p className="mt-2 text-sm text-fg">{member.remit}</p>
              <p className="stamp mt-3">[ADD NAME]</p>
            </div>
          ))}
        </div>
      </Section>
    ),

    section8: (
      <Section tone="ink" space="loose">
        <div className="relative grid gap-10 lg:grid-cols-12">
          <RegistrationMarks className="-m-4 hidden lg:block" />
          <div className="lg:col-span-7">
            <span className="stamp border-l-2 border-action-500 pl-3">{groupBand.label}</span>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.4rem)]">{groupBand.title}</h2>
            <p className="mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-[#cfcdc7]">
              {groupBand.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={group.parent.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#f3f1ec]/50 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
              >
                Visit {group.parent.name}
              </a>
              <a
                href={group.sibling.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#f3f1ec]/50 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
              >
                Visit {group.sibling.name}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <dl className="border-t border-line">
              {[
                ["Yard", `${contact.address.area}, ${contact.address.city}`],
                ["Group", group.parent.name],
                ["Sibling company", `${group.sibling.name}, ${group.sibling.description}`],
                ["Trading as", "Coupling, retail and wholesale of mini buses"],
              ].map(([term, value]) => (
                <div key={term} className="border-b border-line py-4">
                  <dt className="stamp">{term}</dt>
                  <dd className="mt-1 text-[#cfcdc7]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>
    ),

    section9: (
      <Section space="tight">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="stamp">Come and see</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)]">
              The yard is open six days a week
            </h2>
            <p className="mt-4 max-w-[52ch] text-fg">
              {contact.address.street}, {contact.address.landmark}, {contact.address.area}.
              Bring your mechanic.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link
              href="/contact"
              data-cta
              data-cta-section="about_footer"
              className="border border-ink bg-ink px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-all duration-150 ease-[var(--ease-quint)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift"
            >
              Directions and hours
            </Link>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
            >
              Message the yard
            </a>
          </div>
        </div>
      </Section>
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {sectionsFor("about").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
