"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";
import { validateMobileNumber } from "@/lib/phone-validation";
import CountryStateFields from "../UI/CountryStateFields";

const ENQUIRY_TYPES = ["Specialities", "Symptoms", "International Patients", "Appointments", "Health Packages", "Others"];

export default function DoctorForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address";

    const phoneResult = validateMobileNumber(phone);
    if (!phoneResult.valid) nextErrors.phone = phoneResult.error;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const pageUrl = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "";
      const res = await fetch("/api/doctor-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, country: countryIso, state: stateIso, enquiryType, message, pageUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Could not submit your enquiry. Please try again." });
        return;
      }

      setStatus({ type: "success", text: "Thank you! Your enquiry has been submitted successfully." });
      setName("");
      setEmail("");
      setPhone("");
      setCountryIso("");
      setStateIso("");
      setEnquiryType("");
      setMessage("");
    } catch {
      setStatus({ type: "error", text: "Could not submit your enquiry. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={style.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Make an Enquire</h2>

        {status && (
          <div className={status.type === "success" ? style.formSuccessMessage : style.formErrorMessage}>
            {status.text}
          </div>
        )}

        <div className={style.inputCont}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {errors.name && <p className={style.fieldError}>{errors.name}</p>}

        <div className={style.inputCont}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p className={style.fieldError}>{errors.email}</p>}

        <div className={style.inputCont}>
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
          />
        </div>
        {errors.phone && <p className={style.fieldError}>{errors.phone}</p>}

        <CountryStateFields
          formStyle={style}
          countryIso={countryIso}
          stateIso={stateIso}
          onCountryChange={setCountryIso}
          onStateChange={setStateIso}
        />

        <div className={style.inputCont}>
          <select value={enquiryType} onChange={(e) => setEnquiryType(e.target.value)}>
            <option value="">I have an enquiry</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={style.inputCont}>
          <textarea placeholder="Your Query" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <button className="common_btn orange_btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt='' />
        </button>
      </form>
    </div>
  );
}
