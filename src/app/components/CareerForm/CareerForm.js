"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";

export default function CareerForm() {
  const [phone, setPhone] = useState("");
 

  return (
    <div className={style.formContainer}>
      <form>
        <h2>Apply Now</h2>

        <div className={style.inputCont}>
          <input
            type="text"
            name="name"
            placeholder="Name"
          />
        </div>

        <div className={style.inputCont}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
          />
        </div>

        <div className={style.inputCont}>
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
          />
        </div>

       

         <div className={style.inputCont}>
        <label htmlFor="resume"> <Image src="/assets/images/upload.svg" width={24} height={24} alt=""/> Upload Resume</label>
        <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" hidden/>

        </div>
        <p className={style.note}>(Allowed type: .pdf, .doc, .docx)</p>


        <div className={style.inputCont}>
         <textarea placeholder="Your Query"/>
        </div>

        <button className="common_btn orange_btn" type="submit">Submit <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/> </button>

      </form>
    </div>
  );
}

