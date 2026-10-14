"use client";

import React, { useRef, useState } from "react";
import style from "./detail.module.css";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function DoctorTabs({ sliderTab }) {
  const swiperRef = useRef(null);
  const isManualChangeRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  if (sliderTab.length === 0) return null;

  const goToTab = (index) => {
    isManualChangeRef.current = true;
    setActiveIndex(index);
    swiperRef.current?.slideToLoop(index);
  };

  return (
    <div className={style.tabContainer}>

      <div className={style.sliderWrapper}>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView="auto"
          navigation={{
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          loop={sliderTab.length > 1}
          className={style.tabSlider}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            if (isManualChangeRef.current) return;
            setActiveIndex(swiper.realIndex);
          }}
          onTransitionEnd={() => {
            isManualChangeRef.current = false;
          }}
        >
          {sliderTab.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className={`${style.slide} ${activeIndex === i ? style.active : ""}`}
                onClick={() => goToTab(i)}
              >
                {/* tab heading  */}
                {slide.button}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="slide_prev nav">
          <Image
            src="/assets/images/slider-prev.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

        <button className="slide_next nav">
          <Image
            src="/assets/images/slider-next.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

      </div>

      <div className={style.tabContent}>
        <div className={style.tabDetail}>
{/* tab heading */}
          <h2>
            {sliderTab[activeIndex]?.button}
          </h2>
{/* tab content [rich text content, sanitized server-side] */}
          <div
            dangerouslySetInnerHTML={{
              __html: sliderTab[activeIndex]?.content ?? "",
            }}
          />

        </div>
      </div>

    </div>
  );
}
