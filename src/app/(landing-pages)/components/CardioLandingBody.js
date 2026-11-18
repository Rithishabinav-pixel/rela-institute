import Image from "next/image"
import style from "../landing.module.css"

const infrastructureList = [
  { name: "Electrocardiography (ECG)", icon: "ecg.svg" },
  { name: "Treadmill Test", icon: "tmt.svg" },
  { name: "3D Echocardiography", icon: "echo.svg" },
  { name: "Holter Monitoring", icon: "cathlab.svg" },
  { name: "Myocardial Perfusion Scintigraphy", icon: "xray.svg" },
  { name: "PET-Scan", icon: "ct.svg" },
]

const procedures = [
  "Primary Angioplasty", "Elective Coronary Angiography and Angioplasty",
  "Complex Coronary Angioplasty with Advanced Imaging Technology (IVUS & OCT)",
  "Chronic Total Occlusion PCI", "FFR Guided PCI", "Diagnostic Cardiac Catheterization",
  "Percutaneous Valvuloplasty", "Implantation of Pacemakers",
  "Transcutaneous Aortic Valve Implantation (TAVR)", "Implantation of Automatic Cardiac Defibrillators",
  "Implantation of IVC Filters", "ASD/VSD/PDA/Collateral Device Closures",
  "Coil Closure Of PDA/Mapcas", "Balloon Pulmonary/ Aortic Valvuloplasty",
  "LPA/PDA/Coarctation of Aorta: Balloon Dilation and Stenting",
]

const careHighlights = [
  "Non-invasive and interventional procedures", "Multi-disciplinary counselling",
  "Comprehensive emergency services", "Advanced paediatric cardiology",
  "Heart transplantation and ECMO services",
]

export default function CardioLandingBody({ procedureHeading, consultLinkText }) {
  return (
    <>
      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Rela Hospital&apos;s <span>Team</span></h2>
            <p>The Department of Cardiology at Dr. Rela Institute &amp; Medical Care functions as a Centre of Excellence in Cardiac Sciences, backed by internationally acclaimed cardiologists and super trained support staff offering best practices in non-invasive and interventional procedures, along with round-the-clock emergency services.</p>
            <ul className="common_list">
              {careHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/heart-transplant.jpg" alt="Cardiology team at Rela Hospital" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Covid-19 &amp; <span>Heart Health</span></h2>
            <p>According to a study published in the Oxford journal, nearly half of the patients hospitalized with severe COVID-19 have heart damage months after leaving the hospital. At Rela, we provide comprehensive heart-related healthcare, from checking your heart to providing appropriate treatment to ensuring your overall health.</p>
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Infrastructure &amp; <span>Technology</span></h2>
            <p>Our diagnostic investigation is aided by advanced infrastructure and state of the art equipment.</p>
          </div>
          <div className={style.linkCards} data-aos="fade-up">
            {infrastructureList.map((item) => (
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

      <section className={`common_section gray_bg ${style.chip_section}`}>
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">{procedureHeading}</h2>
            <p>Cardiac Catheterization is a diagnostic procedure to treat various cardiovascular conditions, locate narrowed or blocked arteries, measure oxygen and pressure, check ventricular function and diagnose congenital heart ailments.</p>
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {procedures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a href="#bookanappointment" className="common_btn orange_btn" style={{ marginTop: "32px" }}>{consultLinkText} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" /></a>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">What patients&apos; <span>say</span></h2>
          </div>
          <div className={style.testimonialGrid} data-aos="fade-up">
            <div className={style.testimonialCard}>
              <p>I was admitted to Rela Institute after a massive heart attack. My experience with Dr. Ashok and the process that followed was one of the safest I have ever had. I felt confident throughout the angioplasty and stent insertion procedure.</p>
              <div className={style.author}>Mulayath Shanthi</div>
            </div>
            <div className={style.testimonialCard}>
              <p>Am Mrs. Usha Moorthy, 60 years old. It was an emergency when we met him for the first time. After PCI, he took time to explain what he had done for me and gave me enough confidence to go with.</p>
              <div className={style.author}>Usha Moorthy</div>
            </div>
          </div>
        </div>
      </section>

      <section className={`common_section gray_bg ${style.award_section}`}>
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading"><span>Awards</span></h2>
          </div>
          <div className={style.awardCards} data-aos="fade-up">
            <div className={style.awardCard}>
              <Image src="/assets/images/award-icon.svg" alt="" width={90} height={90} />
              <h3>Lifetime Achievement Award</h3>
              <p>Prof. Dr. Mohamed Rela</p>
            </div>
            <div className={style.awardCard}>
              <Image src="/assets/images/certificate.svg" alt="" width={90} height={90} />
              <h3>Best Emerging Hospitals Award</h3>
              <p>2025</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`common_section ${style.ctaSection}`}>
        <div className="container">
          <h2 className="common_heading">GET YOUR HEART A NEW LIFE</h2>
          <div className={style.ctaButtons}>
            <a href="#bookanappointment" className="common_btn white_btn">Book an Appointment <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
