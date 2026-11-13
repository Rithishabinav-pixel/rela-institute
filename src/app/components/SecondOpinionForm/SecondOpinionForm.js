
"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";

export default function SecondOpinionForm({bgStyle}) {
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});

    const [resume, setResume] = useState(null);

     const handleResumeChange = (event) => {
    setResume(event.target.files?.[0] ?? null);
  };

  return (
    <div className={`${style.formContainer} ${style[bgStyle]}`} >
      <form>
        <h2>Make an Enquire</h2>

        <div className={style.inputCont}>
          <input type="text" name="name" placeholder="Full Name" />
        </div>

        <div className={style.inputCont}>
          <input type="number" name="age" placeholder="Age" />
        </div>

        <div className={`${style.inputCont} ${style.phoneCont}`}>
          <PhoneInput
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            placeholder="Mobile No."
          />
        </div>

        <div className={style.inputCont}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
          />
        </div>

        <div className={`${style.inputCont} ${style.selectCont}`}>
          <select name="location" defaultValue="">
            <option value="" disabled>Preferred Location</option>
            <option value="Chennai">Chennai</option>
            <option value="Other">Other</option>
          </select>
        </div>

       
          <div className={`${style.inputCont} ${style.selectCont} ${style.half_cont}`}>
            <select name="condition" defaultValue="">
              <option value="" disabled>Condition or Diagnosis</option>
              <option value="Diagnosed">Diagnosed</option>
              <option value="Not Diagnosed">Not Diagnosed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={`${style.inputCont} ${style.selectCont} ${style.half_cont}`}>
            <select name="treatment" defaultValue="">
              <option value="" disabled>Current treatment</option>
              <option value="Medication">Medication</option>
              <option value="Surgery">Surgery</option>
              <option value="Other">Other</option>
            </select>
          </div>
     

      
          <div className={`${style.inputCont} ${style.selectCont} ${style.half_cont}`}>
            <select name="speciality" defaultValue="">
              <option value="" disabled>Preferred speciality</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Other">Other</option>
            </select>
          </div>

         <div className={`${style.inputCont} ${style.half_cont}`}>
          <label htmlFor="resume"> <Image src="/assets/images/upload.svg" width={24} height={24} alt="" /> {resume ? resume.name : "Upload Resume"}</label>
          <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" hidden onChange={handleResumeChange} />
        </div>
        
        <p className={`${style.note} note`}>(Allowed type: .pdf, .doc, .docx)</p>
        {errors.resume && <p className={style.fieldError}>{errors.resume}</p>}

        <div className={`${style.inputCont} ${style.textareaCont}`}>
          <textarea
            name="additionalInformation"
            placeholder="Additional information"
          />
        </div>

        <button className="common_btn orange_btn" type="submit">
          Submit
          <Image
            src="/assets/images/btn-arrow.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
      </form>
    </div>
  );
}
