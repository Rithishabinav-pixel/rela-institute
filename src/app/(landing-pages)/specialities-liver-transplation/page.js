import Image from "next/image"
import LiverEnquiryForm from "../components/LiverEnquiryForm"
import StatCounterRow from "../components/StatCounterRow"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Specialities Liver Transplation - Rela Hospital",
  description: "Rely on Rela for Liver Disease Management. Rela Institute of Liver Disease & Transplantation offers 30+ years of experience, 6000+ liver transplants and 750+ paediatric liver transplants.",
  alternates: { canonical: `${SITE_URL}/specialities-liver-transplation` },
}

const stats = [
  { value: 30, label: "Years Of Experience" },
  { value: 6000, label: "Liver Transplants" },
  { value: 750, label: "Pediatric Liver Transplants In India" },
  { value: 200, label: "Robotic-Assisted Donor Liver Surgeries / Year" },
]

const highlights = [
  "The largest pediatric liver transplant program",
  "Liver Transplant ICU",
  "Largest robotic Hepato Pancreato Biliary",
]

const techHighlights = [
  { name: "First Integrated Liver Emergency Ambulance in India", icon: "ambulance.svg", text: "Specialized emergency response to stabilize patients during transport." },
  { name: "Modern Technology in 14 Theaters", icon: "advanced-infrastructure.svg", text: "The most recent innovations in surgical facilities for precise, complex treatments." },
  { name: "Individualised, Internationally Benchmarked Care", icon: "clinical-excellence.svg", text: "Strict international guidelines guaranteeing quality and safety for every technology used." },
]

const conditions = [
  "Liver Diseases (general term)", "Chronic Liver Disease", "Acute Liver Failure", "Liver Cirrhosis",
  "Non-Alcoholic Fatty Liver Disease", "Alcoholic Liver Disease", "Ascites", "Hepatitis B", "Hepatitis C",
  "Hepatic Encephalopathy", "Wilson's Disease", "Primary Biliary Cholangitis", "Crigler Najjar Syndrome",
  "Galactosemia", "Budd Chiari Syndrome", "Liver Transplantation", "Paediatric Liver Disease & Transplantation",
  "Liver Cancer", "Liver Tumours", "Bile Duct Tumours", "Diseases Of The Pancreas",
  "Combined Liver And Kidney Transplantation", "Liver Resection", "Pancreas Transplant",
  "Combined Pancreas & Kidney Transplant", "Gallbladder Diseases", "Gallstone Disease", "Gallbladder Polyps",
  "Choledocholithiasis", "Liver Metastasis", "Cholangitis", "Liver Adenoma", "Hepatorenal Syndrome",
  "Portal Hypertension", "Hemangioma", "Vascular Access - Fistula Formation For Dialysis",
]

