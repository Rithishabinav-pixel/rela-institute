"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { validateMobileNumber } from "@/lib/phone-validation"
import formStyle from "@/app/components/UI/form.module.css"

const ENQUIRY_TYPES = ["Appointment", "Second Opinion", "Video Consultation"]

export default function LiverEnquiryForm() {
  const router = useRouter()
  const [enquiryType, setEnquiryType] = useState("Appointment")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredDateTime, setPreferredDateTime] = useState("")
  const [message, setMessage] = useState("")
  const [agreed, setAgreed] = useState(false)

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = "Name is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email address"

    const phoneResult = validateMobileNumber(phone)
    if (!phoneResult.valid) nextErrors.phone = phoneResult.error

    if (!agreed) nextErrors.agreed = "Please accept the Terms and Conditions and Privacy Policy"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setStatus(null)

    const fullMessage = `Enquiry Type: ${enquiryType}\nPreferred Date / Time: ${preferredDateTime || "-"}\n\n${message}`

    try {
      const pageUrl = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : ""
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, lookingFor: `Liver Disease Management - ${enquiryType}`, message: fullMessage, pageUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Could not submit your enquiry. Please try again." })
        return
      }

      router.push("/contact-us/thank-you")
      return
    } catch {
      setStatus({ type: "error", text: "Could not submit your enquiry. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${formStyle.formContainer} ${formStyle.white_form}`} id="bookanappointment">
      <form onSubmit={handleSubmit}>
        <h2>Enquiry Now</h2>

        {status && (
          <div className={status.type === "success" ? formStyle.formSuccessMessage : formStyle.formErrorMessage}>
            {status.text}
          </div>
        )}

        <div className={formStyle.inputCont} style={{ gap: "20px", flexWrap: "wrap" }}>
          {ENQUIRY_TYPES.map((type) => (
            <label key={type} style={{ width: "auto" }}>
              <input
                type="radio"
                name="enquiryType"
                value={type}
                checked={enquiryType === type}
                onChange={() => setEnquiryType(type)}
              />
              {type}
            </label>
          ))}
        </div>

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {errors.name && <p className={formStyle.fieldError}>{errors.name}</p>}

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {errors.email && <p className={formStyle.fieldError}>{errors.email}</p>}

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <PhoneInput international defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Phone Number" />
        </div>
        {errors.phone && <p className={formStyle.fieldError}>{errors.phone}</p>}

        <div className={formStyle.inputCont}>
          <input type="datetime-local" placeholder="Date / Time" value={preferredDateTime} onChange={(e) => setPreferredDateTime(e.target.value)} />
        </div>

        <div className={formStyle.inputCont}>
          <textarea placeholder="Please ask your query here" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <div className={formStyle.inputCont}>
          <label>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I have read and agree to the&nbsp;
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            &nbsp;and&nbsp;
            <Link href="/privacy-policy">Privacy Policy</Link>
          </label>
        </div>
        {errors.agreed && <p className={formStyle.fieldError}>{errors.agreed}</p>}

        <button className="common_btn orange_btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" />
        </button>
      </form>
    </div>
  )
}
