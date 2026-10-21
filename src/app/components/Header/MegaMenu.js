
import Image from 'next/image'
import style from './header.module.css'
import Link from 'next/link'
import Button from '../UI/Button'

export default function WomenChildrenMegaMenu({activeMenu,setActiveMenu,megaMenuTab,womenMenu,setMegaMenuTab,childrenMenu  }) {
return (
    <>
    {activeMenu === "women-children" && (
  <div
    className={`${style.megaMenu_wrapper} ${style.show}`}
    onMouseEnter={() => setActiveMenu("women-children")}
    onMouseLeave={() => setActiveMenu("")}
  >
   
<div className={style.megaMenu}>
  <div className={`container ${style.container}`}>
    {/* Menu tabs */}
    <div className={style.menuTab}>
      <Image
        className={style.menuVector}
        src="/assets/images/rela_vector.svg"
        width={447}
        height={522}
        alt=""
      />

      <ul>
        <li>
          <button
            onClick={() => setMegaMenuTab("women")}
            className={megaMenuTab === "women" ? style.active : ""}
          >
            Women
          </button>
        </li>

        <li>
          <button
            onClick={() => setMegaMenuTab("children")}
            className={megaMenuTab === "children" ? style.active : ""}
          >
            Children
          </button>
        </li>
      </ul>
    </div>

    {/* Dynamic menu content */}
    {(megaMenuTab === "women" || megaMenuTab === "children") && (
      <div
        className={`${style.menuTabContent} ${style.womenChildrenTabContent}`}
      >
        {Object.entries(
          megaMenuTab === "women" ? womenMenu : childrenMenu
        ).map(([category, items]) => (
          <div className={style.menuColumn} key={category}>
            <span className={style.menuColumnHeading}>
              {category}
            </span>

            <ul>
              {items.map((item) => (
                <li key={item.label}>
                  <Link href={item.link}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  </div>
)}
    </>
)
}





export function SpecialitiesMegaMenu({activeMenu,setActiveMenu,megaMenuTab,setMegaMenuTab,coeMenu,departmentMenu,specialitiesFeatureMenu }){
return(
    <>
    {activeMenu === "specialities" && (
  <div
    className={`${style.megaMenu_wrapper} ${style.show}`}
    onMouseEnter={() => setActiveMenu("specialities")}
    onMouseLeave={() => setActiveMenu("")}
  >
    <div className={style.megaMenu}>
      <div className={`container ${style.container}`}>
        {/* Menu tabs */}
        <div className={style.menuTab}>
          <Image
            className={style.menuVector}
            src="/assets/images/rela_vector.svg"
            width={447}
            height={522}
            alt=""
          />

          <ul>
            <li>
              <button
                onClick={() =>
                  setMegaMenuTab("center-of-excellence")
                }
                className={
                  megaMenuTab === "center-of-excellence"
                    ? style.active
                    : ""
                }
              >
                Centres of Excellence
              </button>
            </li>

            <li>
              <button
                onClick={() => setMegaMenuTab("department")}
                className={
                  megaMenuTab === "department"
                    ? style.active
                    : ""
                }
              >
                Departments
              </button>
            </li>
          </ul>
        </div>

        {/* Dynamic menu content */}
        {(megaMenuTab === "center-of-excellence" ||
          megaMenuTab === "department") && (
          <div
            className={`${style.menuTabContent} ${style.coeTabContent}`}
          >
            {/* Menu column */}
            <div className={style.menuColumn}>
              <span className={style.menuColumnHeading}>
                {megaMenuTab === "center-of-excellence"
                  ? "Centres of Excellence"
                  : "Departments"}
              </span>

              <ul>
                {(megaMenuTab === "center-of-excellence"
                  ? coeMenu
                  : departmentMenu
                ).map((item) => (
                  <li key={item.label}>
                    <Link href={item.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature menu */}

            <div className={style.menuFeature}>
              <div className={style.content}>
                
                <p>{megaMenuTab === "center-of-excellence"?specialitiesFeatureMenu.ceo.label:specialitiesFeatureMenu.department.label}</p>

                <Button
                  classname="orange_btn"
                  link={megaMenuTab === "center-of-excellence"?specialitiesFeatureMenu.ceo.link:specialitiesFeatureMenu.department.link}
                  text="Know More"
                />
              </div>

              <div className={style.image}>
                <Image quality={100}
                  src={megaMenuTab === 'center-of-excellence'?specialitiesFeatureMenu.ceo.image:specialitiesFeatureMenu.department.image}
                  width={367}
                  height={287}
                  alt="Liver Disease and Transplantation"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </>
)
}