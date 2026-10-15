import { preload } from "react-dom";
import { getCenterOfExcellenceCards, getHomepageDepartmentCards } from "@/lib/departments";
import { getHomepageDoctorCards } from "@/lib/doctors";
import HomeClient from "./HomeClient";

export const revalidate = 3600;


const FALLBACK_COE_DATA = [
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Liver & Digestive Health",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Women's Health",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Heart Health",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Children's Health",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Cancer Care",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Brain & Spine",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Bone & Joint Care",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Kidney Care",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Bone & Joint Care",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Bone & Joint Care",
    link:"/"
  },
   {
    icon:"/assets/images/sample-ceo-icon.svg",
    title:"Liver & Digestive Health",
    link:"/"
  },
];

const FALLBACK_DEPT_DATA = [
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
  {
    icon:"/assets/images/sample-ceo-icon.svg",
    name:"Liver & Digestive Health",
    specialities:["Liver Transplantation","Biliary Reconstruction","Hepatocellular Carcinoma"],
    departmentLink:"/",
    doctorLink:"/"
  },
];

const FALLBACK_DOCTORS_DATA = [
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/"
  },
];

export default async function Home() {
  // Hero banner is the LCP element (CSS background-image, not <Image>), so it
  // can't take the next/image `preload` prop — this gives the browser the
  // same early fetch hint without changing any markup/visual output. The
  // desktop variant is what SSR/initial paint shows before the client-side
  // `mobile` check (see HomeClient.js) can swap in the mobile image.
  preload("/assets/images/hero-banner.png", { as: "image" });

  const [coeDataResult, deptDataResult, doctorsDataResult] = await Promise.all([
    getCenterOfExcellenceCards().catch(() => []),
    getHomepageDepartmentCards().catch(() => []),
    getHomepageDoctorCards().catch(() => []),
  ]);

  const coeData = coeDataResult.length > 0 ? coeDataResult : FALLBACK_COE_DATA;
  const deptData = deptDataResult.length > 0 ? deptDataResult : FALLBACK_DEPT_DATA;
  const doctorsData = doctorsDataResult.length > 0 ? doctorsDataResult : FALLBACK_DOCTORS_DATA;

  return <HomeClient coeData={coeData} deptData={deptData} doctorsData={doctorsData} />;
}
