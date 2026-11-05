"use client";

import React, { useState } from "react";
import style from "../UI/form.module.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Image from "next/image";
import { validateMobileNumber } from "@/lib/phone-validation";

export default function CareerForm({ job }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleResumeChange = (event) => {
    setResume(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address";

    const phoneResult = validateMobileNumber(phone);
    if (!phoneResult.valid) nextErrors.phone = phoneResult.error;

    if (!resume) nextErrors.resume = "Please attach your resume";
    else if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(resume.type)) {
      nextErrors.resume = "Allowed type: .pdf, .doc, .docx";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const pageUrl = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "";
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);
      formData.append("pageUrl", pageUrl);
      formData.append("resume", resume);
      if (job?.id) formData.append("jobId", String(job.id));

      const res = await fetch("/api/career-apply", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Could not submit your application. Please try again." });
        return;
      }

      setStatus({ type: "success", text: "Thank you! Your application has been submitted successfully." });
      setName("");
      setEmail("");
      setPhone("");
      setResume(null);
      setMessage("");
    } catch {
      setStatus({ type: "error", text: "Could not submit your application. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={style.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Apply Now</h2>

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
          <label htmlFor="resume"> <Image src="/assets/images/upload.svg" width={24} height={24} alt="" /> {resume ? resume.name : "Upload Resume"}</label>
          <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" hidden onChange={handleResumeChange} />
        </div>
        <p className={style.note}>(Allowed type: .pdf, .doc, .docx)</p>
        {errors.resume && <p className={style.fieldError}>{errors.resume}</p>}

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