const teamGroups = [
  {
    heading: "Chairman",
    members: [
      { name: "Prof. Mohamed Rela", qualification: "MS, FRCS, DSc", designation: "Chairman & Director, Rela Hospital" },
    ],
  },
  {
    heading: "HPB Surgery & Liver Transplantation",
    members: [
      { name: "Dr. Gomathy Narasimhan", qualification: "MBBS, MS, ASTS Fellowship (USA)", designation: "Senior Consultant Liver and Renal Transplant Surgeon" },
      { name: "Dr. Rajesh Rajalingam", qualification: "MBBS, MS, MCh", designation: "Clinical Lead - HPB Surgery; Senior Consultant, Abdominal Trauma, HPB Surgery" },
      { name: "Dr. Kumar Palaniappan", qualification: "MBBS, DNB (GI), Fellowship In HPT & Liver Transplant", designation: "Clinical Lead - Laparoscopy Liver Surgery" },
      { name: "Dr. Ashwin Rammohan", qualification: "MBBS, MCh(GE), DNB, MRCS(Ed&Glasg), DChir(Fr.), FRCSGlasg, PDF(LT)", designation: "Consultant - HPB Surgery and Liver Transplantation" },
      { name: "Dr. Ramkiran Reddy Cherukuru", qualification: "MBBS, MS, DNB (GI Surgery), MRCS (Edin), Liver Transplant Fellowship", designation: "Consultant, Abdominal Trauma, HPB Surgery and Liver Transplantation" },
      { name: "Dr. Vasantha Kumar", qualification: "MBBS, MS, MCH, FMAS", designation: "Associate Consultant, Abdominal Trauma, HPB Surgery and Liver Transplantation" },
      { name: "Dr. R. Muthukumarassamy", qualification: "MBBS, MS, DNB, FNB, MNAMS, MRCS, PhD", designation: "Associate Consultant, Abdominal Trauma, HPB Surgery and Liver Transplantation" },
      { name: "Dr. Jasper Sandeep Rajasekar", qualification: "MBBS, MS, MCH", designation: "Associate Consultant, Abdominal Trauma, HPB Surgery and Liver Transplantation" },
      { name: "Dr. Arul Kumar S", qualification: "MBBS, MS In General Surgery, Fellowship In HPB Surgery, Fellow In Liver Transplantation", designation: "Associate Consultant - HPB Surgery and Liver Transplantation" },
    ],
  },
  {
    heading: "Adult Hepatology",
    members: [
      { name: "Dr. Dinesh Jothimani", qualification: "MRCP (UK), FRCP (Glasgow), CCT (Hepatology, UK)", designation: "Director – Hepatology" },
      { name: "Dr. Vaibhav Patil", qualification: "MBBS, DNB (Medicine), DNB (Gastroenterology)", designation: "Consultant" },
      { name: "Dr. Radhika Venugopal", qualification: "M.B.B.S., M.D", designation: "Consultant" },
      { name: "Dr. Navin Kumar Marannan", qualification: "MBBS, MD Medicine, DM Hepatology", designation: "Consultant - Hepatology" },
      { name: "Dr. Karan", qualification: "MBBS, MD Medicine, DM Medical Gastroenterology", designation: "Associate Consultant" },
    ],
  },
  {
    heading: "Paediatric Hepatology / Paediatric Intensive Care",
    members: [
      { name: "Dr. Naresh Shanmugam", qualification: "MBBS, DCH, DNB(Paed), FRCPCH, Dip. In Nutri Medicine (UK), CCT (UK), CSST (UK)", designation: "Director - Women and Child Health & Senior Consultant - Paediatric Gastroenterology & Hepatology" },
      { name: "Dr. Jagadeesh Menon VR", qualification: "MBBS, MD (Paediatrics), DM (Paediatric Gastroenterology)", designation: "Paediatric Hepatology - Consultant" },
      { name: "Dr. T Ravikumar", qualification: "MD (Paeds), IDPCCM, Fellowship In PCCM, STEP Fellowship", designation: "Senior Consultant and Clinical Lead" },
      { name: "Dr. P. Saravanan", qualification: "MBBS, DNB, MRCS, M.Ch (Surgical Oncology)", designation: "Visiting Consultant - Surgical Oncologist" },
      { name: "Dr. Sonal Gajbhiye", qualification: "M.B.B.S, M.D Pediatrics, IFPCCM", designation: "PICU - Consultant" },
      { name: "Dr. Anu K Vasu", qualification: "MBBS, DNB Pediatrics, DCH", designation: "Paediatric Hepatology - Consultant" },
      { name: "Dr N. Saravana Pandian", qualification: "MD (Ped), FNB (Pediatric Intensive Care)", designation: "Consultant Pediatrician" },
    ],
  },
  {
    heading: "Liver Intensive Care & Anaesthesia",
    members: [
      { name: "Dr. Akila Rajakumar", qualification: "MBBS, MD (Anesthesia), FRCA", designation: "Senior Consultant and Clinical Lead" },
      { name: "Dr. Ilankumaran Kaliamoorthy", qualification: "FRCA", designation: "Chief Executive Officer & Senior Consultant, Liver Anaesthesia & Intensive Care" },
      { name: "Dr. B. Balaji", qualification: "MBBS, DA, DNB", designation: "Senior Consultant" },
      { name: "Dr. S. Giridharan", qualification: "MBBS, MD (Anesthesiology), Fellowship In Liver Critical Care", designation: "Consultant" },
      { name: "Dr. Madhumita Udayasankar", qualification: "MBBS, M.D In Anaesthesiology, PDF (Liver Transplant Anaesthesia), PDF Liver Intensive Care", designation: "Consultant" },
    ],
  },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-doctor-team-liver-department-banner.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Rely on <span>Rela</span> for Liver Disease <span>Management</span></h1>
            <p className="white_text">At Rela Institute of Liver Disease &amp; Transplantation (RILDT), our values are rooted in compassion, excellence, and innovation.</p>

            <div style={{ marginTop: "16px" }}>
              <StatCounterRow stats={stats} light />
            </div>

            <h4 className="white_text" style={{ marginTop: "20px" }}>Rela Hospital Proudly Hosts</h4>
            <ul className="common_list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LiverEnquiryForm />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Hear From Your <span>Near Native</span></h2>
          </div>
          <div className={style.testimonialGrid} data-aos="fade-up">
            <div className={style.testimonialCard}>
              <p>Geeta Awasthi&apos;s son, Siwansh, from Nepal, had liver problems since he was 1.5 years old. After a misdiagnosis at a local hospital, they went to Rela Hospital, Chennai, where Dr. Jagadeesh Menon VR diagnosed liver failure and recommended a transplant. Siwansh underwent a successful transplant on their sixth day there and was discharged within two weeks. Now three, he is healthy and developing normally.</p>
              <div className={style.author}>Siwansh&apos;s Story</div>
            </div>
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Why <span>Rela Hospital?</span></h2>
            <p>Rela Institute of Liver Disease &amp; Transplantation (RILDT), the best liver center in India, offers state-of-the-art medical care together with compassionate support, home to the largest intensive care unit in the world for liver patients, with NABH and ISO accreditations.</p>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/450-bed.png" alt="Rela Hospital infrastructure" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Treatments</span></h2>
            <h4>Medical Management &amp; Surgical Management</h4>
            <p>Rela Hospital is proud of its expert liver transplant team, which is dedicated to advanced care for our patients, offering excellent, personalised treatment to meet each patient&apos;s needs.</p>
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {conditions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Meet Our Liver Transplant <span>Experts</span></h2>
          </div>
          {teamGroups.map((group) => (
            <div key={group.heading} className={style.teamGroupWrap}>
              <h4 className={style.teamGroupHeading}>{group.heading}</h4>
              <div className={style.testimonialGrid}>
                {group.members.map((member) => (
                  <div className={style.testimonialCard} key={member.name}>
                    <p>{member.qualification}</p>
                    <div className={style.author}>{member.name}</div>
                    <p>{member.designation}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Advanced <span>Technology</span></h2>
          </div>
          <div className={style.featureCards} data-aos="fade-up">
            {techHighlights.map((item) => (
              <div className={style.featureCard} key={item.name}>
                <Image src={`/assets/images/${item.icon}`} alt="" width={80} height={80} />
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "32px", fontWeight: 600 }}>Rela Institute of Liver Diseases and Transplantation is expanding its services to Punjab, Haryana, Uttarakhand, Jammu and Kashmir, Himachal Pradesh, Maharashtra, Gujarat, Goa and Rajasthan.</p>
        </div>
      </section>

      <section className={`common_section ${style.ctaSection}`}>
        <div className="container">
          <h2 className="common_heading">TAKE A STEP TOWARDS NEW LIFE</h2>
          <div className={style.ctaButtons}>
            <a href="#bookanappointment" className="common_btn white_btn">Enquiry Now <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
