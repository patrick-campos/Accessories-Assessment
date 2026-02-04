export type StepSchema = {
  id: string;
  headerTitle: string;
  inputTitle: string;
  inputSubtitle?: string;
  headerNote?: string;
  auxSections?: Array<{ title?: string; body: string | string[] }>;
  footerHelp?: {
    title: string;
    links: Array<{ label: string; href: string }>;
  };
};

export type FormSchema = {
  steps: StepSchema[];
  options: {
    countries: Array<{ value: string; label: string }>;
    categories: Array<{ value: string; label: string }>;
    brands: Array<{ value: string; label: string }>;
    sizes: Array<{ value: string; label: string }>;
    conditions: Array<{ value: string; label: string }>;
    extras: Array<{ value: string; label: string }>;
  };
};

export const defaultSchema: FormSchema = {
  steps: [
    {
      id: "details",
      headerTitle: "1. Item details",
      inputTitle: "Details",
      inputSubtitle: "Complete the form below, providing as much detail as possible",
      auxSections: [
        {
          title: "What happens next?",
          body:
            "After you’ve completed the form, we’ll be in touch within 3 working days to let you know how much credit you could earn",
        },
        {
          title: "What bags do we accept?",
          body:
            "We currently accept bags from a wide selection of luxury brands. You can see the brands we accept by selecting the ‘Brand’ dropdown.",
        },
        {
          body:
            "We’re unable to accept damaged, torn or peeling bags as well as bags with personalised monograms or any other personalisation.",
        },
      ],
      footerHelp: {
        title: "Need help?",
        links: [
          { label: "Visit our FAQs", href: "#" },
          { label: "Contact our global Customer Service team", href: "#" },
        ],
      },
    },
    {
      id: "photos",
      headerTitle: "2. Photo upload",
      inputTitle: "Photo upload",
      inputSubtitle:
        "These photos should accurately represent your bag and any damage or wear it may have",
      auxSections: [
        {
          title: "Tips for an accurate quote",
          body: [
            "Find a well-lit room",
            "Choose a solid, contrasting background",
            "Include photos of any wear and damage",
            "Take photos of the corners of the bag",
            "Show as much of the lining as possible",
            "Add a photo of the serial number where applicable",
          ],
        },
        {
          title: "Important information",
          body:
            "We may be unable to accept your bag if the photos you provide don’t accurately represent it. If this happens, we'll return the bag to your collection address free of charge.",
        },
      ],
      footerHelp: {
        title: "Need help?",
        links: [
          { label: "Visit our FAQs", href: "#" },
          { label: "Contact our global Customer Service team", href: "#" },
        ],
      },
    },
    {
      id: "additional",
      headerTitle: "3. Additional items",
      inputTitle: "Additional items",
      inputSubtitle: "You can add more than one item to your quote. When you’re done, click Next.",
      auxSections: [
        {
          title: "You’re almost done",
          body: "If you don’t want to add any more items, click Next to review",
        },
        {
          title: "Important information",
          body:
            "We may be unable to accept your bag if the photos you provide don’t accurately represent it. If this happens, we'll return the bag to your collection address free of charge.",
        },
      ],
      footerHelp: {
        title: "Need help?",
        links: [
          { label: "Visit our FAQs", href: "#" },
          { label: "Contact our global Customer Service team", href: "#" },
        ],
      },
    },
    {
      id: "review",
      headerTitle: "4. Review",
      inputTitle: "Review and request",
      inputSubtitle: "Please make sure everything below is correct. To make any changes, click Edit.",
      headerNote:
        "As soon as we’ve reviewed your request, we’ll be in touch with your quote – this can take up to 3 working days.",
      auxSections: [
        {
          title: "All done!",
          body: "When you’re ready, click Request Quote",
        },
      ],
      footerHelp: {
        title: "Need help?",
        links: [
          { label: "Visit our FAQs", href: "#" },
          { label: "Contact our global Customer Service team", href: "#" },
        ],
      },
    },
  ],
  options: {
    countries: [
      { value: "uk", label: "United Kingdom" },
      { value: "pt", label: "Portugal" },
      { value: "es", label: "Spain" },
      { value: "fr", label: "France" },
    ],
    categories: [
      { value: "bags", label: "Bags" },
      { value: "shoes", label: "Shoes" },
      { value: "accessories", label: "Accessories" },
    ],
    brands: [
      { value: "chanel", label: "Chanel" },
      { value: "gucci", label: "Gucci" },
      { value: "prada", label: "Prada" },
    ],
    sizes: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
    conditions: [
      { value: "new", label: "New" },
      { value: "good", label: "Good" },
      { value: "fair", label: "Fair" },
    ],
    extras: [
      { value: "dust-bag", label: "Dust bag" },
      { value: "strap", label: "Strap" },
      { value: "box", label: "Original box" },
    ],
  },
};
