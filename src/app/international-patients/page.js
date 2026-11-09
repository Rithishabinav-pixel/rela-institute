import React from 'react'
import InternationalPatientsClient from './InternationalPatientsClient'
import { getHomepageDepartmentCards } from '@/lib/departments';
import { listInternationalTestimonialsPublic, listFeaturedInternationalTestimonialsPublic } from '@/lib/testimonials';

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

export default async function page() {

      const [deptDataResult, allTestimonialsResult, featuredTestimonialsResult] = await Promise.all([

        getHomepageDepartmentCards().catch(() => []),
        listInternationalTestimonialsPublic({ cursor: 0, limit: 20 }).catch(() => ({ items: [] })),
        listFeaturedInternationalTestimonialsPublic({ cursor: 0, limit: 5 }).catch(() => ({ items: [] })),
      ]);

        const deptData = deptDataResult.length > 0 ? deptDataResult : FALLBACK_DEPT_DATA;
        const allTestimonials = allTestimonialsResult.items;
        const featuredTestimonials = featuredTestimonialsResult.items;


  return <InternationalPatientsClient deptData={deptData} allTestimonials={allTestimonials} featuredTestimonials={featuredTestimonials}/>
}
