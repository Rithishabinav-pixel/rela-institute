import Image from "next/image"
import LandingPageForm from "../components/LandingPageForm"
import { SITE_URL } from "@/lib/sitemap/config"
import style from "../landing.module.css"

export const metadata = {
  title: "Orthosurgery - Rela Hospital",
  description: "Consult India's leading Orthopedic Surgery Specialists in Chennai at Rela Hospital, offering diagnosis and treatment for fractures, joint, spine and sports injuries.",
  alternates: { canonical: `${SITE_URL}/orthosurgery` },
}

const highlights = [
  { name: "Comprehensive Diagnosis", icon: "clinical-excellence.svg", text: "A prominent diagnostic experience backed by advanced imaging and experienced orthopedic doctors." },
  { name: "Specialized Treatment", icon: "advanced-infrastructure.svg", text: "Tailored treatment plans for sprains, fractures, dislocations, replacements and congenital diseases." },
  { name: "Minimally Invasive Surgery", icon: "research-innovation.svg", text: "Techniques that are less disruptive to a patient's body and lifestyle wherever surgery is recommended." },
  { name: "Personalized Care Plans", icon: "multidisciplinary-collaboration.svg", text: "Every patient's unique needs are carefully assessed to plan the right course of recovery." },
]

const conditions = [
  "Bone deformities", "Bone infections", "Bone tumors", "Fractures", "Spinal deformities",
  "Arthritis", "Dislocation", "Joint pain", "Joint swelling or inflammation", "Ligament tears",
  "Foot and ankle deformities", "Hammer toe", "Heel pain", "Heel spurs", "Sprains",
  "Tendon or ligament injury", "Ganglion cyst", "Tendinitis", "Frozen shoulder (adhesive capsulitis)",
  "Rotator cuff tear", "Cartilage and meniscus injuries", "Dislocation of the kneecap",
  "Dislocation or separation", "Ligament sprains or tears", "Tennis or golfers elbow",
  "Elbow stiffness or contractures", "Herniated (slipped) disk", "Spinal stenosis",
  "Spinal tumor", "Spinal cord injuries",
]

const awards = [
  { icon: "award-icon.svg", title: "Best Arthroscopy & Sports Medicine Doctor", year: "WASME Global" },
  { icon: "certificate.svg", title: "Best Emerging Hospitals Award", year: "2025" },
]

export default function Page() {
  return (
    <>
      <section className={style.bannerSection} style={{ backgroundImage: "url(https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-facilty.jpg)" }}>
        <div className="container">
          <div className={`top_heading left ${style.heroContent}`} data-aos="fade-up">
            <h1 className="common_heading white_text">Consult India&apos;s leading <br className="desktop_break" /><span>Orthopedic Surgery</span> Specialists in Chennai</h1>
            <p className="white_text">Whether you have a traumatic injury or are suffering from nagging pain, our orthopedic doctors provide a prominent diagnostic experience and the best possible therapeutic care.</p>
          </div>
          <div className={style.heroFormWrap} data-aos="fade-left">
            <LandingPageForm heading="Book an Appointment" lookingFor="Orthopedic Surgery" />
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.imageHalf}`} data-aos="fade-right">
            <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/93919ae7b5004662df1aa9c34ebe2430.jpg" alt="Orthopedic care at Rela Hospital" width={600} height={420} />
          </div>
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-left">
            <h2 className="common_heading">Department of <span>Orthopedics</span></h2>
            <p>Our Orthopedic surgeons are specialized in the diagnosis and treatment of surgical disorders of bones, joints, tendons, muscles, nerves, and ligaments, including sprains, fractures, dislocations, resurfacing, replacements, prolapsed discs, arthritis, bone infections, rickets, tumors, and congenital diseases.</p>
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Why Choose Rela for <span>Orthopedics</span></h2>
          </div>
          <div className={style.featureCards} data-aos="fade-up">
            {highlights.map((item) => (
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
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Conditions We <span>Treat</span></h2>
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
            <h2 className="common_heading">Tales of <span>Trust</span></h2>
          </div>
          <div className={style.testimonialMediaGrid} data-aos="fade-up">
            <div className={style.testimonialMediaCard}>
              <Image src="https://www.relainstitute.com/wp-content/cache/flying-press/d89eca7e06706669f2ecef7e9f4a331d.jpg" alt="Dr Rufus Vasanth Raj - Awarded as the Best Arthroscopy and Sports Medicine Doctor by WASME Global" width={360} height={220} />
            </div>
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Why <span>Rela?</span></h2>
          </div>
          <div className={style.awardCards} data-aos="fade-up">
            {awards.map((item) => (
              <div className={style.awardCard} key={item.title}>
                <Image src={`/assets/images/${item.icon}`} alt="" width={90} height={90} />
                <h3>{item.title}</h3>
                <p>{item.year}</p>
              </div>
            ))}
          </div>
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
