import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import StatCounterRow from "../components/StatCounterRow"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Rela | Multi Speciality Hospital",
  description: "Dr. Rela Institute & Medical Centre is an international quaternary care hospital in Chromepet, Chennai with 450 beds, 130 critical care beds and 14 operating rooms.",
  alternates: { canonical: `${SITE_URL}/rela-hospital` },
}

const stats = [
  { value: 450, label: "Beds" },
  { value: 130, label: "Critical Care Beds" },
  { value: 14, label: "Operating Rooms" },
  { value: 36, label: "Acres Campus" },
]

const infrastructureHighlights = [
  { name: "Advanced Endoscopy", icon: "advanced-infrastructure.svg" },
  { name: "Integrated Liver Ambulance", icon: "ambulance.svg" },
  { name: "International Desk", icon: "international-surgeries.svg" },
  { name: "Radiology and Imaging Sciences", icon: "xray.svg" },
  { name: "Outpatient and Inpatient Services", icon: "clinical-excellence.svg" },
]

const specialities = [
  "Liver Disease and Transplantation", "Gastroenterology", "Advanced Paediatrics", "Anaesthesia & ICU",
  "Obstetrics and Gynaecology", "Orthopaedics", "Reproductive Medicine", "Cardiology",
  "Ear, Nose and Throat", "Emergency Medicine", "Hepatology", "Internal Medicine & Diabetology",
  "Interventional Radiology and Imaging Services", "Medical Oncology", "Neonatology", "Nephrology",
  "Neurosurgery", "Neurology", "Ophthalmology", "Pathology", "Plastic & Reconstructive Surgery",
  "Pulmonary Medicine", "Radiation Oncology", "Radiology and Imaging Sciences", "Surgical Oncology",
  "Transfusion Medicine", "Urology",
]

const awards = [
  { title: "Lifetime Achievement Award", year: "Prof. Dr. Mohamed Rela" },
  { title: "Best Emerging Hospitals Award", year: "2025" },
  { title: "Best Liver Transplant Unit", year: "2025" },
  { title: "Best Performing Live Liver Transplant", year: "2019-2020" },
]

const successStories = [
  "The three liver transplants done on infants with biliary atresia from Nellore, Bangalore and Delhi in July 2020 during this pandemic despite travel restrictions and logistic difficulties was one of our recent achievements.",
  "Mr. Vignesh S, 29 years had undergone Brain Tumor Surgery by Dr. Paraneetharan Marimuthu, Consultant Neurosurgery at Dr. Rela Institute & Medical Centre, Chennai India.",
  "Dr. G. Buvaneswari, IVF Consultant and team for the successful delivery of IVF twins at Dr. Rela Institute & Medical Centre.",
  "Baby Huda had undergone Head Injury treatment by Dr. Paraneetharan Marimuthu, Consultant Neurosurgery at Dr. Rela Institute & Medical Centre, Chennai India.",
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rimc-image.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Dr. Rela Institute &amp; <br className="desktop_break" /><span>Medical Centre</span></h1>
            <p className="white_text">Multi Speciality Hospital in Chrompet, Chennai</p>

            <div style={{ marginTop: "16px" }}>
              <StatCounterRow stats={stats} light />
            </div>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Rela Hospital" />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading left" data-aos="fade-up">
            <h2 className="common_heading">Infrastructure &amp; <span>Technology</span></h2>
            <p>Dr. Rela Institute &amp; Medical Centre, an international medical facility, is a quaternary care hospital with access to cutting-edge technology and experienced, caring medical professionals, located on a sprawling 36-acre campus in Chromepet, Chennai, India.</p>
          </div>
          <div className={style.linkCards} data-aos="fade-up">
            {infrastructureHighlights.map((item) => (
              <div className={style.linkCard} key={item.name}>
                <div className={style.icon}>
                  <Image src={`/assets/images/${item.icon}`} alt="" width={40} height={40} />
                </div>
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Tales of <span>Trust</span></h2>
          </div>
          <div className={style.testimonialGrid} data-aos="fade-up">
            <div className={style.testimonialCard}>
              <p>It has been one year since I underwent liver transplantation. My entire family and I are very thankful to the transplant team at Rela Hospital, especially Dr. Dinesh and Dr. Kumar, and last but not least their nursing and lab staff, for their support, assistance, and guidance before and after the transplant.</p>
              <div className={style.author}>Dr. Srinivas Rekapalli</div>
            </div>
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Specialities</span></h2>
            <h4>Rela Hospital has multiple Centres of Excellence and Departments, such as:</h4>
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {specialities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Awards</span></h2>
          </div>
          <div className={style.awardCards} data-aos="fade-up">
            {awards.map((item) => (
              <div className={style.awardCard} key={item.title}>
                <Image src="/assets/images/award-icon.svg" alt="" width={90} height={90} />
                <h3>{item.title}</h3>
                <p>{item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Success <span>Stories</span></h2>
          </div>
          <ul className="common_list" style={{ marginTop: "24px" }}>
            {successStories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`common_section ${style.ctaSection}`}>
        <div className="container">
          <h2 className="common_heading">TAKE A STEP TOWARDS NEW LIFE</h2>
          <div className={style.ctaButtons}>
            <a href="#bookanappointment" className="common_btn white_btn">Book an Appointment <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
