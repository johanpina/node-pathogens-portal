import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedPathogens } from "./seedPathogens";
import { seedCharts } from "./seedCharts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Admin user ──
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@pathogens.cl" },
    update: {},
    create: {
      email: "admin@pathogens.cl",
      password: hashedPassword,
      name: "Admin",
      role: Role.ADMIN,
    },
  });
  console.log("Admin user: admin@pathogens.cl / admin123");

  // ── Settings ──
  const defaultSettings = [
    { key: "site_title", value: "Chile Pathogen Portal" },
    { key: "site_description", value: "National network for open pathogen data science in Chile" },
    { key: "contact_email", value: "contacto@pathogens.cl" },
    { key: "country", value: "Chile" },
    { key: "europepmc_query", value: "pathogen Chile" },
    { key: "twitter_url", value: "" },
    { key: "github_url", value: "" },
    { key: "umami_src", value: "" },
    { key: "umami_website_id", value: "" },
    {
      key: "weekly_prompt",
      value: readFileSync(join(process.cwd(), "prisma", "data", "WEEKLY_PROMPT_ES.md"), "utf-8"),
    },
  ];
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // ── Topics ──
  const topicData = [
    {
      slug: "respiratory-viruses",
      name: "Respiratory Viruses",
      description:
        "Surveillance and genomic data on influenza, SARS-CoV-2, RSV, and other respiratory pathogens circulating in Chile.",
      menuOrder: 1,
    },
    {
      slug: "antimicrobial-resistance",
      name: "Antimicrobial Resistance",
      description:
        "National AMR monitoring including resistance profiles, trends by region, and genomic characterisation of resistant organisms.",
      menuOrder: 2,
    },
    {
      slug: "vector-borne-diseases",
      name: "Vector-borne Diseases",
      description:
        "Epidemiological and entomological data on dengue, hantavirus, Chagas disease, and other vector-borne pathogens.",
      menuOrder: 3,
    },
    {
      slug: "foodborne-pathogens",
      name: "Foodborne Pathogens",
      description:
        "Data on Salmonella, E. coli O157, Listeria, and other food safety-relevant organisms detected through national surveillance.",
      menuOrder: 4,
    },
    {
      slug: "emerging-pathogens",
      name: "Emerging Pathogens",
      description:
        "Early warning signals and genomic data on novel or re-emerging pathogens with potential public health impact in Chile.",
      menuOrder: 5,
    },
  ];

  const topics: Record<string, { id: string }> = {};
  for (const t of topicData) {
    topics[t.slug] = await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, menuOrder: t.menuOrder },
      create: t,
    });
  }
  console.log(`Upserted ${topicData.length} topics`);

  // ── Dashboards ──
  const dashboardData = [
    {
      slug: "covid19-epidemiological-surveillance",
      title: "COVID-19 Epidemiological Surveillance",
      description:
        "Real-time tracking of SARS-CoV-2 cases, hospitalisations, variant prevalence and vaccination coverage across all regions of Chile.",
      redirectUrl: null,
      published: true,
      topicSlugs: ["respiratory-viruses", "emerging-pathogens"],
    },
    {
      slug: "amr-resistance-trends",
      title: "AMR Resistance Trends",
      description:
        "Interactive visualisation of antimicrobial resistance patterns in clinical isolates from sentinel hospitals, broken down by pathogen and antibiotic class.",
      redirectUrl: null,
      published: true,
      topicSlugs: ["antimicrobial-resistance"],
    },
    {
      slug: "influenza-season-tracker",
      title: "Influenza Season Tracker",
      description:
        "Weekly updates on influenza A/B activity, sentinel network data, and phylogenetic cluster analysis of circulating strains.",
      redirectUrl: null,
      published: true,
      topicSlugs: ["respiratory-viruses"],
    },
  ];

  const dashboards: Record<string, { id: string }> = {};
  for (const d of dashboardData) {
    const { topicSlugs, ...data } = d;
    dashboards[d.slug] = await prisma.dashboard.upsert({
      where: { slug: d.slug },
      update: { title: data.title, description: data.description, published: data.published },
      create: data,
    });
    for (const ts of topicSlugs) {
      if (topics[ts]) {
        await prisma.dashboardTopic.upsert({
          where: {
            dashboardId_topicId: { dashboardId: dashboards[d.slug].id, topicId: topics[ts].id },
          },
          update: {},
          create: { dashboardId: dashboards[d.slug].id, topicId: topics[ts].id },
        });
      }
    }
  }
  console.log(`Upserted ${dashboardData.length} dashboards`);

  // ── News ──
  const newsData = [
    {
      slug: "chile-pathogen-portal-launched",
      title: "Chile Pathogen Portal Officially Launched",
      date: new Date("2026-01-15"),
      summary:
        "The Chile Pathogen Portal joins the global Pathogen Data Network, making national surveillance and genomic data openly accessible to researchers and public health professionals.",
      content: `<p>We are pleased to announce the official launch of the <strong>Chile Pathogen Portal</strong>, Chile's national node of the global Pathogen Data Network (PDN).</p>
<p>The portal provides open access to epidemiological surveillance data, genomic sequences, and curated data highlights covering the major pathogens affecting public health in Chile. All data is FAIR-compliant and linked to international repositories including GISAID, NCBI, and EuropePMC.</p>
<h4>What can you find on the portal?</h4>
<ul>
  <li>Interactive dashboards for COVID-19, influenza, and AMR surveillance</li>
  <li>Data highlights linking key findings to published literature</li>
  <li>Curated datasets available for download</li>
  <li>A searchable publication index</li>
</ul>
<p>The portal is a collaborative effort between ISP Chile, the University of Chile, and partner institutions across the country.</p>`,
      published: true,
    },
    {
      slug: "new-sars-cov2-genomic-dataset-released",
      title: "New SARS-CoV-2 Genomic Dataset Released",
      date: new Date("2026-02-10"),
      summary:
        "A curated dataset of 4,200 SARS-CoV-2 whole-genome sequences from Chilean patients (2020–2025) is now available, covering all Pango lineages detected in the country.",
      content: `<p>The Chile Pathogen Portal is releasing a new curated dataset containing <strong>4,200 SARS-CoV-2 whole-genome sequences</strong> collected between March 2020 and December 2025.</p>
<p>The dataset includes metadata on collection date, region of origin, and assigned Pango lineage for each sequence. Quality-filtered assemblies are deposited in GISAID and linked from the portal's dataset catalogue.</p>
<h4>Key statistics</h4>
<ul>
  <li>Sequences from 16 regions of Chile</li>
  <li>127 distinct Pango lineages represented</li>
  <li>Full metadata compliant with INSDC standards</li>
</ul>
<p>To access the dataset, visit the <a href="/datasets">Datasets</a> section or search by keyword on the portal.</p>`,
      published: true,
    },
    {
      slug: "amr-annual-report-2025-key-findings",
      title: "AMR Annual Report 2025: Key Findings",
      date: new Date("2025-12-05"),
      summary:
        "The 2025 national AMR report reveals a 12% increase in carbapenem-resistant Enterobacteriaceae and highlights regional disparities in resistance profiles across Chile.",
      content: `<p>ISP Chile has published the 2025 Annual Report on Antimicrobial Resistance, summarising data from 45 sentinel laboratories across the country.</p>
<p>The report highlights a <strong>12% year-on-year increase</strong> in carbapenem-resistant Enterobacteriaceae (CRE), with the highest rates observed in the Metropolitana, Biobío, and Antofagasta regions.</p>
<h4>Priority organisms</h4>
<ul>
  <li><em>Klebsiella pneumoniae</em> — 34% carbapenem resistance in ICU isolates</li>
  <li><em>Acinetobacter baumannii</em> — 58% carbapenem resistance</li>
  <li><em>E. coli</em> — 22% fluoroquinolone resistance in community samples</li>
</ul>
<p>All resistance data is now available on the <a href="/dashboards/amr-resistance-trends">AMR Resistance Trends dashboard</a>.</p>`,
      published: true,
    },
    {
      slug: "partnership-with-paho-genomic-surveillance",
      title: "Partnership with PAHO to Strengthen Genomic Surveillance",
      date: new Date("2025-11-20"),
      summary:
        "Chile joins PAHO's regional genomic surveillance network, enabling real-time data sharing and bioinformatics capacity building across Latin America.",
      content: `<p>The Chile Pathogen Portal has formalised a collaboration with the <strong>Pan American Health Organization (PAHO)</strong> to integrate Chilean surveillance data into the regional SARS-CoV-2 and influenza genomic networks.</p>
<p>Under the agreement, Chilean sequence data will flow automatically to PAHO's regional dashboard, enabling comparative analyses with neighbouring countries and early detection of cross-border transmission events.</p>
<p>The partnership also includes a 12-month bioinformatics training programme for laboratory personnel at five regional public health laboratories.</p>`,
      published: true,
    },
    {
      slug: "updated-data-sharing-protocol-clinical-isolates",
      title: "Updated Data Sharing Protocol for Clinical Isolates",
      date: new Date("2025-10-01"),
      summary:
        "New guidelines for submitting clinical pathogen sequences to the portal streamline the process and align with INSDC and GISAID submission standards.",
      content: `<p>The Chile Pathogen Portal has updated its <strong>data submission protocol</strong> for clinical isolate sequences. The revised guidelines simplify the metadata requirements while ensuring compliance with INSDC and GISAID standards.</p>
<h4>What has changed?</h4>
<ul>
  <li>Minimum required metadata fields reduced from 28 to 18</li>
  <li>New automated validation tool available via the portal's API</li>
  <li>Direct submission pathway to NCBI and GISAID from the portal interface</li>
</ul>
<p>Submitting laboratories should update their templates before 1 January 2026. Contact <a href="/contact">our team</a> for support.</p>`,
      published: true,
    },
  ];

  for (const n of newsData) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: { title: n.title, summary: n.summary, date: n.date, content: n.content, published: n.published },
      create: n,
    });
  }
  console.log(`Upserted ${newsData.length} news items`);

  // ── Highlights ──
  const highlightData = [
    {
      slug: "winter-rsv-surge-peaks-earlier",
      title: "Winter RSV Surge Peaks Three Weeks Earlier than Average",
      date: new Date("2025-06-15"),
      summary:
        "RSV hospitalisations in children under 2 peaked 3 weeks earlier than the 5-year average, suggesting a shift in transmission dynamics linked to post-pandemic immune debt.",
      content: `<p>Analysis of sentinel hospital data from June 2025 reveals that <strong>Respiratory Syncytial Virus (RSV)</strong> hospitalisations in children under 2 years of age peaked on week 23, three weeks earlier than the 2019–2023 average.</p>
<p>The phenomenon is consistent with the "immune debt" hypothesis, whereby reduced natural exposure during the pandemic years led to a larger susceptible population entering the 2025 winter season.</p>
<h4>Key data points</h4>
<ul>
  <li>Peak incidence: 48 hospitalisations per 100,000 children under 2 (week 23)</li>
  <li>5-year average peak: 42 per 100,000 (week 26)</li>
  <li>RSV-A genotype GA5 accounted for 73% of sequenced samples</li>
</ul>
<h4>Publication</h4>
<p>DOI: <a href="#">10.1000/example.2025.rsv</a></p>
<p>Citation: Martínez P, González L, Araya C et al. (2025). <em>Temporal shift in RSV seasonality in Chile following the COVID-19 pandemic</em>. Chilean Journal of Infectious Diseases, 42(3), 214–221.</p>`,
      published: true,
      tags: ["RSV", "respiratory", "seasonality"],
      topicSlugs: ["respiratory-viruses"],
    },
    {
      slug: "carbapenem-resistant-klebsiella-three-regions",
      title: "Carbapenem-resistant Klebsiella Detected Across Three Regions",
      date: new Date("2025-09-10"),
      summary:
        "Whole-genome sequencing reveals a clonal outbreak of NDM-1-producing Klebsiella pneumoniae ST258 spreading across tertiary hospitals in Metropolitana, Biobío, and Antofagasta.",
      content: `<p>Genomic surveillance has identified a clonal outbreak of <strong>NDM-1-producing <em>Klebsiella pneumoniae</em> ST258</strong> across tertiary care hospitals in three Chilean regions.</p>
<p>Core genome MLST analysis confirmed 97.4% similarity among 38 isolates collected between March and August 2025, indicating sustained nosocomial transmission.</p>
<h4>Affected facilities</h4>
<ul>
  <li>Región Metropolitana — 21 isolates (3 hospitals)</li>
  <li>Región del Biobío — 11 isolates (2 hospitals)</li>
  <li>Región de Antofagasta — 6 isolates (1 hospital)</li>
</ul>
<p>IPC interventions are in place. All sequences are deposited in NCBI under BioProject PRJNA000000.</p>
<h4>Publication</h4>
<p>DOI: <a href="#">10.1000/example.2025.amr</a></p>
<p>Citation: Rojas F, Vega A et al. (2025). <em>Clonal dissemination of NDM-1 Klebsiella pneumoniae in Chilean tertiary hospitals</em>. Journal of Hospital Infection, 155, 88–94.</p>`,
      published: true,
      tags: ["AMR", "Klebsiella", "outbreak"],
      topicSlugs: ["antimicrobial-resistance"],
    },
    {
      slug: "autochthonous-dengue-arica-parinacota",
      title: "Autochthonous Dengue Confirmed in Arica y Parinacota",
      date: new Date("2025-11-20"),
      summary:
        "For the first time, locally-acquired dengue virus serotype 2 cases are confirmed in Chile's northernmost region, linked to established Aedes aegypti populations near the Bolivian border.",
      content: `<p>Chilean health authorities have confirmed <strong>12 autochthonous dengue cases</strong> in the Arica y Parinacota region — the first locally-acquired dengue transmission recorded on Chilean territory.</p>
<p>Phylogenetic analysis of DENV-2 sequences shows close relatedness to strains currently circulating in southern Bolivia, suggesting introduction via cross-border movement.</p>
<h4>Entomological context</h4>
<ul>
  <li><em>Aedes aegypti</em> populations confirmed in Arica urban area since 2020</li>
  <li>Breteau index: 18.4 (threshold for epidemic risk: 5)</li>
  <li>No <em>Aedes albopictus</em> detected</li>
</ul>
<p>SEREMI Health is conducting vector control activities. Clinicians should consider dengue in patients with febrile illness from northern Chile.</p>
<h4>Publication</h4>
<p>DOI: <a href="#">10.1000/example.2025.dengue</a></p>
<p>Citation: Fuentes C, Morales D et al. (2025). <em>First autochthonous dengue transmission in Chile: virological and epidemiological investigation</em>. Emerging Infectious Diseases, 31(12), 2401–2408.</p>`,
      published: true,
      tags: ["dengue", "vector-borne", "outbreak"],
      topicSlugs: ["vector-borne-diseases", "emerging-pathogens"],
    },
  ];

  for (const h of highlightData) {
    const { topicSlugs, ...data } = h;
    const highlight = await prisma.highlight.upsert({
      where: { slug: h.slug },
      update: {
        title: data.title,
        summary: data.summary,
        date: data.date,
        content: data.content,
        published: data.published,
        tags: data.tags,
      },
      create: data,
    });
    for (const ts of topicSlugs) {
      if (topics[ts]) {
        await prisma.highlightTopic.upsert({
          where: {
            highlightId_topicId: { highlightId: highlight.id, topicId: topics[ts].id },
          },
          update: {},
          create: { highlightId: highlight.id, topicId: topics[ts].id },
        });
      }
    }
  }
  console.log(`Upserted ${highlightData.length} highlights`);

  // ── Events ──
  const eventData = [
    {
      id: "event-workshop-genomics-2026",
      title: "Workshop on Genomic Surveillance for Public Health Laboratories",
      type: "Workshop",
      dateStart: new Date("2026-04-15T09:00:00"),
      timeStart: "09:00",
      dateEnd: new Date("2026-04-17T17:00:00"),
      timeEnd: "17:00",
      venue: "ISP Chile, Santiago",
      organisers: "ISP Chile / Chile Pathogen Portal",
      eventUrl: "https://examplelink.com/workshop-genomics-2026",
      description:
        "A 3-day hands-on workshop covering whole-genome sequencing workflows, bioinformatics pipelines, and data submission to international repositories. Open to public health laboratory staff.",
    },
    {
      id: "event-paho-amr-meeting-2026",
      title: "PAHO Regional Meeting on Antimicrobial Resistance Surveillance",
      type: "Conference",
      dateStart: new Date("2026-06-10T10:00:00"),
      timeStart: "10:00",
      dateEnd: new Date("2026-06-11T18:00:00"),
      timeEnd: "18:00",
      venue: "Virtual (Zoom)",
      organisers: "PAHO / RELAVRA Network",
      eventUrl: "https://examplelink.com/paho-amr-2026",
      description:
        "Regional meeting to review AMR surveillance data from Latin America, discuss harmonisation of methodology, and plan joint activities for 2026–2027.",
    },
    {
      id: "event-pdn-summit-2025",
      title: "Latin American Pathogen Data Network Summit",
      type: "Conference",
      dateStart: new Date("2025-11-05T09:00:00"),
      timeStart: "09:00",
      dateEnd: new Date("2025-11-07T17:00:00"),
      timeEnd: "17:00",
      venue: "Hotel Plaza, Santiago",
      organisers: "Pathogen Data Network / ISP Chile",
      eventUrl: "https://examplelink.com/pdnsummit-2025",
      description:
        "Annual summit bringing together representatives from national portal nodes across Latin America to share experiences, align data standards, and plan collaborative activities.",
    },
    {
      id: "event-bioinformatics-training-2025",
      title: "Bioinformatics for Clinical Laboratories",
      type: "Training",
      dateStart: new Date("2025-08-20T09:00:00"),
      timeStart: "09:00",
      dateEnd: new Date("2025-08-22T17:00:00"),
      timeEnd: "17:00",
      venue: "Universidad de Chile, Valparaíso",
      organisers: "University of Chile / PAHO",
      eventUrl: "https://examplelink.com/bioinformatics-training-2025",
      description:
        "Introductory bioinformatics training targeting clinical laboratory professionals. Covers sequence QC, alignment, variant calling, and basic phylogenetics. No prior computational experience required.",
    },
  ];

  for (const e of eventData) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: {
        title: e.title,
        description: e.description,
        dateStart: e.dateStart,
        venue: e.venue,
        organisers: e.organisers,
      },
      create: e,
    });
  }
  console.log(`Upserted ${eventData.length} events`);

  // ── Pathogen surveillance (ported weekly bundle) ──
  await seedPathogens();

  // ── Pathogen charts (historical Chart.js dashboards) ──
  await seedCharts();

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
