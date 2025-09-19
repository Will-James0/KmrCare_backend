/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

export const CarousselAuto = ({
  property1,
  className,
  orangeEgyptClassName,
  logoIutClassName,
  camtelLogoClassName,
  orangeEgyptClassNameOverride,
  OIPClassName,
}) => {
  return (
    <div
      className={`h-[438px] ${property1 === "frame-55" ? "w-px" : "w-[2600px]"} ${className}`}
    >
      <div
        className={`items-center gap-6 relative ${property1 === "frame-55" ? "w-[2594px]" : ""} ${property1 === "frame-55" ? "flex" : "inline-flex"} ${property1 === "frame-55" ? "left-[-2612px]" : "left-[-364px]"}`}
      >
        <img
          className={`object-cover h-[350px] relative ${property1 === "frame-55" ? "w-[350px]" : "w-1.5"} ${orangeEgyptClassName}`}
          alt="Orange egypt"
          src={
            property1 === "frame-55"
              ? "https://c.animaapp.com/mbfwxdap4GBqLX/img/oip--7--6.png"
              : "https://c.animaapp.com/mbfwxdap4GBqLX/img/orange-egypt-34728-1533803872-og-5.png"
          }
        />

        <img
          className="w-[350px] object-cover h-[350px] relative"
          alt="Oip"
          src={
            property1 === "frame-55"
              ? "https://c.animaapp.com/mbfwxdap4GBqLX/img/orange-egypt-34728-1533803872-og-5.png"
              : "https://c.animaapp.com/mbfwxdap4GBqLX/img/oip--7--6.png"
          }
        />

        <img
          className="w-[350px] object-cover h-[350px] relative"
          alt="Mtn icon"
          src={
            property1 === "frame-55"
              ? "https://c.animaapp.com/mbfwxdap4GBqLX/img/oip--7--6.png"
              : "https://c.animaapp.com/mbfwxdap4GBqLX/img/mtn-icon-512x512-jvl0inah-1.png"
          }
        />

        <img
          className="w-[350px] object-cover h-[350px] relative"
          alt="Uba logo"
          src="https://c.animaapp.com/mbfwxdap4GBqLX/img/uba-logo-2.png"
        />

        <img
          className={`w-[350px] object-cover h-[350px] relative ${logoIutClassName}`}
          alt="Logo iut"
          src="https://c.animaapp.com/mbfwxdap4GBqLX/img/logo-iut-2.png"
        />

        <img
          className={`w-[350px] object-cover h-[350px] relative ${camtelLogoClassName}`}
          alt="Camtel logo"
          src="https://c.animaapp.com/mbfwxdap4GBqLX/img/camtel-logo-2-2.png"
        />

        <img
          className={`w-[350px] object-cover h-[350px] relative ${orangeEgyptClassNameOverride}`}
          alt="Orange egypt"
          src="https://c.animaapp.com/mbfwxdap4GBqLX/img/orange-egypt-34728-1533803872-og-5.png"
        />

        <img
          className={`object-cover h-[350px] relative ${property1 === "frame-55" ? "w-[15px]" : "w-[350px]"} ${property1 === "frame-55" ? "mr-[-39.00px]" : ""} ${OIPClassName}`}
          alt="Oip"
          src="https://c.animaapp.com/mbfwxdap4GBqLX/img/oip--7--6.png"
        />
      </div>
    </div>
  );
};
