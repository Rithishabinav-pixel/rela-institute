const PDF_BASE = 'https://www.relainstitute.com/resource-center/pdfs/'
const IMG_BASE = 'https://www.relainstitute.com/resource-center/images/'
const UPLOADS = 'https://www.relainstitute.com/wp-content/uploads/'

export const resourceCategoryRows = [
  {
    name: 'Liver Disease and Transplantation',
    imageUrl: `${IMG_BASE}liver.png`,
    resources: [
      { title: 'Life After Transplant', pdfUrl: `${PDF_BASE}Life-After-Tx-RIMC-v4-19th-Oct-19.pdf` },
      { title: 'Alcoholic Liver Disease', pdfUrl: `${PDF_BASE}alcoholic-liver-disese.pdf` },
      { title: 'Post Transplantation Advice to Patient & Attenders', pdfUrl: `${PDF_BASE}Post-Tx-Advice-Patient-Attenders-Brochure-v5-17th-Feb-20.pdf` },
      { title: 'Liver Transplant Patient Guide', pdfUrl: `${PDF_BASE}Liver-Tx-Brochure-v4-3rd-Mar-20.pdf` },
      { title: 'Liver Biopsy', pdfUrl: `${PDF_BASE}Liver-Biopsy-v4-11th-Dec-19.pdf` },
      { title: 'Having Warfarin Patient Guide', pdfUrl: `${PDF_BASE}Warfarin-Patient-Guide-v6-25th-May-19.pdf` },
    ],
  },
  {
    name: 'Dietary',
    imageUrl: `${IMG_BASE}Dietary.png`,
    resources: [
      { title: 'Compensated Liver Disease', pdfUrl: `${PDF_BASE}Compensated-Liver-Disease-Brochure-19th-Mar-19.pdf` },
      { title: 'Diatbetic Diet Chart', pdfUrl: `${PDF_BASE}Diabetic-diet-Chart.pdf` },
      { title: 'Transplant Diet Chart', pdfUrl: `${PDF_BASE}Transplant-Diet-Chart-Brochure-19th-Mar-19.pdf` },
      { title: 'Low Pottasium', pdfUrl: `${PDF_BASE}Low-Potassium.pdf` },
      { title: 'Weight Reduction', pdfUrl: `${PDF_BASE}Weight-Reduction.pdf` },
    ],
  },
  {
    name: 'Endocrinology',
    imageUrl: `${IMG_BASE}Endocrine.png`,
    resources: [
      { title: 'Transgender Health Definitions', pdfUrl: `${PDF_BASE}transgender-health-20th-sep-19.pdf` },
      { title: 'Family & Diabetes', pdfUrl: `${PDF_BASE}family-diabetes-brochure-22nd-sep-19.pdf` },
      { title: 'Vitamins & Bone Health', pdfUrl: `${PDF_BASE}vitamins-bone-health-brochure-20th-sep-19.pdf` },
      { title: 'Primary Ovarian', pdfUrl: `${PDF_BASE}primary-ovarian-20th-sep-19.pdf` },
      { title: 'Primary-Hyperparathyroidism', pdfUrl: `${PDF_BASE}primary-hyperparathyroidism-20th-sep-19.pdf` },
      { title: 'PCOS for Teens', pdfUrl: `${PDF_BASE}pcos-for-teens.pdf` },
      { title: 'Osteoporosis', pdfUrl: `${PDF_BASE}osteoporosis-brochure-20th-sep-19.pdf` },
      { title: 'Gestational Diabetes', pdfUrl: `${PDF_BASE}gestational-diabetes.pdf` },
      { title: 'Hirsutism', pdfUrl: `${PDF_BASE}hirsutism-brochure-26th-apr-19.pdf` },
      { title: 'Menopause Symptoms', pdfUrl: `${PDF_BASE}menopause-symptoms-16th-july-19.pdf` },
    ],
  },
  {
    name: 'Gastroenterology',
    imageUrl: `${IMG_BASE}Gastroenterology.png`,
    resources: [
      { title: 'Gastroscopy', pdfUrl: `${PDF_BASE}gastroscopy-brochure-20th-sep-19.pdf` },
      { title: 'Having an ERCP', pdfUrl: `${PDF_BASE}ercp-brochure-20th-sep-19.pdf` },
      { title: 'Heartburn (Oesophageal Reflux)', pdfUrl: `${PDF_BASE}heartburn-oesophageal-reflux-20th-sep-19.pdf` },
      { title: 'Irritable Bowel Syndrome (IBS)', pdfUrl: `${PDF_BASE}irritable-bowel-syndrome-ibs-20th-sep-19.pdf` },
      { title: 'Helicobacter Pylori (H. pylori)', pdfUrl: `${PDF_BASE}helicobacter-pylori-h-pylori-brochure-20th-sep-19.pdf` },
      { title: 'Capsule Endoscopy', pdfUrl: `${PDF_BASE}capsule-endoscopy-brochure-20th-sep-19.pdf` },
      { title: 'Inflammatory Bowel Disease (IBD)', pdfUrl: `${PDF_BASE}inflammatory-boweldisease-ibd-20th-sep-19.pdf` },
      { title: 'Constipation', pdfUrl: `${PDF_BASE}constipation-brochure-19th-oct-19.pdf` },
      { title: 'Diarrhoea, Dehydration, Oral Rehydration Salts', pdfUrl: `${PDF_BASE}diarrhoea-dehydr-oral-rehydration-brochure-19th-oct-19.pdf` },
      { title: 'Diet advice and bowel preparation for your colonoscopy', pdfUrl: `${PDF_BASE}colonoscopy-brochure-20th-sep-19.pdf` },
      { title: 'Endoscopic Ultrasound (EUS)', pdfUrl: `${PDF_BASE}endoscopic-ultrasound-faqs-19th-oct-19.pdf` },
      { title: 'Gastrointestinal Disease', pdfUrl: `${PDF_BASE}gastrointestinal-disease-brochure-19th-oct-19.pdf` },
      { title: 'Iron Deficiency (Anemia)', pdfUrl: `${PDF_BASE}iron-deficiency-brochure-19th-oct-19.pdf` },
    ],
  },
  {
    name: 'ICUs',
    imageUrl: `${IMG_BASE}ICUs.png`,
    resources: [{ title: 'ICU Brochure', pdfUrl: `${PDF_BASE}ICU-Brochure-rev4.pdf` }],
  },
  {
    name: 'Interventional Radiology',
    imageUrl: `${IMG_BASE}Interventional-Radiology.png`,
    resources: [{ title: 'TACE Brochure', pdfUrl: `${PDF_BASE}TACE-17th-July-19.pdf` }],
  },
  {
    name: 'Nephrology',
    imageUrl: `${IMG_BASE}Nephrology.png`,
    resources: [{ title: 'A healthy diet and lifestyle for your kidneys', pdfUrl: `${PDF_BASE}diet-lifeStyle-kidney-stone-20th-sep-19.pdf` }],
  },
  {
    name: 'Neuro Surgery',
    imageUrl: `${IMG_BASE}Neuro-Surgery.png`,
    resources: [
      { title: 'Neuro Dept Brochure', pdfUrl: `${PDF_BASE}Neuro-Brochure-curved-24th-Apr-19.pdf` },
      { title: 'Tremors', pdfUrl: `${PDF_BASE}Tremors-Brochure-24th-Apr-19.pdf` },
      { title: "Parkinson's Disease", pdfUrl: `${PDF_BASE}Parkinsons-Brochure-24th-Apr-19.pdf` },
      { title: 'Epilepsy', pdfUrl: `${PDF_BASE}Epilepsy-Brochure-24th-Apr-19.pdf` },
      { title: 'Stroke', pdfUrl: `${PDF_BASE}Stroke-Brochure-24th-Apr-19.pdf` },
      { title: 'Brain Tumor', pdfUrl: `${PDF_BASE}brain-tumor-16th-july-19.pdf` },
      { title: 'Traumatic Brain Injury', pdfUrl: `${PDF_BASE}traumatic-bain-injury-brochure-8th-nov-19.pdf` },
    ],
  },
  {
    name: 'Obstetrics and Gynaecology',
    imageUrl: `${IMG_BASE}Obstetrics-and-Gynaecology.png`,
    resources: [
      { title: 'Caring for Your Mind After Birth', pdfUrl: `${UPLOADS}2026/03/Postnatal.pdf` },
      { title: 'Caring for Your Mind and Heart During Pregnancy', pdfUrl: `${UPLOADS}2026/03/Antenatal-Broucher.pdf` },
      { title: 'Vaccinations', pdfUrl: `${PDF_BASE}vaccine-brochure-20th-sep-19.pdf` },
      { title: 'Breastfeeding', pdfUrl: `${UPLOADS}2026/01/BREASTFEEDING-HANDBOOK-V5.pdf` },
      { title: 'Pain Relieving During Pregnancy', pdfUrl: `${PDF_BASE}pain-relieving-pregnancy-22nd-sep-19.pdf` },
      { title: "Do's and Dont's-During Pregnancy", pdfUrl: `${UPLOADS}2026/01/DosDonts_During-Pregnancy_22nd-Sep19.pdf` },
    ],
  },
  {
    name: 'Oral & Maxillofacial Surgery',
    imageUrl: `${IMG_BASE}Oral.png`,
    resources: [
      { title: 'Oral Hygiene', pdfUrl: `${PDF_BASE}Oral-Hygiene-Brochure-16th-July-19.pdf` },
      { title: 'Dental Surgery - Department Brochure', pdfUrl: `${PDF_BASE}Dental-brochure-v5-5th-Feb-20.pdf` },
    ],
  },
  {
    name: 'Orthopaedics',
    imageUrl: `${IMG_BASE}Orthopaedics.png`,
    resources: [
      { title: 'Cerebral Palsy', pdfUrl: `${PDF_BASE}Cerebral-Palsy-curved-26th-Dec-19.pdf` },
      { title: 'Care of Casts & Splints', pdfUrl: `${PDF_BASE}cast-or-splint-26th-dec-19.pdf` },
      { title: 'Paed. Orthopaedist', pdfUrl: `${PDF_BASE}Paed-Orthopaedist-Brochure-curved-27th-Dec-19.pdf` },
    ],
  },
  {
    name: 'Paediatrics',
    imageUrl: `${IMG_BASE}Paediatrics.png`,
    resources: [
      { title: 'Specialised Paediatric Adolescent Endocrinology Care', pdfUrl: `${UPLOADS}2026/01/Paediatric-broucher-v2.pdf` },
      { title: 'Jaundice in Newborn', pdfUrl: `${PDF_BASE}Jaundice-Paed-11th-July-19.pdf` },
      { title: 'Blood & Marrow Transplant', pdfUrl: `${PDF_BASE}bmt-brochure-20th-sep-19.pdf` },
      { title: 'Thalassaemia', pdfUrl: `${PDF_BASE}Thalassaemia-Brochure-v2-6th-May-19.pdf` },
      { title: 'Paediatric Dept. Brochure', pdfUrl: `${UPLOADS}2026/02/Paed.-Consultants-Broucher.pdf` },
      { title: 'Child Health Record Booklet', pdfUrl: `${PDF_BASE}Women-Children-Brochure-v9-6th-May-19-19.pdf` },
      { title: 'Biliary Atresia', pdfUrl: `${PDF_BASE}biliary-atresia-brochure-9th-nov-19.pdf` },
      { title: 'Paediatric Liver Transplantation Brochure', pdfUrl: `${UPLOADS}2026/02/01.-Paed.-Liver-Transplant-Bochure-English-final.pdf` },
    ],
  },
  {
    name: 'Transfusion Medicine',
    imageUrl: `${IMG_BASE}Transfusion-Medicine.png`,
    resources: [
      { title: 'Platelets', pdfUrl: `${PDF_BASE}Platelet-Donation-Brochure-Tml-5th-Jun-20.pdf` },
      { title: 'Blood Donor', pdfUrl: `${PDF_BASE}Blood-Donor-Brochure-Tml-5th-Jun-20.pdf` },
      { title: 'Blood Transfusion', pdfUrl: `${PDF_BASE}blood-transfusion-brochure-24th-oct-19.pdf` },
    ],
  },
  {
    name: 'Urology',
    imageUrl: `${IMG_BASE}Urology.png`,
    resources: [
      { title: 'Bed-wetting', pdfUrl: `${PDF_BASE}bed-wetting-brochure-20th-sep-19.pdf` },
      { title: 'Prostate Enlargement', pdfUrl: `${PDF_BASE}prostate-gland-brochure-20th-sep-19.pdf` },
      { title: 'Urinary Incontinence', pdfUrl: `${UPLOADS}2026/01/Urinary-Incontinence_20th-Sep19.pdf` },
      { title: 'Urinary Tract Infection', pdfUrl: `${UPLOADS}2026/01/Urinary-Tract-Infections_20th-Sep19.pdf` },
      { title: 'Benign Prostate Hyperplasia (BPH)', pdfUrl: `${UPLOADS}2026/01/Prostate-Gland_Brochure_20th-Sep19.pdf` },
    ],
  },
  {
    name: 'Cardiology',
    imageUrl: `${UPLOADS}2022/12/Cardiology-department-1-1.webp`,
    resources: [{ title: 'Heart Lung Transplant', pdfUrl: `${UPLOADS}2026/01/heart-lung-transplant-brochure-V9.pdf` }],
  },
  {
    name: 'Cancer Center',
    imageUrl: `${UPLOADS}2026/01/Cancer-center-new.png`,
    resources: [
      { title: 'Comprehensive Cancer Care All in One Place', pdfUrl: `${UPLOADS}2026/01/Oncology-services.pdf` },
      { title: 'Prostate Cancer', pdfUrl: `${UPLOADS}2026/01/Prostate-Cancer_20th-Sep19.pdf` },
    ],
  },
  {
    name: 'Pulmonary Medicine',
    imageUrl: `${UPLOADS}2022/12/pulmonoligy-1.png`,
    resources: [
      { title: 'Pulmonary Medicine', pdfUrl: `${UPLOADS}2026/01/Pulmonary-Med-Brochure_5th-Oct19.pdf` },
      { title: 'EBUs', pdfUrl: `${UPLOADS}2026/01/Ebus-Flyer-A5.pdf` },
      { title: 'COPD', pdfUrl: `${UPLOADS}2026/01/COPD.pdf` },
    ],
  },
  {
    name: 'Paediatric Haematology, Oncology, Immunology, Blood & Marrow Transplantation',
    imageUrl: `${UPLOADS}2026/02/Paediatric-Haematology-Oncology-Bone-Marrow-Transplantation.png`,
    resources: [{ title: 'Blood & Marrow Transplant', pdfUrl: `${UPLOADS}2026/01/BMT-Brochure_curved_16th-Oct19.pdf` }],
  },
  {
    name: 'Dermatology',
    imageUrl: `${UPLOADS}2022/12/dermatology-1.png`,
    resources: [{ title: 'Discover Laser Hair Reduction', pdfUrl: `${UPLOADS}2026/02/Discover-Laser-Hair-Reduction.pdf` }],
  },
  {
    name: 'Physiotherapy',
    imageUrl: `${UPLOADS}2026/02/physiotherapy.png`,
    resources: [
      { title: 'Home Exercise Program for Fatty Liver Patients', pdfUrl: `${UPLOADS}2026/02/Home-Exercise-Program.pdf` },
      { title: 'Rebuild, Restore, Revitalize: Postnatal Exercises for Healthier You', pdfUrl: `${UPLOADS}2026/02/Rebuild-Restore-Revitalize-Postnatal-Exercises-for-Healthier-You.pdf` },
    ],
  },
  {
    name: 'Infection Prevention Control',
    imageUrl: `${UPLOADS}2026/02/Infection-Prevention-Control.png`,
    resources: [{ title: 'Newsletter – February 2026', pdfUrl: `${UPLOADS}2026/02/Infection-Prevention-1-2.pdf` }],
  },
  {
    name: 'Pharmacy',
    imageUrl: `${UPLOADS}2026/02/pharmacy.webp`,
    resources: [
      { title: 'Vaccines', pdfUrl: `${UPLOADS}2026/02/Vaccine-3.pdf` },
      { title: 'Valganciclovir – Tablet & Solution', pdfUrl: `${UPLOADS}2026/02/VALGANCICLOVIR-3.pdf` },
      { title: 'Understanding ATT – A Guide to Anti-Tubercular Drugs', pdfUrl: `${UPLOADS}2026/02/ATT-1.pdf` },
      { title: 'A Step Towards a Better Life', pdfUrl: `${UPLOADS}2026/02/OHA-2.pdf` },
    ],
  },
  {
    name: 'Psychology',
    imageUrl: `${UPLOADS}2026/03/Psychology.png`,
    resources: [{ title: 'Prioritizing Your Mental Health A Patient ducation Guide', pdfUrl: `${UPLOADS}2026/03/Mental-health.pdf` }],
  },
  {
    name: 'Lung Transplantation',
    imageUrl: `${UPLOADS}2022/12/Heart-And-Lung-Transplantation.png`,
    resources: [{ title: 'Lung Transplant Broucher', pdfUrl: `${UPLOADS}2026/03/Lung-Transplant-Broucher.pdf` }],
  },
]
