import {
  DATA_FIDUCIARY_NAME,
  DRAFT_RETENTION_MONTHS,
  GRIEVANCE_EMAIL,
  PRIVACY_NOTICE_VERSION,
} from './constants';

export type PrivacyNoticeCopy = {
  title: string;
  updated: string;
  notLegal: string;
  sections: Array<{ id: string; heading: string; body: string }>;
};

const EN: PrivacyNoticeCopy = {
  title: 'Privacy notice',
  updated: `Notice version ${PRIVACY_NOTICE_VERSION}`,
  notLegal:
    'This page is a product notice. It is not a lawyer’s certificate that we “comply with DPDP”.',
  sections: [
    {
      id: 'who',
      heading: 'Who is responsible',
      body: `${DATA_FIDUCIARY_NAME} decides why this tool collects your data (the Data Fiduciary under India’s Digital Personal Data Protection Act, 2023). The exact legal name of the department will be confirmed on paper. Until then we use this product name.`,
    },
    {
      id: 'what',
      heading: 'What we collect',
      body: 'Account details (name, email, phone, location, optional Udyam number, date of birth). DPR answers about your unit, costs, and schemes. Optional identity files such as Aadhaar, PAN, or a bank passbook if you upload them.',
    },
    {
      id: 'why',
      heading: 'Why we collect it',
      body: 'To create an account, let you write and download a Detailed Project Report, match government schemes, and — only if you agree — send form text (not KYC files) to an AI model for suggestions and scoring.',
    },
    {
      id: 'others',
      heading: 'Who else may see it',
      body: 'Our hosting provider stores the database. Cloudinary may store uploaded files. OpenAI receives form text only when AI help is switched on. We do not put Aadhaar, PAN, or bank scans in the AI prompt.',
    },
    {
      id: 'howLong',
      heading: 'How long we keep it',
      body: `Unused DPR drafts are deleted or stripped of personal fields ${DRAFT_RETENTION_MONTHS} months after the last edit. We email a warning first. Your account is not deleted only because one draft is old. Audit logs of who logged in or downloaded a file are kept at least as long as the draft, usually 12–24 months.`,
    },
    {
      id: 'rights',
      heading: 'Your choices',
      body: 'You can download or delete your data from account privacy settings (coming in the next stage). You can turn AI off at any time. You can complain using the form in the app or by email.',
    },
    {
      id: 'children',
      heading: 'If you are under 18',
      body: 'This site makes bank and scheme DPRs. The person named as the entrepreneur must be 18 or older. Ask a parent or guardian to register and create the DPR in their name.',
    },
    {
      id: 'complain',
      heading: 'Complaints',
      body: `Email ${GRIEVANCE_EMAIL} (this is a mock address until a person is assigned to read it). We aim to reply on the path the DPDP Rules describe for rights requests.`,
    },
  ],
};

