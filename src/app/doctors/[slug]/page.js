import React from "react";
import style from "./detail.module.css";
import DoctorCard from "@/app/components/UI/DoctorCard";
import Button from "@/app/components/UI/Button";
import DoctorTabs from "./DoctorTabs";
import { getDoctorBySlugPublic } from "@/lib/doctors";

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const doctor = await getDoctorBySlugPublic(slug);
    if (!doctor) return {};
    return { title: doctor.name };
  } catch {
    return {};
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  let doctor = null;
  let error = "";

  try {
    doctor = await getDoctorBySlugPublic(slug);
  } catch {
    error = "Could not load doctor. Please try again.";
  }

  if (error) {
    return (
      <section className={style.doctorProfile}>
        <div className={`container ${style.container}`}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section className={style.doctorProfile}>
        <div className={`container ${style.container}`}>
          <p>Doctor not found</p>
        </div>
      </section>
    );
  }

  const sliderTab = doctor.tabs.map((tab) => ({
    button: tab.heading,
    content: tab.content,
  }));

  const cardDoctor = {
    image: doctor.image,
    name: doctor.name,
    speciality: doctor.speciality?.name ?? "",
    position: doctor.position,
    link: "#",
  };

  return (
    <>
      <section className={style.doctorProfile}>
        <div className={`container ${style.container}`}>
          <div className={style.content}>

            <div className={style.doctorMainDetails}>
              {/* notranslate: see src/app/components/UI/DoctorCard.js */}
              <h1 className={`common_heading ${style.doctorName} notranslate`}>
                {doctor.name}
              </h1>

              {/* notranslate: degree abbreviations (MBBS, MD, etc.) shouldn't be machine-translated */}
              <p className={`${style.doctorEducation} notranslate`}>
                {doctor.education}
              </p>

              <p className={`orange_text ${style.doctorPosition}`}>
                {doctor.mainPosition}
              </p>

              <div className={style.doctorSpecialities}>
                {doctor.departments.map((department) => (
                  <span key={department.id}>{department.name}</span>
                ))}
              </div>
            </div>

            <hr />

            <div className={style.buttons}>
              <Button
                link="#"
                classname="orange_btn"
                text="Book an Appointment"
              />

              <Button
                link="#"
                classname="white_btn stroked"
                text="Request a Second Opinion"
              />
            </div>

            <DoctorTabs sliderTab={sliderTab} />
          </div>

          <div className={style.image}>
            <DoctorCard
              doctor={cardDoctor}
              cardStyle="doctorDetailCard"
            />
          </div>
        </div>
      </section>
    </>
  );
}
