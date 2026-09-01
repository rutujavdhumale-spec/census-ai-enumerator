/**
 * Grounded Knowledge Base for Census 2027 & Digital Enumeration in India
 * Source of truth strictly aligned with the Census Act 1948, Office of the Registrar General & Census Commissioner of India (ORGI),
 * and official Digital Census framework.
 */

export interface CensusParameter {
  id: string;
  itemNumber: number;
  name: string;
  category: string;
  description: string;
  whyAsked: string;
  optionsSample?: string[];
  isConfidential: boolean;
}

export interface PhaseInfo {
  phaseNumber: 1 | 2;
  name: string;
  code: 'HLO' | 'PE';
  title: string;
  subtitle: string;
  objective: string;
  timingDescription: string;
  totalParameters: number;
  whoConducts: string;
  selfEnumerationAllowed: boolean;
  parameters: CensusParameter[];
  keyDifferences: string[];
}

export interface StateCensusData {
  id: string;
  name: string;
  type: 'State' | 'Union Territory';
  capital: string;
  zone: 'Northern' | 'Southern' | 'Western' | 'Eastern' | 'Central' | 'North-Eastern' | 'Island / UT';
  officialLanguages: string[];
  census2011Population: number;
  estimated2027Population: number;
  literacyRate2011: number;
  estimatedLiteracyRate2027: number;
  sexRatio2011: number;
  urbanPercentage: number;
  ruralPercentage: number;
  digitalReadinessScore: number; // 0 to 100 index based on internet/smartphone/telecom metrics
  simulatedPhase1Status: 'Scheduled' | 'In Progress' | 'Completed' | 'Preparatory Testing';
  simulatedPhase2Status: 'Upcoming' | 'Scheduled' | 'Preparatory Testing';
  districtsCount: number;
  helpline: string;
  portalLink: string;
  highlightNote: string;
}

export interface MisinformationEntry {
  id: string;
  claim: string;
  category: 'Scam / Financial Fraud' | 'Document Requirement' | 'Mandatory vs Optional' | 'Privacy & Law' | 'Citizenship / NRC Confusion' | 'Timeline / Fees';
  veracity: 'FALSE' | 'MISLEADING' | 'TRUE' | 'UNVERIFIED';
  factExplanation: string;
  censusActReference: string;
  keywords: string[];
  debunkCardUrl?: string;
  actionGuidance: string;
}

export interface HistoricalCensusStat {
  year: number;
  censusNumber: string;
  totalPopulationMillions: number;
  decadalGrowthRatePercent: number;
  overallLiteracyPercent: number;
  maleLiteracyPercent: number;
  femaleLiteracyPercent: number;
  sexRatioPer1000: number;
  urbanizationPercent: number;
  keyMilestone: string;
}

