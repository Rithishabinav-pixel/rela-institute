import LandingPageForm from "../components/LandingPageForm"
import LiverLandingBody from "../components/LiverLandingBody"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Liver Hospital Rela - Rela Hospital",
  description: "India's leading liver doctors in Chennai. Rela Hospital is a liver hospital with the world's largest dedicated LICU and the first split liver transplant surgery in India.",
  alternates: { canonical: `${SITE_URL}/liver-hospital-rela` },
}

const heroHighlights = [
  "Liver Hospital with world's largest dedicated LICU",
  "First Successful Split & Auxiliary Liver Transplant Surgery in India",
  "2000+ liver transplants since 2010 with the best liver doctors",
  "India’s Youngest Successful Liver Transplant on a One-Month-Old Baby",
]

const successStories = [
  "Prof. Mohamed Rela performed a successful liver transplantation on a 5-day-old girl, Baebhen Schutke, for which his name was registered in Guinness Book of World Records. Ms. Schutke is now 20 years old and is studying law.",
  "India’s Youngest Successful Liver Transplantation on a One-Month-Old Baby, performed at Dr Rela Institute & Medical Centre.",
  "The three liver transplants done on infants with biliary atresia from Nellore, Bangalore and Delhi in July 2020 during this pandemic despite travel restrictions and logistic difficulties was one of our recent achievements.",
  "Rela Hospital sets new global benchmark in liver transplant patient survival rate. Worldwide the patient survival rate averages at 90% while Rela Hospital achieved a 99.2% patient survival rate.",
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-doctor-team-liver-department-banner.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">India&apos;s Leading <br className="desktop_break" /><span>Liver Doctors</span> in Chennai</h1>
            <ul>
              {heroHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Liver Hospital" />
          </div>
        </div>
      </section>

      <LiverLandingBody successStories={successStories} />
    </>
  )
}
