import Image from "next/image"
import WellnessCardForm from "../components/WellnessCardForm"
import StatCounterRow from "../components/StatCounterRow"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Neighborhood Community Activity - Rela Hospital",
  description: "Join the Rela Hospital Wellness Card programme and enjoy exclusive discounts on consultations, diagnostics, physiotherapy, scans and pharmacy for the next 2 years.",
  alternates: { canonical: `${SITE_URL}/neighborhood-community-activity` },
}

const topOffers = [
  { value: 20, label: "Off Out-Patient Consultation", suffix: "%" },
  { value: 15, label: "Off Physiotherapy", suffix: "%" },
  { value: 30, label: "Off Fibro Scan & DEXA Scan", suffix: "%" },
  { value: 40, label: "Off Digital Mammogram", suffix: "%" },
]

const offers = [
  "20% DISCOUNT on Out-Patient Consultation",
  "SPECIAL PRICE OF RS. 750/- (EACH) on Dental Consultation & Dental OPD Procedures",
  "FIRST 2 FREE CONSULTATIONS for IVF Treatment opinion",
  "15% DISCOUNT on Physiotherapy",
  "30% DISCOUNT on Fibro Scan & DEXA Scan",
  "40% DISCOUNT on Digital Mammogram",
  "10% DISCOUNT only for Medicines from our Pharmacy",
]

const includedServices = [
  { name: "Out-Patient Consultation", icon: "clinical-excellence.svg" },
  { name: "Dental Consultation & Dental OPD Procedures", icon: "advanced-healthcare.svg" },
  { name: "Radiology & Laboratory Investigations", icon: "xray.svg" },
  { name: "Laser Hair Removal", icon: "personalised-care.svg" },
  { name: "Pap Smear with Gynaec Consultation", icon: "gender.svg" },
  { name: "ECHO", icon: "echo.svg" },
  { name: "TMT", icon: "tmt.svg" },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/uploads/2024/12/Image-people.png)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Welcome to the Rela Hospital <br className="desktop_break" /><span>Family!</span></h1>
            <p className="white_text">Your wellness journey starts now. This Wellness Card is your key to exclusive offers — enjoy benefits for the next 2 years, with a personalized card on its way after you submit your details.</p>

            <div style={{ marginTop: "16px" }}>
              <StatCounterRow stats={topOffers} light />
            </div>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <WellnessCardForm />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Rela Hospital Community <span>Offers</span></h2>
          </div>
          <ul className="common_list" style={{ marginTop: "24px" }}>
            {offers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Included <span>Services</span></h2>
          </div>
          <div className={style.linkCards} data-aos="fade-up">
            {includedServices.map((item) => (
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

      <section className="common_section">
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image src="/assets/images/emergency.svg" alt="" width={32} height={32} />
          <p>Disclaimer: These discounts are not applicable for any of our hospital&apos;s fixed packages and Transplant workup. Card Valid till 31st December, 2026.</p>
        </div>
      </section>
    </>
  )
}