export const CENSUS_PHASES: { phase1: PhaseInfo; phase2: PhaseInfo } = {
  phase1: {
    phaseNumber: 1,
    name: 'Phase 1: Houselisting & Housing Census (HLO)',
    code: 'HLO',
    title: 'Houselisting and Housing Schedule (HLO)',
    subtitle: 'Mapping physical dwellings, living conditions, and basic household infrastructure across India',
    objective: 'To create a comprehensive national inventory of every building, house, and household living condition. This sets the primary enumeration frame for Phase 2.',
    timingDescription: 'Typically conducted over a 45-day window prior to Population Enumeration across different States/UTs.',
    totalParameters: 31,
    whoConducts: 'Designated Government Enumerators using the official Census Mobile App, or citizens via Self-Enumeration Portal.',
    selfEnumerationAllowed: true,
    keyDifferences: [
      'Focuses on physical dwelling structures, living amenities, assets, and utilities.',
      'Does NOT ask in-depth individual demographic questions like occupation, fertility, or mother tongue.',
      'Generates unique Census House Numbers and Enumeration Block (EB) maps for the nation.'
    ],
    parameters: [
      { id: 'hlo-1', itemNumber: 1, name: 'Building Number (Municipal/Local Authority or Census Number)', category: 'Structure', description: 'Identification number assigned to the building or premises.', whyAsked: 'Establishes geospatial address and ensures zero duplication of properties.', isConfidential: true },
      { id: 'hlo-2', itemNumber: 2, name: 'Census House Number', category: 'Structure', description: 'Unique identifier for independent living units within a building.', whyAsked: 'Identifies individual households living in multi-unit structures.', isConfidential: true },
      { id: 'hlo-3', itemNumber: 3, name: 'Predominant Material of Floor', category: 'Dwelling Quality', description: 'Mud, wood/bamboo, brick, stone, cement, mosaic/tiles, or others.', whyAsked: 'Assesses housing durability, standard of living, and poverty indicators.', isConfidential: false },
      { id: 'hlo-4', itemNumber: 4, name: 'Predominant Material of Wall', category: 'Dwelling Quality', description: 'Grass/thatch, mud/unburnt brick, wood, GI/metal sheets, burnt brick, stone, concrete.', whyAsked: 'Evaluates structural resilience against weather and climate vulnerability.', isConfidential: false },
      { id: 'hlo-5', itemNumber: 5, name: 'Predominant Material of Roof', category: 'Dwelling Quality', description: 'Grass/thatch, tiles, slate, corrugated sheets, concrete (RCC).', whyAsked: 'Helps evaluate urban/rural housing quality and disaster risk resilience.', isConfidential: false },
      { id: 'hlo-6', itemNumber: 6, name: 'Use of Census House', category: 'Usage', description: 'Purely residential, residential-cum-other use, shop, workshop, school, vacant, etc.', whyAsked: 'Tracks economic activity density and spatial urban planning needs.', isConfidential: false },
      { id: 'hlo-7', itemNumber: 7, name: 'Condition of the Census House', category: 'Dwelling Quality', description: 'Good, Livable, or Dilapidated.', whyAsked: 'Crucial for government housing welfare schemes (e.g., PMAY) and safety audits.', isConfidential: false },
      { id: 'hlo-8', itemNumber: 8, name: 'Household Number', category: 'Household', description: 'Sequential number of households residing in the census house.', whyAsked: 'Accounts for multi-family dwellings under one roof.', isConfidential: true },
      { id: 'hlo-9', itemNumber: 9, name: 'Total Number of Persons Normally Residing', category: 'Demographic Count', description: 'Headcount of normal residents (Total, Males, Females, Transgender).', whyAsked: 'Provides preliminary count to plan logistics and enumerator workloads for Phase 2.', isConfidential: true },
      { id: 'hlo-10', itemNumber: 10, name: 'Name of the Head of the Household', category: 'Household', description: 'Name of person recognized by family as head for administrative grouping.', whyAsked: 'Links family roster without creating legal ownership claims.', isConfidential: true },
      { id: 'hlo-11', itemNumber: 11, name: 'Sex of the Head of Household', category: 'Household', description: 'Male, Female, or Transgender.', whyAsked: 'Tracks female-headed households for targeted social security interventions.', isConfidential: false },
      { id: 'hlo-12', itemNumber: 12, name: 'Ownership Status of House', category: 'Tenure', description: 'Owned, Rented, Any Other.', whyAsked: 'Measures home ownership rates and rental housing demands.', isConfidential: false },
      { id: 'hlo-13', itemNumber: 13, name: 'Number of Dwelling Rooms Exclusively in Possession', category: 'Living Space', description: 'Count of habitable rooms (excluding kitchen, bathroom, balcony).', whyAsked: 'Calculates overcrowding index (persons per room).', isConfidential: false },
      { id: 'hlo-14', itemNumber: 14, name: 'Number of Married Couples Living in Household', category: 'Family Structure', description: 'Count of married couples residing in this dwelling.', whyAsked: 'Forecasts future housing demands and joint vs nuclear family trends.', isConfidential: false },
      { id: 'hlo-15', itemNumber: 15, name: 'Main Source of Drinking Water', category: 'Water & Sanitation', description: 'Treated tap water, untreated tap water, handpump, tubewell, covered well, open well, spring, river/canal, tanker.', whyAsked: 'Tracks piped water access (Jal Jeevan Mission metrics) and public health safety.', isConfidential: false },
      { id: 'hlo-16', itemNumber: 16, name: 'Location of Drinking Water Source', category: 'Water & Sanitation', description: 'Within premises, near the premises (within 100m rural/50m urban), away.', whyAsked: 'Measures time burden on families (especially women) for water fetching.', isConfidential: false },
      { id: 'hlo-17', itemNumber: 17, name: 'Main Source of Lighting', category: 'Energy & Amenities', description: 'Electricity, solar energy, kerosene, other oil, no lighting.', whyAsked: 'Monitors electrification coverage (Saubhagya scheme) and renewable adoption.', isConfidential: false },
      { id: 'hlo-18', itemNumber: 18, name: 'Access to Latrine Facility', category: 'Water & Sanitation', description: 'Within premises (flush to sewer/septic tank/pit), public latrine, open.', whyAsked: 'Assesses Swachh Bharat sanitation infrastructure and disease prevention.', isConfidential: false },
      { id: 'hlo-19', itemNumber: 19, name: 'Type of Latrine Facility', category: 'Water & Sanitation', description: 'Piped sewer system, septic tank, twin-pit, single-pit, eco-toilet.', whyAsked: 'Evaluates fecal sludge management and environmental sanitation standards.', isConfidential: false },
      { id: 'hlo-20', itemNumber: 20, name: 'Type of Wastewater Outlet / Drainage', category: 'Water & Sanitation', description: 'Closed drainage, open drainage, no drainage.', whyAsked: 'Helps municipal town planning and vector-borne disease control.', isConfidential: false },
      { id: 'hlo-21', itemNumber: 21, name: 'Availability of Bathing Facility', category: 'Water & Sanitation', description: 'Bathroom attached, enclosure without roof, no separate facility.', whyAsked: 'Indicator of personal hygiene infrastructure and privacy for women.', isConfidential: false },
      { id: 'hlo-22', itemNumber: 22, name: 'Availability of Kitchen & Cooking Fuel', category: 'Cooking & Energy', description: 'Cooking inside/outside house, with LPG/PNG, firewood, crop residue, cow dung, coal, biogas, electric/induction.', whyAsked: 'Assesses indoor air pollution and clean cooking adoption (Pradhan Mantri Ujjwala Yojana).', isConfidential: false },
      { id: 'hlo-23', itemNumber: 23, name: 'Availability of LPG/PNG Connection', category: 'Cooking & Energy', description: 'Yes / No.', whyAsked: 'Tracks energy transition from biomass fuels to clean piped/bottled gas.', isConfidential: false },
      { id: 'hlo-24', itemNumber: 24, name: 'Radio / Transistor', category: 'Assets & Communication', description: 'Yes / No.', whyAsked: 'Monitors public broadcasting penetration for disaster broadcasts.', isConfidential: false },
      { id: 'hlo-25', itemNumber: 25, name: 'Television', category: 'Assets & Communication', description: 'Yes / No.', whyAsked: 'Measures entertainment and information access dissemination.', isConfidential: false },
      { id: 'hlo-26', itemNumber: 26, name: 'Internet Facility / Access', category: 'Assets & Communication', description: 'Broadband, Mobile Internet, Both, None.', whyAsked: 'Key digital divide indicator for BharatNet and digital public infrastructure.', isConfidential: false },
      { id: 'hlo-27', itemNumber: 27, name: 'Laptop / Computer (with or without internet)', category: 'Assets & Communication', description: 'Yes (with internet), Yes (without internet), No.', whyAsked: 'Assesses computing literacy and digital education readiness.', isConfidential: false },
      { id: 'hlo-28', itemNumber: 28, name: 'Telephone / Mobile Phone', category: 'Assets & Communication', description: 'Smartphone, Basic mobile phone, Landline only, None.', whyAsked: 'Measures digital connectivity and mobile financial readiness.', isConfidential: false },
      { id: 'hlo-29', itemNumber: 29, name: 'Bicycle', category: 'Transportation', description: 'Yes / No.', whyAsked: 'Non-motorized mobility indicator and rural connectivity metric.', isConfidential: false },
      { id: 'hlo-30', itemNumber: 30, name: 'Scooter / Motorcycle / Moped', category: 'Transportation', description: 'Yes / No.', whyAsked: 'Two-wheeler asset ownership and middle-class economic expansion marker.', isConfidential: false },
      { id: 'hlo-31', itemNumber: 31, name: 'Car / Jeep / Van', category: 'Transportation', description: 'Yes / No.', whyAsked: 'Automobile ownership and economic prosperity benchmark.', isConfidential: false },
    ]
  },
  phase2: {
    phaseNumber: 2,
    name: 'Phase 2: Population Enumeration (PE)',
    code: 'PE',
    title: 'Population Enumeration Schedule (PE)',
    subtitle: 'Synchronous socio-economic, demographic, linguistic, and cultural profile of every citizen living in India',
    objective: 'To record individual socio-economic, demographic, literacy, language, migration, and employment characteristics of all usual residents.',
    timingDescription: 'Typically conducted synchronously across the nation (e.g., February nationwide, with special provisions for snowbound areas like Ladakh, Himachal, Uttarakhand).',
    totalParameters: 29,
    whoConducts: 'Certified Government Enumerators visiting every mapped household with official Census App, verifying SE tokens or conducting on-spot digital entries.',
    selfEnumerationAllowed: true,
    keyDifferences: [
      'Focuses on individual human persons (demographics, education, work, language, migration).',
      'Requires enumeration of every single individual resident, visitor, or homeless person.',
      'Provides the official legal population count for electoral delimitation, tax devolution, and resource allocation.'
    ],
    parameters: [
      { id: 'pe-1', itemNumber: 1, name: 'Full Name of the Person', category: 'Identification', description: 'Standard name as known in household.', whyAsked: 'Enables family roster identification; strictly anonymized in public reports.', isConfidential: true },
      { id: 'pe-2', itemNumber: 2, name: 'Relationship to Head of Household', category: 'Identification', description: 'Head, spouse, son/daughter, parent, sibling, in-law, unrelated, etc.', whyAsked: 'Determines family structure, kinship dynamics, and household dependency.', isConfidential: true },
      { id: 'pe-3', itemNumber: 3, name: 'Sex', category: 'Demographics', description: 'Male, Female, Transgender.', whyAsked: 'Calculates gender ratio, gender gap in employment, and targeted welfare.', isConfidential: false },
      { id: 'pe-4', itemNumber: 4, name: 'Date of Birth and Age in Completed Years', category: 'Demographics', description: 'DD/MM/YYYY and age in completed years.', whyAsked: 'Determines national age pyramids, demographic dividend, and elderly care requirements.', isConfidential: true },
      { id: 'pe-5', itemNumber: 5, name: 'Current Marital Status', category: 'Demographics', description: 'Never Married, Currently Married, Widowed, Divorced, Separated.', whyAsked: 'Helps evaluate age at marriage, fertility rates, and social welfare programs.', isConfidential: false },
      { id: 'pe-6', itemNumber: 6, name: 'Age at Marriage (for currently married)', category: 'Demographics', description: 'Age in completed years when married for the first time.', whyAsked: 'Monitors early marriage trends and maternal healthcare timing.', isConfidential: false },
      { id: 'pe-7', itemNumber: 7, name: 'Religion', category: 'Socio-Cultural', description: 'Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Other religions.', whyAsked: 'Essential for minority welfare programs, demographic balance, and cultural research.', isConfidential: true },
      { id: 'pe-8', itemNumber: 8, name: 'Scheduled Caste (SC) / Scheduled Tribe (ST) Status', category: 'Socio-Cultural', description: 'SC, ST, or Others (as per constitutional notified presidential lists).', whyAsked: 'Constitutional requirement for affirmative action, reservations, and tribal sub-plans.', isConfidential: true },
      { id: 'pe-9', itemNumber: 9, name: 'Disability Status & Type of Disability', category: 'Inclusion & Health', description: 'Seeing, Hearing, Speech, Movement, Mental Retardation, Mental Illness, Multiple Disabilities, Any other.', whyAsked: 'Directly informs the Accessible India Campaign (Sugamya Bharat) and disability pensions.', isConfidential: false },
      { id: 'pe-10', itemNumber: 10, name: 'Mother Tongue', category: 'Language & Culture', description: 'Language spoken in childhood by mother to the person.', whyAsked: 'Preserves linguistic heritage, identifies endangered languages, and plans mother-tongue education under NEP.', isConfidential: false },
      { id: 'pe-11', itemNumber: 11, name: 'Other Languages Known (Subsidiarity)', category: 'Language & Culture', description: 'Up to two additional languages known/spoken fluently.', whyAsked: 'Measures multilingualism in India and inter-state communicative bridges.', isConfidential: false },
      { id: 'pe-12', itemNumber: 12, name: 'Literacy Status', category: 'Education', description: 'Literate (able to read and write with understanding in any language) or Illiterate.', whyAsked: 'Measures national literacy progress and adult education imperatives.', isConfidential: false },
      { id: 'pe-13', itemNumber: 13, name: 'Attending Educational Institution', category: 'Education', description: 'School, College, Vocational/ITI, Literacy center, Other, Not attending.', whyAsked: 'Tracks Gross Enrollment Ratio (GER) and out-of-school children statistics.', isConfidential: false },
      { id: 'pe-14', itemNumber: 14, name: 'Highest Educational Level Attained', category: 'Education', description: 'Below Primary, Primary, Middle, Secondary, Higher Secondary, Diploma, Graduate, Post-Graduate, Technical Degree.', whyAsked: 'Maps human capital quality and informs higher education investments.', isConfidential: false },
      { id: 'pe-15', itemNumber: 15, name: 'Economic Activity / Worker Status (Past 1 Year)', category: 'Employment', description: 'Main Worker (worked 6+ months), Marginal Worker (worked <6 months), Non-Worker.', whyAsked: 'Determines Labor Force Participation Rate (LFPR) and underemployment.', isConfidential: false },
      { id: 'pe-16', itemNumber: 16, name: 'Category of Economic Activity', category: 'Employment', description: 'Cultivator, Agricultural Laborer, Household Industry Worker, Other Worker.', whyAsked: 'Classifies workforce structure across primary, secondary, and tertiary sectors.', isConfidential: false },
      { id: 'pe-17', itemNumber: 17, name: 'Occupation / Nature of Work', category: 'Employment', description: 'Description of specific work performed (mapped to National Classification of Occupations).', whyAsked: 'Identifies emerging job sectors, gig economy workers, and skill gaps.', isConfidential: false },
      { id: 'pe-18', itemNumber: 18, name: 'Industry, Trade, or Service of Work', category: 'Employment', description: 'Description of establishment/business where person works.', whyAsked: 'Informs industrial development policies and sector-specific incentives.', isConfidential: false },
      { id: 'pe-19', itemNumber: 19, name: 'Class of Worker', category: 'Employment', description: 'Employer, Employee, Single Worker, Family Worker.', whyAsked: 'Analyzes entrepreneurship vs salaried vs unpaid family labor dynamics.', isConfidential: false },
      { id: 'pe-20', itemNumber: 20, name: 'Non-Economic Activity (for Non-Workers)', category: 'Employment', description: 'Student, Household duties, Dependent, Pensioner, Rentier, Beggar/Vagrant, Others.', whyAsked: 'Helps design student scholarships, senior citizen schemes, and social care.', isConfidential: false },
      { id: 'pe-21', itemNumber: 21, name: 'Seeking or Available for Work', category: 'Employment', description: 'Yes / No.', whyAsked: 'Determines true unemployment rates and youth job-seeking trends.', isConfidential: false },
      { id: 'pe-22', itemNumber: 22, name: 'Travel to Place of Work (Distance & Mode)', category: 'Mobility & Urban Planning', description: 'On foot, Bicycle, Two-wheeler, Car, Bus, Train, Metro, Water transport, No travel (WFH).', whyAsked: 'Directly informs public transit infrastructure, highway corridors, and metro expansions.', isConfidential: false },
      { id: 'pe-23', itemNumber: 23, name: 'Place of Birth', category: 'Migration', description: 'State, District, Rural/Urban location of birth.', whyAsked: 'Baseline for lifetime migration analysis.', isConfidential: false },
      { id: 'pe-24', itemNumber: 24, name: 'Place of Last Residence', category: 'Migration', description: 'Village/Town, District, State or Country of last residence.', whyAsked: 'Tracks inter-state and rural-to-urban migration corridors.', isConfidential: false },
      { id: 'pe-25', itemNumber: 25, name: 'Reason for Migration from Place of Last Residence', category: 'Migration', description: 'Work/Employment, Business, Education, Marriage, Moved after birth, Moved with household, Natural calamities, Other.', whyAsked: 'Informs migrant worker housing, labor mobility safety nets, and urban stress management.', isConfidential: false },
      { id: 'pe-26', itemNumber: 26, name: 'Duration of Stay in Present Location', category: 'Migration', description: 'Number of completed years at current place of enumeration.', whyAsked: 'Differentiates circular/seasonal migration from permanent assimilation.', isConfidential: false },
      { id: 'pe-27', itemNumber: 27, name: 'Fertility: Number of Children Surviving (Ever-married women)', category: 'Fertility & Health', description: 'Total surviving male, female, transgender children.', whyAsked: 'Measures child survival rates and long-term demographic replacement ratios.', isConfidential: true },
      { id: 'pe-28', itemNumber: 28, name: 'Fertility: Number of Children Ever Born Alive', category: 'Fertility & Health', description: 'Total children ever born alive (Males, Females).', whyAsked: 'Calculates Total Fertility Rate (TFR) across states and socio-economic cohorts.', isConfidential: true },
      { id: 'pe-29', itemNumber: 29, name: 'Fertility: Any Child Born Alive During the Last 1 Year', category: 'Fertility & Health', description: 'Sex of child born in the last 365 days.', whyAsked: 'Measures Crude Birth Rate (CBR) and age-specific fertility rates for maternal care planning.', isConfidential: true },
    ]
  }
};

