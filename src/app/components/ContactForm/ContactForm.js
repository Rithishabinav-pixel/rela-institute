"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";

export default function ContactForm() {
  const [phone, setPhone] = useState("");
 

  return (
    <div className={style.formContainer}>
      <form>
        <h2>Make an Enquire</h2>

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
        <select>
  <option value="">Preferred Location</option>
<option   value="Location">Location</option>
<option   value="Location">Location</option>
<option   value="Location">Location</option>
</select>
        </div>

        <div className={style.inputCont}>
        <select>
  <option value="">I'm Looking For</option>
<option   value="I'm Looking For">I'm Looking For</option>
<option   value="I'm Looking For">I'm Looking For</option>
<option   value="I'm Looking For">I'm Looking For</option>
</select>
        </div>

    

        <div className={style.inputCont}>
         <textarea placeholder="Your Query"/>
        </div>

        <button className="common_btn orange_btn" type="submit">Submit <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/> </button>

      </form>
    </div>
  );
}

