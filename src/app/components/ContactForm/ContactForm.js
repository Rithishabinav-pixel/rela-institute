"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";
import { validateMobileNumber } from "@/lib/phone-validation";

const PREFERRED_LOCATIONS = ["Chennai", "Kilpauk", "Nanganallur", "Red Hills"];
const LOOKING_FOR_OPTIONS = ["Appointment", "Second Opinion", "Health Package", "General Enquiry"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [lookingFor, setLookingFor] = useState("");
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, preferredLocation, lookingFor, message, pageUrl }),
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
      setPreferredLocation("");
      setLookingFor("");
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

        <div className={style.inputCont}>
          <select value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)}>
            <option value="">Preferred Location</option>
            {PREFERRED_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className={style.inputCont}>
          <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
            <option value="">I&apos;m Looking For</option>
            {LOOKING_FOR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
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