export const STATES_AND_UTS: StateCensusData[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    type: 'State',
    capital: 'Amaravati',
    zone: 'Southern',
    officialLanguages: ['Telugu', 'Urdu'],
    census2011Population: 49577103,
    estimated2027Population: 54200000,
    literacyRate2011: 67.02,
    estimatedLiteracyRate2027: 74.8,
    sexRatio2011: 993,
    urbanPercentage: 29.47,
    ruralPercentage: 70.53,
    digitalReadinessScore: 82,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 26,
    helpline: '1800-425-0001',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'High e-governance adoption with extensive village/ward secretariat digital footprint.'
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    type: 'State',
    capital: 'Itanagar',
    zone: 'North-Eastern',
    officialLanguages: ['English'],
    census2011Population: 1383727,
    estimated2027Population: 1620000,
    literacyRate2011: 65.38,
    estimatedLiteracyRate2027: 76.2,
    sexRatio2011: 938,
    urbanPercentage: 22.98,
    ruralPercentage: 77.02,
    digitalReadinessScore: 64,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 26,
    helpline: '1800-345-3601',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Special enumeration logistical protocols for rugged mountainous terrain and tribal communities.'
  },
  {
    id: 'assam',
    name: 'Assam',
    type: 'State',
    capital: 'Dispur',
    zone: 'North-Eastern',
    officialLanguages: ['Assamese', 'Bengali', 'Bodo'],
    census2011Population: 31205576,
    estimated2027Population: 36100000,
    literacyRate2011: 72.19,
    estimatedLiteracyRate2027: 81.5,
    sexRatio2011: 958,
    urbanPercentage: 14.1,
    ruralPercentage: 85.9,
    digitalReadinessScore: 71,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 35,
    helpline: '1800-345-3755',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Riverine island (char) enumeration contingency plans and multi-lingual language support.'
  },
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'State',
    capital: 'Patna',
    zone: 'Eastern',
    officialLanguages: ['Hindi', 'Urdu', 'Maithili'],
    census2011Population: 104099452,
    estimated2027Population: 129500000,
    literacyRate2011: 61.8,
    estimatedLiteracyRate2027: 73.1,
    sexRatio2011: 918,
    urbanPercentage: 11.29,
    ruralPercentage: 88.71,
    digitalReadinessScore: 68,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 38,
    helpline: '1800-345-6123',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Second highest population state; major demographic dividend with large young population.'
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'State',
    capital: 'Raipur',
    zone: 'Central',
    officialLanguages: ['Hindi', 'Chhattisgarhi'],
    census2011Population: 25545198,
    estimated2027Population: 30500000,
    literacyRate2011: 70.28,
    estimatedLiteracyRate2027: 79.4,
    sexRatio2011: 991,
    urbanPercentage: 23.24,
    ruralPercentage: 76.76,
    digitalReadinessScore: 72,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 33,
    helpline: '1800-233-1245',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'High tribal population representation (30.6%) and balanced gender ratio.'
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'State',
    capital: 'Panaji',
    zone: 'Western',
    officialLanguages: ['Konkani', 'Marathi'],
    census2011Population: 1458545,
    estimated2027Population: 1600000,
    literacyRate2011: 88.7,
    estimatedLiteracyRate2027: 94.2,
    sexRatio2011: 973,
    urbanPercentage: 62.17,
    ruralPercentage: 37.83,
    digitalReadinessScore: 94,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 2,
    helpline: '1800-233-3456',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Highest urbanization and high smartphone penetration ideal for digital self-enumeration pilot.'
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'State',
    capital: 'Gandhinagar',
    zone: 'Western',
    officialLanguages: ['Gujarati', 'Hindi'],
    census2011Population: 60439692,
    estimated2027Population: 71800000,
    literacyRate2011: 78.03,
    estimatedLiteracyRate2027: 86.8,
    sexRatio2011: 919,
    urbanPercentage: 42.6,
    ruralPercentage: 57.4,
    digitalReadinessScore: 89,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 33,
    helpline: '1800-233-5500',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Rapidly urbanizing industrial hubs with high digital payments & telecom connectivity.'
  },
  {
    id: 'haryana',
    name: 'Haryana',
    type: 'State',
    capital: 'Chandigarh',
    zone: 'Northern',
    officialLanguages: ['Hindi', 'Punjabi'],
    census2011Population: 25351462,
    estimated2027Population: 29800000,
    literacyRate2011: 75.55,
    estimatedLiteracyRate2027: 84.6,
    sexRatio2011: 879,
    urbanPercentage: 34.88,
    ruralPercentage: 65.12,
    digitalReadinessScore: 88,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 22,
    helpline: '1800-180-2000',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Focus on sex-ratio tracking improvements since the Beti Bachao Beti Padhao campaign.'
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    type: 'State',
    capital: 'Shimla',
    zone: 'Northern',
    officialLanguages: ['Hindi'],
    census2011Population: 6864602,
    estimated2027Population: 7500000,
    literacyRate2011: 82.8,
    estimatedLiteracyRate2027: 91.2,
    sexRatio2011: 972,
    urbanPercentage: 10.03,
    ruralPercentage: 89.97,
    digitalReadinessScore: 85,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 12,
    helpline: '1800-180-8004',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Early snowbound enumeration windows for Lahaul-Spiti, Kinnaur, and Pangi valley.'
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    type: 'State',
    capital: 'Ranchi',
    zone: 'Eastern',
    officialLanguages: ['Hindi', 'Santhali', 'Bengali'],
    census2011Population: 32988134,
    estimated2027Population: 39600000,
    literacyRate2011: 66.41,
    estimatedLiteracyRate2027: 77.3,
    sexRatio2011: 948,
    urbanPercentage: 24.05,
    ruralPercentage: 75.95,
    digitalReadinessScore: 70,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 24,
    helpline: '1800-345-6547',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Extensive tribal demographics (26.2%) and multilingual questionnaire testing in tribal languages.'
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'State',
    capital: 'Bengaluru',
    zone: 'Southern',
    officialLanguages: ['Kannada'],
    census2011Population: 61095297,
    estimated2027Population: 68900000,
    literacyRate2011: 75.36,
    estimatedLiteracyRate2027: 85.9,
    sexRatio2011: 973,
    urbanPercentage: 38.67,
    ruralPercentage: 61.33,
    digitalReadinessScore: 92,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 31,
    helpline: '1800-425-4440',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Tech capital Bengaluru exhibits highest digital self-enumeration simulation willingness.'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'State',
    capital: 'Thiruvananthapuram',
    zone: 'Southern',
    officialLanguages: ['Malayalam', 'English'],
    census2011Population: 33406061,
    estimated2027Population: 35800000,
    literacyRate2011: 94.0,
    estimatedLiteracyRate2027: 98.4,
    sexRatio2011: 1084,
    urbanPercentage: 47.7,
    ruralPercentage: 52.3,
    digitalReadinessScore: 96,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 14,
    helpline: '1800-425-1020',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Highest literacy rate and sex ratio in India; advanced demographic transition with aging population.'
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    type: 'State',
    capital: 'Bhopal',
    zone: 'Central',
    officialLanguages: ['Hindi'],
    census2011Population: 72626809,
    estimated2027Population: 87500000,
    literacyRate2011: 69.32,
    estimatedLiteracyRate2027: 78.5,
    sexRatio2011: 931,
    urbanPercentage: 27.63,
    ruralPercentage: 72.37,
    digitalReadinessScore: 74,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 55,
    helpline: '1800-233-4035',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Largest geographical state in central India with diverse tribal and agro-climatic zones.'
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    type: 'State',
    capital: 'Mumbai',
    zone: 'Western',
    officialLanguages: ['Marathi'],
    census2011Population: 112374333,
    estimated2027Population: 128200000,
    literacyRate2011: 82.34,
    estimatedLiteracyRate2027: 89.8,
    sexRatio2011: 929,
    urbanPercentage: 45.22,
    ruralPercentage: 54.78,
    digitalReadinessScore: 93,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 36,
    helpline: '1800-222-300',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Economic powerhouse with mega-metropolis Mumbai & Pune having dense multi-story dwelling registers.'
  },
  {
    id: 'manipur',
    name: 'Manipur',
    type: 'State',
    capital: 'Imphal',
    zone: 'North-Eastern',
    officialLanguages: ['Meitei (Manipuri)'],
    census2011Population: 2855794,
    estimated2027Population: 3250000,
    literacyRate2011: 76.94,
    estimatedLiteracyRate2027: 85.1,
    sexRatio2011: 985,
    urbanPercentage: 29.21,
    ruralPercentage: 70.79,
    digitalReadinessScore: 69,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 16,
    helpline: '1800-345-3810',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Robust community engagement frameworks for hill and valley enumeration blocks.'
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    type: 'State',
    capital: 'Shillong',
    zone: 'North-Eastern',
    officialLanguages: ['English', 'Khasi', 'Garo'],
    census2011Population: 2966889,
    estimated2027Population: 3450000,
    literacyRate2011: 74.43,
    estimatedLiteracyRate2027: 84.0,
    sexRatio2011: 989,
    urbanPercentage: 20.07,
    ruralPercentage: 79.93,
    digitalReadinessScore: 71,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 12,
    helpline: '1800-345-3920',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Matrilineal societal structures with unique household headship dynamics.'
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    type: 'State',
    capital: 'Aizawl',
    zone: 'North-Eastern',
    officialLanguages: ['Mizo', 'English'],
    census2011Population: 1097206,
    estimated2027Population: 1280000,
    literacyRate2011: 91.33,
    estimatedLiteracyRate2027: 96.5,
    sexRatio2011: 976,
    urbanPercentage: 52.11,
    ruralPercentage: 47.89,
    digitalReadinessScore: 81,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 11,
    helpline: '1800-345-3830',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'High literacy and strong community village councils assisting digital awareness.'
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    type: 'State',
    capital: 'Kohima',
    zone: 'North-Eastern',
    officialLanguages: ['English'],
    census2011Population: 1978502,
    estimated2027Population: 2280000,
    literacyRate2011: 79.55,
    estimatedLiteracyRate2027: 87.2,
    sexRatio2011: 931,
    urbanPercentage: 28.86,
    ruralPercentage: 71.14,
    digitalReadinessScore: 73,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 16,
    helpline: '1800-345-3840',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Customary village development boards assisting enumerator verification.'
  },
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'State',
    capital: 'Bhubaneswar',
    zone: 'Eastern',
    officialLanguages: ['Odia'],
    census2011Population: 41974218,
    estimated2027Population: 47200000,
    literacyRate2011: 72.87,
    estimatedLiteracyRate2027: 82.3,
    sexRatio2011: 979,
    urbanPercentage: 16.69,
    ruralPercentage: 83.31,
    digitalReadinessScore: 76,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 30,
    helpline: '1800-345-6770',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Coastal disaster resilience planning integrated with housing infrastructure data.'
  },
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'State',
    capital: 'Chandigarh',
    zone: 'Northern',
    officialLanguages: ['Punjabi'],
    census2011Population: 27743338,
    estimated2027Population: 31200000,
    literacyRate2011: 75.84,
    estimatedLiteracyRate2027: 84.5,
    sexRatio2011: 895,
    urbanPercentage: 37.48,
    ruralPercentage: 62.52,
    digitalReadinessScore: 87,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 23,
    helpline: '1800-180-2468',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Extensive diaspora out-migration patterns tracked under migration schedule parameters.'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'State',
    capital: 'Jaipur',
    zone: 'Northern',
    officialLanguages: ['Hindi', 'Rajasthani'],
    census2011Population: 68548437,
    estimated2027Population: 81500000,
    literacyRate2011: 66.11,
    estimatedLiteracyRate2027: 77.8,
    sexRatio2011: 928,
    urbanPercentage: 24.87,
    ruralPercentage: 75.13,
    digitalReadinessScore: 78,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 50,
    helpline: '1800-180-6127',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Largest geographical state in India with special desert enumeration mobile units.'
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    type: 'State',
    capital: 'Gangtok',
    zone: 'North-Eastern',
    officialLanguages: ['Nepali', 'Sikkimese (Bhutia)', 'Lepcha', 'English'],
    census2011Population: 610577,
    estimated2027Population: 710000,
    literacyRate2011: 81.42,
    estimatedLiteracyRate2027: 90.5,
    sexRatio2011: 890,
    urbanPercentage: 25.15,
    ruralPercentage: 74.85,
    digitalReadinessScore: 84,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 6,
    helpline: '1800-345-3210',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'First 100% organic state; highly localized eco-sensitive village clusters.'
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'State',
    capital: 'Chennai',
    zone: 'Southern',
    officialLanguages: ['Tamil'],
    census2011Population: 72147030,
    estimated2027Population: 77800000,
    literacyRate2011: 80.09,
    estimatedLiteracyRate2027: 88.7,
    sexRatio2011: 996,
    urbanPercentage: 48.4,
    ruralPercentage: 51.6,
    digitalReadinessScore: 95,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 38,
    helpline: '1800-425-1333',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Highest urbanized major state with widespread optical fiber and village e-Seva centers.'
  },
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'State',
    capital: 'Hyderabad',
    zone: 'Southern',
    officialLanguages: ['Telugu', 'Urdu'],
    census2011Population: 35003674,
    estimated2027Population: 38900000,
    literacyRate2011: 66.54,
    estimatedLiteracyRate2027: 76.9,
    sexRatio2011: 988,
    urbanPercentage: 38.88,
    ruralPercentage: 61.12,
    digitalReadinessScore: 91,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 33,
    helpline: '1800-425-2233',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'T-Fiber high-speed network enabling swift enumerator app syncing.'
  },
  {
    id: 'tripura',
    name: 'Tripura',
    type: 'State',
    capital: 'Agartala',
    zone: 'North-Eastern',
    officialLanguages: ['Bengali', 'Kokborok', 'English'],
    census2011Population: 3673917,
    estimated2027Population: 4190000,
    literacyRate2011: 87.22,
    estimatedLiteracyRate2027: 94.6,
    sexRatio2011: 960,
    urbanPercentage: 26.17,
    ruralPercentage: 73.83,
    digitalReadinessScore: 79,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 8,
    helpline: '1800-345-3850',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Very high literacy rate in the North-East with strong local governance engagement.'
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'State',
    capital: 'Lucknow',
    zone: 'Northern',
    officialLanguages: ['Hindi', 'Urdu'],
    census2011Population: 199812341,
    estimated2027Population: 241000000,
    literacyRate2011: 67.68,
    estimatedLiteracyRate2027: 78.2,
    sexRatio2011: 912,
    urbanPercentage: 22.27,
    ruralPercentage: 77.73,
    digitalReadinessScore: 77,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 75,
    helpline: '1800-180-5145',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Most populous sub-national entity in the world; largest deployment of enumerator tablets.'
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'State',
    capital: 'Dehradun',
    zone: 'Northern',
    officialLanguages: ['Hindi', 'Sanskrit'],
    census2011Population: 10086292,
    estimated2027Population: 11800000,
    literacyRate2011: 78.82,
    estimatedLiteracyRate2027: 87.4,
    sexRatio2011: 963,
    urbanPercentage: 30.23,
    ruralPercentage: 69.77,
    digitalReadinessScore: 82,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 13,
    helpline: '1800-180-4100',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Mountainous district adjustments with offline-first app caching for remote Himalayan valleys.'
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    type: 'State',
    capital: 'Kolkata',
    zone: 'Eastern',
    officialLanguages: ['Bengali', 'English', 'Nepali', 'Urdu'],
    census2011Population: 91276115,
    estimated2027Population: 101200000,
    literacyRate2011: 76.26,
    estimatedLiteracyRate2027: 84.8,
    sexRatio2011: 950,
    urbanPercentage: 31.87,
    ruralPercentage: 68.13,
    digitalReadinessScore: 83,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 23,
    helpline: '1800-345-5678',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'High population density in Ganges delta and distinct Sundarbans water-access blocks.'
  },
  // UNION TERRITORIES
  {
    id: 'delhi',
    name: 'National Capital Territory of Delhi',
    type: 'Union Territory',
    capital: 'New Delhi',
    zone: 'Northern',
    officialLanguages: ['Hindi', 'English', 'Punjabi', 'Urdu'],
    census2011Population: 16787941,
    estimated2027Population: 22100000,
    literacyRate2011: 86.21,
    estimatedLiteracyRate2027: 92.5,
    sexRatio2011: 868,
    urbanPercentage: 97.5,
    ruralPercentage: 2.5,
    digitalReadinessScore: 98,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 11,
    helpline: '1800-111-255',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Dense urban geography with high digital self-enumeration adoption expected in high-rises.'
  },
  {
    id: 'jammu-and-kashmir',
    name: 'Jammu and Kashmir',
    type: 'Union Territory',
    capital: 'Srinagar / Jammu',
    zone: 'Northern',
    officialLanguages: ['Kashmiri', 'Dogri', 'Urdu', 'Hindi', 'English'],
    census2011Population: 12267032,
    estimated2027Population: 14200000,
    literacyRate2011: 67.16,
    estimatedLiteracyRate2027: 79.5,
    sexRatio2011: 889,
    urbanPercentage: 27.38,
    ruralPercentage: 72.62,
    digitalReadinessScore: 80,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 20,
    helpline: '1800-180-7050',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Seasonal migration of Gujjar & Bakarwal pastoralists mapped through mobile nomadic registers.'
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'Union Territory',
    capital: 'Leh',
    zone: 'Northern',
    officialLanguages: ['Ladakhi', 'Hindi', 'English'],
    census2011Population: 274289,
    estimated2027Population: 310000,
    literacyRate2011: 77.48,
    estimatedLiteracyRate2027: 88.0,
    sexRatio2011: 690,
    urbanPercentage: 22.57,
    ruralPercentage: 77.43,
    digitalReadinessScore: 75,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 2,
    helpline: '1800-180-7051',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Special pre-winter enumeration timeline due to severe weather isolation in Zanskar & Changthang.'
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    type: 'Union Territory',
    capital: 'Chandigarh',
    zone: 'Northern',
    officialLanguages: ['English', 'Hindi', 'Punjabi'],
    census2011Population: 1055450,
    estimated2027Population: 1240000,
    literacyRate2011: 86.05,
    estimatedLiteracyRate2027: 92.1,
    sexRatio2011: 818,
    urbanPercentage: 97.25,
    ruralPercentage: 2.75,
    digitalReadinessScore: 97,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 1,
    helpline: '1800-180-2005',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'High digital literacy city with planned sectors enabling precise GIS household coordinates.'
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    type: 'Union Territory',
    capital: 'Puducherry',
    zone: 'Southern',
    officialLanguages: ['Tamil', 'Telugu', 'Malayalam', 'French', 'English'],
    census2011Population: 1247953,
    estimated2027Population: 1540000,
    literacyRate2011: 85.85,
    estimatedLiteracyRate2027: 92.8,
    sexRatio2011: 1037,
    urbanPercentage: 68.33,
    ruralPercentage: 31.67,
    digitalReadinessScore: 92,
    simulatedPhase1Status: 'In Progress',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 4,
    helpline: '1800-425-4500',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Multi-enclave UT across Tamil Nadu, Kerala (Mahe), and Andhra Pradesh (Yanam).'
  },
  {
    id: 'andaman-and-nicobar-islands',
    name: 'Andaman and Nicobar Islands',
    type: 'Union Territory',
    capital: 'Port Blair',
    zone: 'Island / UT',
    officialLanguages: ['Hindi', 'English', 'Bengali', 'Tamil'],
    census2011Population: 380581,
    estimated2027Population: 440000,
    literacyRate2011: 86.63,
    estimatedLiteracyRate2027: 92.4,
    sexRatio2011: 876,
    urbanPercentage: 37.7,
    ruralPercentage: 62.3,
    digitalReadinessScore: 78,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 3,
    helpline: '1800-345-3198',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Special contact protocol preserving Particularly Vulnerable Tribal Groups (PVTGs) including Sentinelese & Jarawas.'
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    type: 'Union Territory',
    capital: 'Kavaratti',
    zone: 'Island / UT',
    officialLanguages: ['Malayalam', 'English', 'Mahl'],
    census2011Population: 64473,
    estimated2027Population: 72000,
    literacyRate2011: 91.85,
    estimatedLiteracyRate2027: 96.2,
    sexRatio2011: 946,
    urbanPercentage: 78.07,
    ruralPercentage: 21.93,
    digitalReadinessScore: 82,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 1,
    helpline: '1800-425-5000',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Submarine optical fiber cable (KLI-SOFC) connectivity facilitating digital field synchronizations.'
  },
  {
    id: 'dadra-and-nagar-haveli-and-daman-and-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'Union Territory',
    capital: 'Daman',
    zone: 'Western',
    officialLanguages: ['Gujarati', 'Hindi', 'Marathi', 'English'],
    census2011Population: 586956,
    estimated2027Population: 760000,
    literacyRate2011: 76.24,
    estimatedLiteracyRate2027: 85.3,
    sexRatio2011: 618,
    urbanPercentage: 75.16,
    ruralPercentage: 24.84,
    digitalReadinessScore: 88,
    simulatedPhase1Status: 'Scheduled',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 3,
    helpline: '1800-233-0101',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Merged UT with high industrial migrant workforce tracking requirements.'
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'Union Territory',
    capital: 'Leh',
    zone: 'Northern',
    officialLanguages: ['Ladakhi', 'Hindi', 'English'],
    census2011Population: 274289,
    estimated2027Population: 310000,
    literacyRate2011: 77.48,
    estimatedLiteracyRate2027: 88.0,
    sexRatio2011: 690,
    urbanPercentage: 22.57,
    ruralPercentage: 77.43,
    digitalReadinessScore: 75,
    simulatedPhase1Status: 'Preparatory Testing',
    simulatedPhase2Status: 'Upcoming',
    districtsCount: 2,
    helpline: '1800-180-7051',
    portalLink: 'https://censusindia.gov.in',
    highlightNote: 'Special pre-winter enumeration timeline due to severe weather isolation in Zanskar & Changthang.'
  }
];

