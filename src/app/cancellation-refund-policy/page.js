import React from 'react'
import ContentPageBanner from '../components/UI/ContentPageBanner'
import "@/app/components/UI/ContentPageBanner.css"
import Link from 'next/link'

export default function page() {
  return (
    <>

    <ContentPageBanner title="Cancellation & Refund Policy"/>
    
    <section className="common_section">
        <div className='container'>
   

<div className="content">
  <p>
    We are in the service sector and, as such, we do not entertain requests
    for cancellation of services already rendered to patients. Our cancellation
    and refund policies are as follows:
  </p>

  <h4>CANCELLATION POLICY</h4>

  <p>
    A person who has remitted the required amount and placed an order for a
    procedure for their beneficiary at the hospital may request cancellation
    of the said procedure, provided that the cancellation request is received
    and acknowledged by the hospital. Such a request must be received at least
    one day prior to the scheduled date of the procedure, investigation, or
    consultation.
  </p>

  <h4>REFUND POLICY</h4>

  <p>
    Once the cancellation request is acknowledged by the hospital, the amount
    remitted shall be refunded after deducting 5% of the amount, within two
    days of acknowledgment of the request. In the case of payments made
    through a payment gateway, the refund will be credited to the same account
    used for the original payment.
  </p>
</div>


</div>
    </section>

    
    </>
  )
}
