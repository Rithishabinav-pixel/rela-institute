import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Obstetrics and Gynaecology - Rela Hospital",
  description: "Consult India's leading Obstetricians and Gynecologists in Chennai at Rela Hospital, with over 10 years of expertise treating infertility and high-risk pregnancies.",
  alternates: { canonical: `${SITE_URL}/obstetrics-and-gynaecology` },
}

const features = [
  { name: "Experienced Clinicians", image: "experienced.png" },
  { name: "Personalised Care", image: "personalized.png" },
  { name: "State of the ART Lab", image: "art-lab.png" },
  { name: "Patient Confidentiality", image: "patient-confidentiality.png" },
  { name: "Advanced Fertility Care", image: "fertility-care.png" },
]

const treatments = [
  "Gynaecology Services", "Pediatric Gynaecology", "Adolescent Gynaecology",
  "Reproductive Gynaecology & Infertility", "Menopausal & Preventive Care", "Obstetric Services",
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/obyn.png)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Consult India&apos;s leading <br className="desktop_break" /><span>Obstetrician And Gynecologists</span> in Chennai</h1>
            <p className="white_text">Successfully treating patients for over 15 years, with over 10 years of expertise in treating infertile couples and handling high-risk pregnancies.</p>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Obstetrics and Gynaecology" />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Department of Obstetrics and <span>Gynaecology</span></h2>
            <p>Gynecology focuses on primary gynecological and obstetrical health, infertility problems and malignancy of the female reproductive tract, while Obstetrics deals with pregnant women, the foetus, labour, delivery and the period following childbirth.</p>
            <p>Our department is equipped with best-in-class facilities and experienced gynecologists to offer complete care to a woman at every stage of her life, including treatment for uterine fibroids, PCOS and infertility procedures such as IVF, IUI, ICSI and Laser Assisted Hatching.</p>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/73a40c207af055737822349f885b2aef.jpg" alt="Obstetrics and Gynaecology care at Rela Hospital" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Salient <span>Features</span></h2>
          </div>
          <div className={style.featureCards} data-aos="fade-up">
            {features.map((item) => (
              <div className={style.featureCard} key={item.name}>
                <Image src={`https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/${item.image}`} alt={item.name} width={80} height={80} />
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="common_section">
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

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Testimonials</span></h2>
          </div>
          <div className={style.testimonialMediaGrid} data-aos="fade-up">
            <div className={style.testimonialMediaCard}>
              <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/73a40c207af055737822349f885b2aef.jpg" alt="Dr. G. Buvaneswari, Infertility Specialist and Laparoscopic Surgeon - Oncofertility Clinic at RIMC" width={360} height={220} />
            </div>
            <div className={style.testimonialMediaCard}>
              <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/040524c6e75b29dac1c85f08ee96a2d6.jpg" alt="Best Infertility Hospital In India - Dr. G. Buvaneswari - Rela institute and Medical Centre" width={360} height={220} />
            </div>
          </div>
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
          <h2 className="common_heading">AVAIL YOUR CONSULTATION NOW</h2>
          <div className={style.ctaButtons}>
            <a href="#bookanappointment" className="common_btn white_btn">Book an Appointment <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
