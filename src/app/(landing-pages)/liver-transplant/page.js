import LandingPageForm from "../components/LandingPageForm"
import LiverLandingBody from "../components/LiverLandingBody"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Liver Transplant - Rela Hospital",
  description: "Get Liver Transplant done from India's best liver transplant hospital. Rela Hospital has performed 2000+ liver transplants since 2010 with the world's largest dedicated LICU.",
  alternates: { canonical: `${SITE_URL}/liver-transplant` },
}

const heroHighlights = [
  "Liver Transplant Hospital with world's largest dedicated LICU",
  "First Successful Split & Auxiliary Liver Transplant Surgery in India",
  "2000+ liver transplants since 2010 with the best liver doctors",
  "India’s Youngest Successful Liver Transplant on a One-Month-Old Baby",
]

const successStories = [
  "India’s Youngest Successful Liver Transplantation on a One-Month-Old Baby",
  "First Successful Split & Auxiliary Liver Transplant Surgery in India",
  "First Paediatric Auxiliary Liver Transplant in Asia",
  "First Swap Liver Transplant on Adults in India",
  "Prof. Mohamed Rela performed a successful liver transplantation on a 5-day-old girl, Baebhen Schutke, for which his name was registered in Guinness Book of World Records. Ms. Schutke is now 20 years old and is studying law.",
  "The three liver transplants done on infants with biliary atresia from Nellore, Bangalore and Delhi in July 2020 during this pandemic despite travel restrictions and logistic difficulties was one of our recent achievements.",
  "Rela Hospital sets new global benchmark in liver transplant patient survival rate. Worldwide the patient survival rate averages at 90% while Rela Hospital achieved a 99.2% patient survival rate.",
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-doctor-team-liver-department-banner.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Get Liver Transplant Done from India&apos;s Best <br className="desktop_break" /><span>Liver Transplant</span> Hospital</h1>
            <p className="white_text">Get consulted from Chennai&apos;s Leading Liver doctors</p>
            <ul>
              {heroHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Liver Transplant" />
          </div>
        </div>
      </section>

      <LiverLandingBody
        gastroIntro="The Institute of Gastroenterology is state-of-the-art, technologically avant-garde department that specializes in stomach and gut health. Our best gastroenterology doctors in Chennai work in close partnership with a range of other specialists, including experts in radiology, pathology, and oncology."
        successStories={successStories}
      />
    </>
  )
}
