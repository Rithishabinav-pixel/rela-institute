import LandingPageForm from "../components/LandingPageForm"
import CardioLandingBody from "../components/CardioLandingBody"
import StatCounterRow from "../components/StatCounterRow"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Cardiologist in Chennai - Rela Hospital",
  description: "Get consulted from Rela's best cardiologist in Chennai, with 5000+ cardiac procedures in the last 10 years and over 100 PTCA angioplasty procedures performed.",
  alternates: { canonical: `${SITE_URL}/cardiologist-in-chennai` },
}

const stats = [
  { value: 40, label: "Primary PTCA, door-to-balloon under 90 min" },
  { value: 5000, label: "Cardiac procedures in 10 years" },
  { value: 800, label: "Cath procedures since inception" },
  { value: 100, label: "PTCA (angioplasty) procedures" },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/heart-transplant.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Get Consulted from Rela&apos;s Best <br className="desktop_break" /><span>Cardiologist</span> in Chennai</h1>
            <p className="white_text">Let us help you be heart-healthy!</p>

            <div style={{ marginTop: "20px" }}>
              <StatCounterRow stats={stats} light />
            </div>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Cardiology - Cardiologist in Chennai" />
          </div>
        </div>
      </section>

      <CardioLandingBody procedureHeading="Cardio Treatments and Procedures" consultLinkText="Consult our Cardiologist in Chennai" />
    </>
  )
}
