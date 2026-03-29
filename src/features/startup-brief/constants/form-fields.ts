import type { StartupBrief } from "@/types/launch";

export type FormSection = {
  id: string;
  label: string;
  number: string;
};

export type FieldDef = {
  key: keyof StartupBrief;
  label: string;
  placeholder: string;
  hint: string;
  section: string;
  type: "input" | "textarea" | "select";
  required: boolean;
};

export type IndexedFieldDef = FieldDef & { stepNumber: number };

export type SectionWithFields = FormSection & { fields: IndexedFieldDef[] };

export const FORM_SECTIONS: FormSection[] = [
  { id: "identity", label: "Identity", number: "01" },
  { id: "audience", label: "Audience", number: "02" },
  { id: "outcome", label: "Outcome", number: "03" },
];

const FORM_FIELDS: FieldDef[] = [
  {
    key: "companyName",
    label: "Company Name",
    placeholder: "Acme Labs",
    hint: "The legal or brand name of your company",
    section: "identity",
    type: "input",
    required: true,
  },
  {
    key: "productName",
    label: "Product Name",
    placeholder: "SignalPilot",
    hint: "What you call the product publicly",
    section: "identity",
    type: "input",
    required: true,
  },
  {
    key: "productDescription",
    label: "Product Description",
    placeholder: "What it is and why it matters",
    hint: "A concise elevator pitch — what does it do and who cares?",
    section: "identity",
    type: "textarea",
    required: true,
  },
  {
    key: "targetAudience",
    label: "Target Audience",
    placeholder: "Who it's for",
    hint: "Be specific — job title, persona, or community",
    section: "audience",
    type: "input",
    required: true,
  },
  {
    key: "category",
    label: "Category / Niche",
    placeholder: "e.g. AI devtools",
    hint: "The market category or vertical you compete in",
    section: "audience",
    type: "input",
    required: true,
  },
  {
    key: "fundingStage",
    label: "Funding Stage",
    placeholder: "",
    hint: "Helps calibrate the research depth and angles",
    section: "audience",
    type: "select",
    required: true,
  },
  {
    key: "desiredOutcome",
    label: "Desired Outcome",
    placeholder: "What people should believe or do",
    hint: "The perception shift or action you want from your audience",
    section: "outcome",
    type: "input",
    required: false,
  },
  {
    key: "launchGoal",
    label: "Launch Goal",
    placeholder: "What this launch should achieve",
    hint: "One clear metric or milestone this launch targets",
    section: "outcome",
    type: "input",
    required: false,
  },
];

export const SECTIONS_WITH_FIELDS: SectionWithFields[] = (() => {
  let idx = 0;
  return FORM_SECTIONS.map((section) => ({
    ...section,
    fields: FORM_FIELDS.filter((f) => f.section === section.id).map((f) => ({
      ...f,
      stepNumber: ++idx,
    })),
  }));
})();

export const TOTAL_FIELDS = FORM_FIELDS.length;

export function getSectionProgress(
  sectionId: string,
  brief: StartupBrief,
): { filled: number; total: number } {
  const section = SECTIONS_WITH_FIELDS.find((s) => s.id === sectionId);
  if (!section) return { filled: 0, total: 0 };
  const filled = section.fields.filter(
    (f) => brief[f.key].trim().length > 0,
  ).length;
  return { filled, total: section.fields.length };
}

export function getTotalFilled(brief: StartupBrief): number {
  return FORM_FIELDS.filter((f) => brief[f.key].trim().length > 0).length;
}
