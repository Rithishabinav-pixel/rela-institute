import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "IVF Treatment - Rela Hospital",
  description: "Get the best IVF treatment in Chennai at Rela Hospital. Explore In Vitro Fertilization, ICSI, fertility preservation and other advanced reproductive treatments.",
  alternates: { canonical: `${SITE_URL}/ivf-treatment` },
}

const whoNeedsIvf = [
  { name: "Women who have not conceived after 2 years", icon: "age-group.svg" },
  { name: "Male infertility with sperm count below 10 million", icon: "gender.svg" },
  { name: "Fertility preservation in cancer patients", icon: "clinical-excellence.svg" },
  { name: "Moderate to severe endometriosis", icon: "fasting.svg" },
  { name: "Patients without a functional uterus", icon: "research-innovation.svg" },
  { name: "Failure to conceive after 6 cycles of IUI", icon: "multidisciplinary-collaboration.svg" },
]

const successFactors = [
  "It is done only after other simple options of infertility treatments are ruled out.",
  "The success rate depends on various factors like age of the woman, quality of the eggs, quality of the sperm.",
  "Success rates decline as the woman ages above 35 years, with a higher risk of miscarriage.",
]

const whyRela = [
  { name: "Expert Fertility Specialists", icon: "expert.svg", text: "Consultants with deep experience managing infertility and high-risk reproductive care." },
  { name: "Advanced Reproductive Technology", icon: "advanced-healthcare.svg", text: "In-house labs equipped for IVF, ICSI, PGD/PGS and fertility preservation." },
  { name: "Multidisciplinary Care Team", icon: "multidisciplinary-collaboration.svg", text: "Fertility specialists working alongside radiology, pathology and oncology experts." },
  { name: "High Success Rates", icon: "research-innovation.svg", text: "Outcomes tracked and improved through continuous clinical research." },
]

const treatments = [
  "In Vitro Fertilization (IVF)", "Intracytoplasmic Sperm Injection (ICSI)", "Laser Assisted Hatching (LAH)",
  "Freezing & Vitrification", "Donor Program", "Pre-Genetic Diagnosis (PGD)", "Pre-Genetic Screening (PGS)",
  "Embryo Donation & Adoption", "Surrogacy", "Male Infertility Services", "Advanced Assisted Reproductive Techniques",
  "Operative Services", "Uterine Transplants (UTx)", "OncoFertility & Fertility Preservation",
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-facilty.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Get the best <br className="desktop_break" /><span>IVF treatment</span> in Chennai today!</h1>
            <p className="white_text">Advanced reproductive medicine, personalised fertility plans and a multidisciplinary team of specialists dedicated to helping you grow your family.</p>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="IVF Treatment" />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Who needs <span>IVF?</span></h2>
          </div>
          <div className={style.linkCards} data-aos="fade-up">
            {whoNeedsIvf.map((item) => (
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
            <h2 className="common_heading">Why Choose <span>Rela?</span></h2>
          </div>
          <div className={style.featureCards} data-aos="fade-up">
            {whyRela.map((item) => (
              <div className={style.featureCard} key={item.name}>
                <Image src={`/assets/images/${item.icon}`} alt="" width={80} height={80} />
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">What is the success rate of <span>IVF?</span></h2>
            <ul className="common_list">
              {successFactors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/040524c6e75b29dac1c85f08ee96a2d6.jpg" alt="Best Infertility Hospital In India - Dr. G. Buvaneswari - Rela institute and Medical Centre" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Treatments</span></h2>
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {treatments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section">
        <div className="container">
          <h4>Dr. Rela Institute &amp; Medical Centre, an International medical facility is a quaternary care hospital dedicated to fostering and responding to the needs of a diverse set of patients.</h4>
          <p>The hospital is committed to being an internationally significant health care provider with state-of-the-art infrastructure, functioning in a sprawling area of 36 acres - located in Chromepet, Chennai, India. Our hospital has a facility of 450 beds inclusive of 130 critical care beds, 14 operating rooms, contemporary reference laboratories and radiology services.</p>
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