// Remove any duplicates in case
export const UNIQUE_STATES_AND_UTS = Array.from(
  new Map(STATES_AND_UTS.map(item => [item.id, item])).values()
);

export const MISINFORMATION_DATABASE: MisinformationEntry[] = [
  {
    id: 'rumor-1',
    claim: 'Digital Census 2027 requires paying a registration fee or processing charge of ₹250/₹500 online.',
    category: 'Scam / Financial Fraud',
    veracity: 'FALSE',
    factExplanation: 'The Indian National Census is 100% FREE for all residents. The Government of India never charges any fee for self-enumeration, enumerator visits, or acknowledgment slips. Any website, SMS, or link asking for money or payment details is a cyber scam.',
    censusActReference: 'Census Act 1948, Statutory Duty of the Union Government.',
    keywords: ['fee', 'charge', 'money', 'payment', 'rs 500', 'rs 250', 'cost', 'pay', 'upi', 'qr code payment'],
    actionGuidance: 'Never make any payments. Report the scam URL/number to cybercrime.gov.in or call National Cyber Helpline 1930.'
  },
  {
    id: 'rumor-2',
    claim: 'Census enumerators or the online portal will ask for your Bank Account number, UPI PIN, or ATM Card details to verify your identity.',
    category: 'Scam / Financial Fraud',
    veracity: 'FALSE',
    factExplanation: 'The Census questionnaire collects ONLY demographic, housing, amenity, and economic indicators. It NEVER asks for Bank Account numbers, IFSC codes, Credit/Debit card numbers, UPI PINs, or One-Time Passwords (OTPs) from banks.',
    censusActReference: 'Section 15, Census Act 1948 & ORGI Digital Census Standards.',
    keywords: ['bank', 'account', 'upi', 'pin', 'atm', 'credit card', 'debit card', 'cvv', 'financial'],
    actionGuidance: 'Immediately refuse. Official enumerators are strictly barred from asking for financial or banking information.'
  },
  {
    id: 'rumor-3',
    claim: 'If I do not complete online Self-Enumeration, my Aadhaar card or PAN card will be blocked/deactivated.',
    category: 'Document Requirement',
    veracity: 'FALSE',
    factExplanation: 'Self-enumeration is purely an optional convenience feature for citizens. If a household chooses not to self-enumerate, an official Government Enumerator will physically visit the house to collect the details. No documents, Aadhaar cards, or PAN cards are ever blocked or penalized.',
    censusActReference: 'Digital Census Public Guidelines, Ministry of Home Affairs.',
    keywords: ['aadhaar', 'pan card', 'deactivate', 'block', 'cancel', 'penalty', 'mandatory self enumeration'],
    actionGuidance: 'Ignore threatening messages. Self-enumeration is optional; in-person enumeration remains standard.'
  },
  {
    id: 'rumor-4',
    claim: 'Census data will be shared with the Income Tax Department, Police, or private banks to inspect citizens.',
    category: 'Privacy & Law',
    veracity: 'FALSE',
    factExplanation: 'Under Section 15 of the Census Act 1948, individual census records are completely CONFIDENTIAL by law. They are NOT admissible as evidence in any court of law and cannot be accessed by Police, Tax authorities, or private corporations. Census data is used strictly for aggregated national planning.',
    censusActReference: 'Section 15, Census Act 1948 (Confidentiality of individual records).',
    keywords: ['tax', 'income tax', 'police', 'court', 'court evidence', 'private company', 'data leak', 'share data'],
    actionGuidance: 'Your responses are legally shielded under statutory confidentiality.'
  },
  {
    id: 'rumor-5',
    claim: 'Completing Self-Enumeration means no enumerator will ever visit my home.',
    category: 'Mandatory vs Optional',
    veracity: 'MISLEADING',
    factExplanation: 'When you complete Self-Enumeration, you receive a unique Self-Enumeration (SE) Reference Number and QR Code. When the official enumerator visits your home, you simply show this QR code/number. The enumerator quickly authenticates the record on their official tablet without re-asking all questions. A physical visit still occurs for verification and geo-tagging.',
    censusActReference: 'Digital Enumeration Standard Operating Procedures (SOP), ORGI.',
    keywords: ['enumerator visit', 'no visit', 'skip visit', 'qr code', 'reference number', 'self enumeration'],
    actionGuidance: 'Save your SE Reference Slip / QR code to show the enumerator for a 1-minute verification visit.'
  },
  {
    id: 'rumor-6',
    claim: 'Citizens must submit original property documents or land registry papers to the Census enumerator.',
    category: 'Document Requirement',
    veracity: 'FALSE',
    factExplanation: 'Census is a statistical declaration based on the respondent\'s oral statements or self-submitted form. Enumerators DO NOT ask for, inspect, or collect property deeds, land registry papers, or proof of ownership.',
    censusActReference: 'Census Act 1948 & Enumerator Instruction Manual.',
    keywords: ['property paper', 'land deed', 'registry', 'documents', 'proof of ownership', 'papers'],
    actionGuidance: 'Do not hand over any original physical documents. Census relies on oral declarations.'
  },
  {
    id: 'rumor-7',
    claim: 'Digital Census 2027 will be conducted in two distinct phases: Houselisting and Population Enumeration.',
    category: 'Timeline / Fees',
    veracity: 'TRUE',
    factExplanation: 'Correct! The Indian Decennial Census is conducted in two distinct phases: Phase 1 is the Houselisting & Housing Census (mapping dwellings, amenities, and assets), and Phase 2 is the Population Enumeration (counting people, literacy, work, language, and demographics).',
    censusActReference: 'ORGI Census Methodology Framework.',
    keywords: ['two phases', 'houselisting', 'population enumeration', 'phases', 'two stages'],
    actionGuidance: 'Verified official methodology.'
  },
  {
    id: 'rumor-8',
    claim: 'Official Census Enumerators carry a government-issued ID card with a verification QR code and official Census Mobile App.',
    category: 'Privacy & Law',
    veracity: 'TRUE',
    factExplanation: 'Authentic enumerators carry an official Photo Identity Card issued by the Directorate of Census Operations / District Collector with a QR code and use the secured official Government Census mobile application on their designated device.',
    censusActReference: 'Section 4, Census Act 1948 (Appointment of Census Officers).',
    keywords: ['id card', 'official id', 'enumerator badge', 'tablet app', 'verification'],
    actionGuidance: 'Always ask the visiting enumerator to display their official Census ID card before answering.'
  }
];

