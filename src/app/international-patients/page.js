import React from 'react'
import InternationalPatientsClient from './InternationalPatientsClient'
import { getHomepageDepartmentCards } from '@/lib/departments';

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

      const [deptDataResult] = await Promise.all([
   
        getHomepageDepartmentCards().catch(() => []),
      ]);

        const deptData = deptDataResult.length > 0 ? deptDataResult : FALLBACK_DEPT_DATA;


  return <InternationalPatientsClient deptData={deptData}/>
}
