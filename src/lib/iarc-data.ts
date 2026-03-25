// IARC/WHO official carcinogen classifications and sources
// Based on IARC Monographs (2025 update) and official guidelines

export interface IARCCarcinogen {
  name: string
  iarcGroup: '1' | '2A' | '2B' | '3' | '4'
  yearEvaluated: number
  monographNumber: string
  cancerSites: string[]
  exposureRoutes: string[]
  evidenceStrength: 'Definite' | 'Strong' | 'Limited' | 'Inadequate'
  sources: {
    iarc?: string
    who?: string
    efsa?: string
    epa?: string
    ntp?: string
  }
  safeLimit?: string
  notes: string
}

// Official IARC Group 1 Carcinogens (definitive evidence in humans)
export const iarcGroup1: IARCCarcinogen[] = [
  {
    name: 'Processed meat (red meat products)',
    iarcGroup: '1',
    yearEvaluated: 2015,
    monographNumber: 'IARC Vol. 114',
    cancerSites: ['colorectal', 'stomach'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 114, 2015',
      who: 'WHO Guidelines for Diet, Nutrition and Prevention of Chronic Diseases'
    },
    notes: 'Processed meat includes ham, bacon, sausages, corned beef. Each 50g daily portion increases colorectal cancer risk ~18%.'
  },
  {
    name: 'Asbestos (all forms)',
    iarcGroup: '1',
    yearEvaluated: 2012,
    monographNumber: 'IARC Vol. 100C',
    cancerSites: ['lung', 'mesothelioma', 'ovarian', 'laryngeal'],
    exposureRoutes: ['inhalation'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 100C, 2012',
      epa: 'EPA Asbestos Regulations',
      who: 'WHO Air Quality Guidelines'
    },
    safeLimit: '0 (no safe level established)',
    notes: 'No safe exposure threshold. Latency period 10-50 years. All forms (chrysotile, crocidolite, amosite, etc.) are carcinogenic.'
  },
  {
    name: 'Tobacco (smoking)',
    iarcGroup: '1',
    yearEvaluated: 2012,
    monographNumber: 'IARC Vol. 100E',
    cancerSites: ['lung', 'larynx', 'oral cavity', 'pharynx', 'esophagus', 'bladder', 'pancreas', 'stomach'],
    exposureRoutes: ['inhalation', 'ingestion'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 100E, 2012',
      who: 'Framework Convention on Tobacco Control'
    },
    notes: 'Causes ~7 million deaths annually. Contains 70+ known carcinogens including benzene, polonium-210.'
  },
  {
    name: 'Tobacco (secondhand smoke)',
    iarcGroup: '1',
    yearEvaluated: 2004,
    monographNumber: 'IARC Vol. 83',
    cancerSites: ['lung', 'breast (in young women)'],
    exposureRoutes: ['inhalation'],
    evidenceStrength: 'Strong',
    sources: {
      iarc: 'IARC Monograph 83, 2004',
      who: 'WHO Guidelines for Air Quality'
    },
    notes: 'Non-smokers exposed to secondhand smoke have 30% increased risk of lung cancer.'
  },
  {
    name: 'Aflatoxins (particularly B1)',
    iarcGroup: '1',
    yearEvaluated: 2012,
    monographNumber: 'IARC Vol. 100F',
    cancerSites: ['liver'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 100F, 2012',
      who: 'WHO Mycotoxin Guidelines',
      efsa: 'EFSA Aflatoxin Assessment'
    },
    safeLimit: 'WHO: 10 ng/kg total aflatoxins in food',
    notes: 'Produced by Aspergillus fungi. Found in peanuts, corn, tree nuts. Particularly potent with hepatitis B co-infection.'
  },
  {
    name: 'Benzene',
    iarcGroup: '1',
    yearEvaluated: 2012,
    monographNumber: 'IARC Vol. 100F',
    cancerSites: ['leukemia', 'bone marrow'],
    exposureRoutes: ['inhalation', 'skin contact'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 100F, 2012',
      epa: 'EPA Benzene Standards',
      who: 'WHO Air Quality Guidelines'
    },
    safeLimit: 'EPA: 0.0005 mg/L in drinking water',
    notes: 'Common solvent in industrial settings. Gasoline contains ~0.5-5% benzene. Increases ALL (acute lymphoblastic leukemia) risk.'
  },
  {
    name: 'Formaldehyde',
    iarcGroup: '1',
    yearEvaluated: 2015,
    monographNumber: 'IARC Vol. 120',
    cancerSites: ['nasopharyngeal', 'leukemia'],
    exposureRoutes: ['inhalation', 'ingestion'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 120, 2015',
      epa: 'EPA Formaldehyde Assessment',
      who: 'WHO Air Quality Guidelines'
    },
    safeLimit: 'WHO: 0.1 mg/m³ (30-min mean)',
    notes: 'Found in wood products, furniture, cosmetics, embalming fluids. Used in industrial resins.'
  },
  {
    name: 'Radon',
    iarcGroup: '1',
    yearEvaluated: 2001,
    monographNumber: 'IARC Vol. 78',
    cancerSites: ['lung'],
    exposureRoutes: ['inhalation'],
    evidenceStrength: 'Definite',
    sources: {
      iarc: 'IARC Monograph 78, 2001',
      who: 'WHO Radon Handbook',
      epa: 'EPA Radon Action Levels'
    },
    safeLimit: 'WHO: 100 Bq/m³ (action level 200 Bq/m³)',
    notes: 'Second leading cause of lung cancer after smoking. Colorless, odorless radioactive gas from soil/rocks.'
  },
]