export const HISTORICAL_CENSUS_STATS: HistoricalCensusStat[] = [
  { year: 1951, censusNumber: '1st Post-Independence', totalPopulationMillions: 361.1, decadalGrowthRatePercent: 13.31, overallLiteracyPercent: 18.33, maleLiteracyPercent: 27.16, femaleLiteracyPercent: 8.86, sexRatioPer1000: 946, urbanizationPercent: 17.29, keyMilestone: 'First Census of Independent India under Census Act 1948' },
  { year: 1961, censusNumber: '2nd Post-Independence', totalPopulationMillions: 439.2, decadalGrowthRatePercent: 21.64, overallLiteracyPercent: 28.30, maleLiteracyPercent: 40.40, femaleLiteracyPercent: 15.35, sexRatioPer1000: 941, urbanizationPercent: 17.97, keyMilestone: 'Introduction of detailed economic worker classification' },
  { year: 1971, censusNumber: '3rd Post-Independence', totalPopulationMillions: 548.2, decadalGrowthRatePercent: 24.80, overallLiteracyPercent: 34.45, maleLiteracyPercent: 45.96, femaleLiteracyPercent: 21.97, sexRatioPer1000: 930, urbanizationPercent: 19.91, keyMilestone: 'Expanded fertility and migration questions introduced' },
  { year: 1981, censusNumber: '4th Post-Independence', totalPopulationMillions: 683.3, decadalGrowthRatePercent: 24.66, overallLiteracyPercent: 43.57, maleLiteracyPercent: 56.38, femaleLiteracyPercent: 29.76, sexRatioPer1000: 934, urbanizationPercent: 23.34, keyMilestone: 'Adoption of 12-item Houselisting schedule format' },
  { year: 1991, censusNumber: '5th Post-Independence', totalPopulationMillions: 846.4, decadalGrowthRatePercent: 23.87, overallLiteracyPercent: 52.21, maleLiteracyPercent: 64.13, femaleLiteracyPercent: 39.29, sexRatioPer1000: 927, urbanizationPercent: 25.71, keyMilestone: 'Definition of literate standardized to age 7 and above' },
  { year: 2001, censusNumber: '6th Post-Independence', totalPopulationMillions: 1028.7, decadalGrowthRatePercent: 21.54, overallLiteracyPercent: 64.83, maleLiteracyPercent: 75.26, femaleLiteracyPercent: 53.67, sexRatioPer1000: 933, urbanizationPercent: 27.81, keyMilestone: 'Introduction of Intelligent Character Recognition (ICR) data scanning' },
  { year: 2011, censusNumber: '7th Post-Independence', totalPopulationMillions: 1210.9, decadalGrowthRatePercent: 17.70, overallLiteracyPercent: 74.04, maleLiteracyPercent: 82.14, femaleLiteracyPercent: 65.46, sexRatioPer1000: 940, urbanizationPercent: 31.14, keyMilestone: 'First gender recognition beyond binary & mobile phone/internet tracking' },
  { year: 2027, censusNumber: '8th Post-Independence (Projected)', totalPopulationMillions: 1445.0, decadalGrowthRatePercent: 11.20, overallLiteracyPercent: 85.50, maleLiteracyPercent: 91.20, femaleLiteracyPercent: 79.80, sexRatioPer1000: 955, urbanizationPercent: 37.50, keyMilestone: 'India\'s First 100% Digital Census with Mobile App & Citizen Self-Enumeration' },
];

