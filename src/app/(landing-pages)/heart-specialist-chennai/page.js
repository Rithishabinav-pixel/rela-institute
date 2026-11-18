import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import CardioLandingBody from "../components/CardioLandingBody"
import StatCounterRow from "../components/StatCounterRow"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Heart Specialist Chennai - Rela Hospital",
  description: "Get consulted from Rela's best heart specialist in Chennai. Dr. V. Narendra Kumar offers expert interventional cardiology, heart failure and transplant cardiology care.",
  alternates: { canonical: `${SITE_URL}/heart-specialist-chennai` },
}

const doctorStats = [
  { value: 8000, label: "Coronary Angiograms" },
  { value: 700, label: "Angioplasties" },
  { value: 300, label: "Primary Angioplasties in Acute MI" },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/udhay-360.png)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Get Consulted from Rela&apos;s Best <br className="desktop_break" /><span>Cardiologist</span> in Chennai</h1>
            <p className="white_text">Let us help you be heart-healthy!</p>

            <div className={style.doctorStrip}>
              <div className={style.avatar}>
                <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/udhay-360.png" alt="Dr Narendra Kumar" width={72} height={72} />
              </div>
              <div>
                <h4>Dr Narendra Kumar</h4>
                <p>Senior Consultant, Interventional Cardiology, Heart Failure &amp; Transplant Cardiology</p>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <StatCounterRow stats={doctorStats} light />
            </div>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Cardiology - Heart Specialist Chennai" />
          </div>
        </div>
      </section>

      <CardioLandingBody procedureHeading="Heart Treatments and Procedures" consultLinkText="Consult our Heart Specialist in Chennai" />
    </>
  )
}
