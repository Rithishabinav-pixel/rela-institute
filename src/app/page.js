import { preload } from "react-dom";
import { getCenterOfExcellenceCards, getHomepageDepartmentCards } from "@/lib/departments";
import { getHomepageDoctorCards } from "@/lib/doctors";
import { listHeroBannersPublic } from "@/lib/hero-banners";
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
  const [coeDataResult, deptDataResult, doctorsDataResult, heroBanners] = await Promise.all([
    getCenterOfExcellenceCards().catch(() => []),
    getHomepageDepartmentCards().catch(() => []),
    getHomepageDoctorCards().catch(() => []),
    listHeroBannersPublic().catch((error) => {
      console.error('[hero-banners] failed to load:', error.message);
      return [];
    }),
  ]);

  const coeData = coeDataResult.length > 0 ? coeDataResult : FALLBACK_COE_DATA;
  const deptData = deptDataResult.length > 0 ? deptDataResult : FALLBACK_DEPT_DATA;
  const doctorsData = doctorsDataResult.length > 0 ? doctorsDataResult : FALLBACK_DOCTORS_DATA;

  if (heroBanners[0]?.image) {
    preload(heroBanners[0].image, { as: "image" });
  }

  return <HomeClient coeData={coeData} deptData={deptData} doctorsData={doctorsData} heroBanners={heroBanners} />;
}