export const CENSUS_ACT_LEGAL_POINTS = [
  {
    title: 'Section 15 — Confidentiality of Individual Records',
    description: 'No person shall have a right to inspect any book, register or record made by a census-officer in the discharge of his duty. Individual responses cannot be used as evidence against any citizen in any court, civil or criminal proceedings.',
    icon: 'Shield'
  },
  {
    title: 'Section 8 & 10 — Obligation of Truthful Response',
    description: 'Citizens are legally obligated to answer census questions truthfully to the best of their knowledge. In return, the state guarantees absolute anonymity and zero punitive misuse of the data.',
    icon: 'CheckCircle'
  },
  {
    title: 'Section 11 — Penalties for Breach of Confidentiality',
    description: 'Strict criminal penalties and imprisonment apply to any census officer who unauthorizedly discloses, copies, or leaks census data.',
    icon: 'Lock'
  },
  {
    title: 'Section 4 — Statutory Authority of Enumerators',
    description: 'Enumerators are designated public servants acting under statutory authority with official identification badges issued by District Magistrates/Municipal Commissioners.',
    icon: 'Award'
  }
];

export const GROUNDED_FAQS = [
  {
    question: 'What is India\'s Digital Census 2027?',
    answer: 'The upcoming Census of India is the 16th National Census (8th post-independence) and the first-ever 100% Digital Census. It replaces traditional paper schedules with a secured mobile enumeration app for field enumerators and introduces an optional Citizen Self-Enumeration Web Portal for households to enter their data digitally.'
  },
  {
    question: 'What are the two phases of the Census and how do they differ?',
    answer: 'Phase 1 is the Houselisting & Housing Census (HLO) which maps every dwelling, building condition, drinking water, sanitation, kitchen fuel, and household assets (31 parameters). Phase 2 is the Population Enumeration (PE) which counts every individual resident and records age, sex, religion, SC/ST, literacy, languages, occupation, and migration (29 parameters).'
  },
  {
    question: 'How does Citizen Self-Enumeration work?',
    answer: 'Citizens log in to the official Census self-enumeration portal using their mobile number. They fill out the Houselisting and Population details for their household. Upon completion, a unique Self-Enumeration (SE) Reference Number and QR Code are generated. When the visiting enumerator comes to the house, you simply show the QR code; the enumerator validates it on their tablet in seconds.'
  },
  {
    question: 'Is Self-Enumeration mandatory?',
    answer: 'No, Self-Enumeration is completely optional. If you do not wish to or are unable to fill out the form online, an official Government Census Enumerator will visit your residence in person and record all information digitally on their official tablet.'
  },
  {
    question: 'Does the Census ask for Bank Account, OTP, or UPI details?',
    answer: 'NEVER. The Census does NOT collect bank account numbers, IFSC codes, credit/debit card numbers, UPI IDs/PINs, or financial OTPs. Anyone asking for financial details or payment under the name of Census is a fraudster.'
  },
  {
    question: 'Are my personal responses confidential by law?',
    answer: 'Yes. Under Section 15 of the Census Act 1948, your individual answers are completely confidential and cannot be viewed by police, tax authorities, or private firms, nor can they be presented as evidence in any court of law.'
  },
  {
    question: 'What documents do I need to show to the enumerator?',
    answer: 'No physical documents or property deeds are required. The Census is based on oral self-declaration. You do not need to show Aadhaar, passport, land registry, or birth certificates.'
  },
  {
    question: 'How can I verify a real Census Enumerator at my door?',
    answer: 'An authentic enumerator will carry an official Photo Identity Card with a verification QR code signed by the local Census charge officer / Municipal Commissioner, and will use the designated official government Census mobile application. They will never demand any money.'
  }
];
