"use client"

import AnimatedCounter from "@/app/components/UI/AnimatedCounter"
import useSectionInView from "@/app/components/UI/useSectionInView"
import style from "../landing.module.css"

export default function StatCounterRow({ stats, light = false }) {
  const [ref, inView] = useSectionInView()

  return (
    <div className={style.statRow} ref={ref}>
      {stats.map((stat) => (
        <div className={style.statItem} key={stat.label}>
          <h3 className={light ? "white_text" : "orange_text"}>
            <AnimatedCounter target={stat.value} start={inView} />
            <span>{stat.suffix || "+"}</span>
          </h3>
          <p className={light ? "white_text" : ""}>{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
