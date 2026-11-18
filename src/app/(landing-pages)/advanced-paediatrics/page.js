import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Advanced Paediatrics - Rela Hospital",
  description: "Consult India's best paediatricians in Chennai at Rela Hospital's Advanced Paediatrics centre, offering 24/7 emergency and intensive children's and new-born care.",
  alternates: { canonical: `${SITE_URL}/advanced-paediatrics` },
}

const diseaseTypes = [
  { name: "General paediatric ailments", image: "General-paediatric-ailments.png" },
  { name: "Paediatric heart ailments", image: "Paediatric-heart-ailments.png" },
  { name: "Growth disorders", image: "Growth-disorders.png" },
  { name: "Neuro-developmental disorders", image: "Neuro-developmental-disorders.png" },
  { name: "Limb deformities", image: "Limb-deformities.png" },
  { name: "Cancers", image: "Cancers.png" },
  { name: "Liver transplant", image: "Liver-transplant.png" },
  { name: "Trauma", image: "Trauma.png" },
]

const treatments = [
  { name: "Neonatal & Paediatric Outpatient", icon: "doctor.svg" },
  { name: "High-Risk New Born & Paediatric Followups", icon: "age-group.svg" },
  { name: "Development Assessment", icon: "research-innovation.svg" },
  { name: "Nutrition Advice", icon: "personalised-care.svg" },
  { name: "Vaccination Clinic", icon: "medical-assistance.svg" },
  { name: "General Paediatric ICU", icon: "advanced-infrastructure.svg" },
  { name: "Paediatric Emergency service", icon: "emergency.svg" },
  { name: "Paediatric Transport Service (Land & Air)", icon: "ambulance.svg" },
]

const otherTreatments = [
  "Counselling for Developmental Problems like ADHD, Autism, Behavioural Disorders, Anxiety Disorders",
  "Blistering conditions like pemphigus", "Special counselling for chronic Paediatric problems",
  "Lactational Counselling", "Paediatric Solid organ ICU", "Paediatric Haemato ONC /BMT ICU",
  "Paediatric sedation service (Procedural sedation)", "Paediatric Mechanical assist device Care (ECMO & VAD)",
  "Paediatric Vascular access service", "Paediatric Trauma Care", "Paediatric Surgical ICU",
]

const whyRela = [
  { title: "Successful liver transplantation for a one-month old baby", image: "Successful-liver-transplantation-for-a-one-month-old-baby.jpg" },
  { title: "World renowned doctors committed to children's care", image: "World-renowned-doctors-committed-to-childrens-care.jpg" },
  { title: "Sophisticated laboratories and radiology services", image: "Sophisticated-laboratories-and-radiology-services.jpg" },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/image-2.png)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Consult India&apos;s best <br className="desktop_break" /><span>paediatricians</span> in Chennai</h1>
            <p className="white_text">24/7 Emergency and Intensive children care and new-born care, with growth and development assessment, dietary advice and immunization services, by experienced paediatric doctors in a child-friendly ambience.</p>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Advanced Paediatrics" />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Advanced <span>Paediatrics</span></h2>
            <p>There are multiple specialities that we offer in the Institute of Advanced Paediatrics including cardiology, nephrology, orthopedics, hepatology, gastroenterology, endocrinology and haemato-oncology. Pediatric care is provided for common illnesses as well as for serious issues ranging from liver transplantation to kidney disease.</p>
            <p>With a centre for Advanced Paediatrics encompassing multiple sub-disciplines, sophisticated laboratories and the best pediatricians available, children&apos;s care is all assured.</p>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/Successful-liver-transplantation-for-a-one-month-old-baby.jpg" alt="Advanced Paediatrics care at Rela Hospital" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Types of <span>diseases</span> we treat</h2>
          </div>
          <div className={style.featureCards} data-aos="fade-up">
            {diseaseTypes.map((item) => (
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
            <h2 className="common_heading">Treatments and <span>Procedures</span></h2>
          </div>
          <div className={style.linkCards} data-aos="fade-up">
            {treatments.map((item) => (
              <div className={style.linkCard} key={item.name}>
                <div className={style.icon}>
                  <Image src={`/assets/images/${item.icon}`} alt="" width={40} height={40} />
                </div>
                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {otherTreatments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Why <span>Rela?</span></h2>
          </div>
          <div className={style.testimonialMediaGrid} data-aos="fade-up">
            {whyRela.map((item) => (
              <div className={style.testimonialMediaCard} key={item.title}>
                <Image src={`https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/${item.image}`} alt={item.title} width={360} height={240} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h4>Dr. Rela Institute &amp; Medical Centre</h4>
            <p>Dr. Rela Institute &amp; Medical Centre, an international medical facility, is a quaternary care hospital with cutting-edge technology and experienced, caring medical professionals. Our hospital has a facility of over 450 beds inclusive of 130 critical care beds, 14 operating rooms, contemporary reference laboratories and radiology services, spread over 36 acres in Chromepet, Chennai, India.</p>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/World-renowned-doctors-committed-to-childrens-care.jpg" alt="Dr. Rela Institute and Medical Centre" width={600} height={420} />
          </div>
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