const TE: PrivacyNoticeCopy = {
  title: 'గోప్యతా నోటీసు',
  updated: `నోటీసు వెర్షన్ ${PRIVACY_NOTICE_VERSION}`,
  notLegal:
    'ఈ పేజీ ఉత్పత్తి నోటీసు. ఇది “మేము DPDPకి కట్టుబడి ఉన్నాము” అని న్యాయవాది సర్టిఫికేట్ కాదు.',
  sections: [
    {
      id: 'who',
      heading: 'ఎవరు బాధ్యులు',
      body: `${DATA_FIDUCIARY_NAME} ఈ సాధనం మీ డేటాను ఎందుకు సేకరిస్తుందో నిర్ణయిస్తుంది (భారత డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం, 2023 ప్రకారం Data Fiduciary). శాఖ యొక్క ఖచ్చితమైన చట్టపరమైన పేరు కాగితంపై నిర్ధారించబడుతుంది.`,
    },
    {
      id: 'what',
      heading: 'మేము ఏమి సేకరిస్తాము',
      body: 'ఖాతా వివరాలు (పేరు, ఇమెయిల్, ఫోన్, స్థానం, ఐచ్ఛిక ఉద్యమ్ నంబర్, పుట్టిన తేది). మీ యూనిట్, ఖర్చులు, పథకాల గురించి DPR సమాధానాలు. మీరు అప్‌లోడ్ చేస్తే ఆధార్, పాన్ లేదా పాస్‌బుక్ వంటి గుర్తింపు ఫైళ్లు.',
    },
    {
      id: 'why',
      heading: 'ఎందుకు సేకరిస్తాము',
      body: 'ఖాతా సృష్టించడానికి, DPR రాయడానికి మరియు డౌన్‌లోడ్ చేయడానికి, పథకాలు సరిపోల్చడానికి, మరియు మీరు అంగీకరిస్తే మాత్రమే — ఫారమ్ టెక్స్ట్‌ను (KYC ఫైళ్లు కాదు) AI సూచనల కోసం పంపడానికి.',
    },
    {
      id: 'others',
      heading: 'ఇంకెవరు చూడవచ్చు',
      body: 'హోస్టింగ్ ప్రొవైడర్ డేటాబేస్‌ను ఉంచుతుంది. Cloudinary అప్‌లోడ్ ఫైళ్లను ఉంచవచ్చు. AI సహాయం ఆన్ ఉన్నప్పుడు మాత్రమే OpenAI ఫారమ్ టెక్స్ట్‌ను పొందుతుంది. ఆధార్, పాన్, బ్యాంకు స్కాన్లను AI ప్రాంప్ట్‌లో పెట్టము.',
    },
    {
      id: 'howLong',
      heading: 'ఎంతకాలం ఉంచుతాము',
      body: `ఉపయోగించని DPR డ్రాఫ్ట్‌లు చివరి సవరణ తర్వాత ${DRAFT_RETENTION_MONTHS} నెలలకు తొలగించబడతాయి లేదా వ్యక్తిగత ఫీల్డ్‌లు తీసివేయబడతాయి. ముందుగా ఇమెయిల్ హెచ్చరిక పంపుతాము. ఒక డ్రాఫ్ట్ పాతది అని మాత్రమే ఖాతా తొలగించబడదు.`,
    },
    {
      id: 'rights',
      heading: 'మీ ఎంపికలు',
      body: 'తదుపరి దశలో ఖాతా గోప్యతా సెట్టింగ్‌ల నుండి మీ డేటాను డౌన్‌లోడ్ లేదా తొలగించవచ్చు. AIని ఎప్పుడైనా ఆఫ్ చేయవచ్చు. యాప్‌లోని ఫారమ్ లేదా ఇమెయిల్ ద్వారా ఫిర్యాదు చేయవచ్చు.',
    },
    {
      id: 'children',
      heading: 'మీకు 18 ఏళ్లు లోపు ఉంటే',
      body: 'ఈ సైట్ బ్యాంకు మరియు పథకాల DPRలను తయారు చేస్తుంది. వ్యవస్థాపకునిగా పేరు పెట్టబడిన వ్యక్తి 18 లేదా అంతకంటే ఎక్కువ వయస్సు ఉండాలి. తల్లిదండ్రులు లేదా సంరక్షకుడు రిజిస్టర్ అయి తమ పేరుతో DPR సృష్టించండి.',
    },
    {
      id: 'complain',
      heading: 'ఫిర్యాదులు',
      body: `ఇమెయిల్ ${GRIEVANCE_EMAIL} (ప్రస్తుతం మాక్ చిరునామా). DPDP నియమాలు చెప్పిన హక్కుల అభ్యర్థన మార్గంలో సమాధానం ఇవ్వడానికి ప్రయత్నిస్తాము.`,
    },
  ],
};

export function getPrivacyNoticeCopy(language: string): PrivacyNoticeCopy {
  return language.startsWith('te') ? TE : EN;
}
