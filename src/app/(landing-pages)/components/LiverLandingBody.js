import Image from "next/image"
import style from "../landing.module.css"

const specializations = [
  "Liver Transplantation", "Paediatric Liver Disease & Transplantation", "Liver Cancer", "Liver Cirrhosis",
  "Liver Diseases", "Chronic Liver Disease", "Acute Liver Failure", "Combined Liver and Kidney Transplantation",
  "Liver tumours", "Bile duct tumours", "Diseases of the Pancreas", "Non-Alcoholic Fatty Liver Disease",
  "Alcoholic Liver Disease", "Ascites", "Hepatitis B", "Hepatitis C", "Hepatic Encephalopathy",
  "Wilson's Disease", "Management of Chronic Liver Disease", "Management of Acute Liver Failure",
  "Gallbladder Diseases", "Gallstone Disease", "Gallbladder Polyps", "Choledocholithiasis",
  "Liver Metastasis", "Cholangitis", "Primary Biliary Cholangitis", "Hepatomegaly", "Crigler Najjar Syndrome",
  "Galactosemia", "Budd Chiari Syndrome", "Liver Adenoma", "Primary HCC - Hepatocellular Carcinoma",
  "Hepatoblastoma", "Hepatorenal Syndrome", "Portal Hypertension", "Hemangioma", "Liver Resection",
  "Pancreas Transplant", "Kidney Transplant", "Combined Pancreas & Kidney Transplant",
  "Vascular Access – Fistula Formation For Dialysis",
]

export default function LiverLandingBody({ gastroIntro, successStories }) {
  return (
    <>
      <section className="common_section">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Prof. Mohamed <span>Rela</span></h2>
            <h4>MS, FRCS, DSc - Chairman &amp; Director, Dr. Rela Institute &amp; Medical Centre</h4>
            <p>Prof. Mohamed Rela is a pioneer in liver transplantation with over 28 years of experience. He has performed more than 4000 liver transplant surgeries and pioneered the technique of split liver transplantation, where one cadaver liver is split into two and transplanted into two individuals.</p>
          </div>
          <div className={`${style.imageHalf}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/rela-doctor-team-liver-department-banner.jpg" alt="Prof. Mohamed Rela and the liver transplant team" width={600} height={420} />
          </div>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container">
          <div className={`${style.contentHalf} top_heading left`} data-aos="fade-right">
            <h2 className="common_heading">Institute of Liver Disease &amp; <span>Transplantation</span></h2>
            <h4>The Largest Liver Hospital in Chennai, India</h4>
            <p>RILDT is a comprehensive, multidisciplinary disease-management centre offering specialized treatment of liver and pancreas related diseases. Our team has performed over 1400 liver transplants in Tamil Nadu since 2010, including a record-setting transplant on a 42-day-old baby — the youngest successful paediatric liver transplant in India.</p>
          </div>
          <div className={`${style.imageHalf} ${style.floatImageWrap}`} data-aos="fade-left">
            <Image src="https://www.relainstitute.com/wp-content/themes/relainstitute/img/landing-pages/450-bed.png" alt="RILDT infrastructure" width={600} height={420} />
            <div className={`${style.floatCard} ${style.topRight}`}>
              <Image src="/assets/images/liver-transplantation.svg" alt="" width={36} height={36} />
              <h3>1400+ Transplants Since 2010</h3>
            </div>
            <div className={`${style.floatCard} ${style.bottomLeft}`}>
              <Image src="/assets/images/advanced-infrastructure.svg" alt="" width={36} height={36} />
              <h3>Largest Liver ICU Worldwide</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Treatment <span>Specialization</span></h2>
            {gastroIntro && (
              <>
                <h4>Department of Gastroenterology</h4>
                <p>{gastroIntro}</p>
              </>
            )}
          </div>
          <ul className={style.chipList} data-aos="fade-up">
            {specializations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section gray_bg">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Success <span>Stories</span></h2>
          </div>
          <ul className="common_list" style={{ marginTop: "24px" }}>
            {successStories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="common_section">
        <div className="container section_container column">
          <div className="top_heading center" data-aos="fade-up">
            <h2 className="common_heading">Why <span>Rela?</span></h2>
          </div>
          <div className={style.awardCards} data-aos="fade-up">
            <div className={style.awardCard}>
              <Image src="/assets/images/advanced-infrastructure.svg" alt="" width={90} height={90} />
              <h3>450+ Beds</h3>
              <p>Inclusive of 130 critical care beds</p>
            </div>
            <div className={style.awardCard}>
              <Image src="/assets/images/clinical-excellence.svg" alt="" width={90} height={90} />
              <h3>14 Operating Rooms</h3>
              <p>Modern surgical theatres</p>
            </div>
            <div className={style.awardCard}>
              <Image src="/assets/images/certificate.svg" alt="" width={90} height={90} />
              <h3>Times Health Survey</h3>
              <p>Recognised hospital excellence</p>
            </div>
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
