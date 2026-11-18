"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { validateMobileNumber } from "@/lib/phone-validation"
import formStyle from "@/app/components/UI/form.module.css"

export default function WellnessCardForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [apartmentName, setApartmentName] = useState("")
  const [address, setAddress] = useState("")

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

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setStatus(null)

    const message = `Wellness Card Registration\nDOB: ${dob || "-"}\nGender: ${gender || "-"}\nApartment Name: ${apartmentName || "-"}\nAddress: ${address || "-"}`

    try {
      const pageUrl = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : ""
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, lookingFor: "Wellness Card - Neighborhood Community", message, pageUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus({ type: "error", text: data.error || "Could not submit your details. Please try again." })
        return
      }

      router.push("/contact-us/thank-you")
      return
    } catch {
      setStatus({ type: "error", text: "Could not submit your details. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${formStyle.formContainer} ${formStyle.white_form}`}>
      <form onSubmit={handleSubmit}>
        <h2>Get Your Wellness Card</h2>

        {status && (
          <div className={status.type === "success" ? formStyle.formSuccessMessage : formStyle.formErrorMessage}>
            {status.text}
          </div>
        )}

        <div className={formStyle.inputCont}>
          <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {errors.name && <p className={formStyle.fieldError}>{errors.name}</p>}

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <input type="date" placeholder="DOB" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer Not to Answer">Prefer Not to Answer</option>
          </select>
        </div>

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <PhoneInput international defaultCountry="IN" value={phone} onChange={setPhone} placeholder="Mobile No." />
        </div>
        {errors.phone && <p className={formStyle.fieldError}>{errors.phone}</p>}

        <div className={`${formStyle.inputCont} ${formStyle.half_cont}`}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {errors.email && <p className={formStyle.fieldError}>{errors.email}</p>}

        <div className={formStyle.inputCont}>
          <input type="text" placeholder="Apartment Name" value={apartmentName} onChange={(e) => setApartmentName(e.target.value)} />
        </div>

        <div className={formStyle.inputCont}>
          <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <button className="common_btn orange_btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" />
        </button>
      </form>
    </div>
  )
}