// Official IARC Group 2A Carcinogens (probably carcinogenic - strong evidence in humans)
export const iarcGroup2A: IARCCarcinogen[] = [
  {
    name: 'Red meat (unprocessed)',
    iarcGroup: '2A',
    yearEvaluated: 2015,
    monographNumber: 'IARC Vol. 114',
    cancerSites: ['colorectal', 'pancreas', 'prostate'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Strong',
    sources: {
      iarc: 'IARC Monograph 114, 2015',
      who: 'WHO Dietary Guidelines'
    },
    notes: 'Beef, pork, lamb. Evidence less definitive than processed meat. Associated with 17% increased CRC risk per 100g daily.'
  },
  {
    name: 'Acrylamide',
    iarcGroup: '2A',
    yearEvaluated: 2020,
    monographNumber: 'IARC Vol. 119',
    cancerSites: ['multiple (limited evidence)'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Strong',
    sources: {
      iarc: 'IARC Monograph 119, 2020',
      efsa: 'EFSA Acrylamide Assessment 2015'
    },
    notes: 'Forms in starchy foods during high-temp cooking (frying, roasting, baking). Found in French fries, chips, coffee.'
  },
  {
    name: 'Glyphosate (herbicide)',
    iarcGroup: '2A',
    yearEvaluated: 2015,
    monographNumber: 'IARC Vol. 112',
    cancerSites: ['non-Hodgkin lymphoma'],
    exposureRoutes: ['inhalation', 'skin contact', 'ingestion'],
    evidenceStrength: 'Strong',
    sources: {
      iarc: 'IARC Monograph 112, 2015'
    },
    notes: 'Active ingredient in Roundup. Agricultural use worldwide. Increased NHL risk in occupational exposure.'
  },
]

// Official IARC Group 2B Carcinogens (possibly carcinogenic - limited evidence)
export const iarcGroup2B: IARCCarcinogen[] = [
  {
    name: 'Saccharin (artificial sweetener)',
    iarcGroup: '2B',
    yearEvaluated: 1999,
    monographNumber: 'IARC Vol. 73',
    cancerSites: ['bladder', 'urothelium'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Limited',
    sources: {
      iarc: 'IARC Monograph 73, 1999',
      fda: 'FDA GRAS Status (Generally Recognized As Safe)'
    },
    notes: 'Used in diet sodas, artificial sweeteners. High doses in rats caused bladder cancer; human studies inconclusive.'
  },
  {
    name: 'Heterocyclic Amines (HCAs)',
    iarcGroup: '2B',
    yearEvaluated: 1993,
    monographNumber: 'IARC Vol. 56',
    cancerSites: ['colorectal', 'breast', 'prostate'],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Limited',
    sources: {
      iarc: 'IARC Monograph 56, 1993'
    },
    notes: 'Form during high-temperature cooking of meat. Marinating, avoiding charring reduces formation.'
  },
  {
    name: 'Polycyclic Aromatic Hydrocarbons (PAHs)',
    iarcGroup: '2B',
    yearEvaluated: 2010,
    monographNumber: 'IARC Vol. 92',
    cancerSites: ['lung', 'skin'],
    exposureRoutes: ['inhalation', 'skin contact', 'ingestion'],
    evidenceStrength: 'Limited',
    sources: {
      iarc: 'IARC Monograph 92, 2010',
      epa: 'EPA PAH Assessment'
    },
    notes: 'Found in grilled/smoked foods, air pollution, tobacco smoke. Benzo[a]pyrene is the reference compound.'
  },
  {
    name: 'Chloroform (trihalomethane)',
    iarcGroup: '2B',
    yearEvaluated: 1999,
    monographNumber: 'IARC Vol. 73',
    cancerSites: ['kidney', 'liver'],
    exposureRoutes: ['ingestion', 'inhalation'],
    evidenceStrength: 'Limited',
    sources: {
      iarc: 'IARC Monograph 73, 1999',
      epa: 'EPA Drinking Water Standards',
      who: 'WHO Water Quality Guidelines'
    },
    safeLimit: 'WHO: 0.3 mg/L in drinking water',
    notes: 'Disinfection byproduct in chlorinated drinking water. Exposure increased in swimmers.'
  },
]

// IARC Group 3 (not classifiable)
export const iarcGroup3: IARCCarcinogen[] = [
  {
    name: 'Caffeine',
    iarcGroup: '3',
    yearEvaluated: 1991,
    monographNumber: 'IARC Vol. 51',
    cancerSites: [],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Inadequate',
    sources: {
      iarc: 'IARC Monograph 51, 1991'
    },
    notes: 'Insufficient evidence in humans. No causal relationship established in epidemiological studies.'
  },
  {
    name: 'Artificial food colorants (most)',
    iarcGroup: '3',
    yearEvaluated: 2021,
    monographNumber: 'IARC Monographs updated periodically',
    cancerSites: [],
    exposureRoutes: ['ingestion'],
    evidenceStrength: 'Inadequate',
    sources: {
      iarc: 'IARC Periodic Reviews',
      efsa: 'EFSA Color Additives Assessments'
    },
    notes: 'Most approved colorants (tartrazine, allura red, etc.) lack sufficient evidence. Continuous monitoring.'
  },
]

// Function to search IARC database by chemical name
export function searchIARC(chemicalName: string): IARCCarcinogen | null {
  const lowerName = chemicalName.toLowerCase().trim()
  const allCarcinogens = [...iarcGroup1, ...iarcGroup2A, ...iarcGroup2B, ...iarcGroup3]
  
  return allCarcinogens.find(c => c.name.toLowerCase().includes(lowerName)) || null
}

// Function to get all carcinogens by IARC group
export function getCarcinogensByGroup(group: '1' | '2A' | '2B' | '3'): IARCCarcinogen[] {
  switch (group) {
    case '1': return iarcGroup1
    case '2A': return iarcGroup2A
    case '2B': return iarcGroup2B
    case '3': return iarcGroup3
    default: return []
  }
}

// Format IARC group with description
export function formatIARCGroup(group: '1' | '2A' | '2B' | '3' | '4'): string {
  const descriptions: Record<string, string> = {
    '1': 'Group 1: Carcinogenic to humans (definitive evidence)',
    '2A': 'Group 2A: Probably carcinogenic to humans (strong evidence)',
    '2B': 'Group 2B: Possibly carcinogenic to humans (limited evidence)',
    '3': 'Group 3: Not classifiable as carcinogenic (insufficient evidence)',
    '4': 'Group 4: Probably not carcinogenic to humans'
  }
  return descriptions[group] || group
}
