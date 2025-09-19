/* eslint-disable no-unused-vars */
import React from "react";
import { LinkButton } from "../../components/Accueil/LinkButton";

export const Grouper = () => {
  return (
    <div className="absolute w-[662px] h-[201px] top-[957px] left-[360px]">
      <div className="absolute w-[664px] h-[66px] top-0 left-0">
        <p className="absolute top-[29px] left-0 font-display-2 font-[number:var(--display-2-font-weight)] text-[#0f425d] text-[length:var(--display-2-font-size)] text-center tracking-[var(--display-2-letter-spacing)] leading-[var(--display-2-line-height)] whitespace-nowrap [font-style:var(--display-2-font-style)]">
          Un Endroit Idéal pour Recevoir des Soins
        </p>

        <div className="absolute top-0 left-[174px] font-caption font-[number:var(--caption-font-weight)] text-[#0b9444] text-[length:var(--caption-font-size)] text-center tracking-[var(--caption-letter-spacing)] leading-[var(--caption-line-height)] whitespace-nowrap [font-style:var(--caption-font-style)]">
          BIENVENUE SUR KMRCARE
        </div>
      </div>

      <p className="absolute w-[658px] top-[81px] left-px font-body font-[number:var(--body-font-weight)] text-black text-[length:var(--body-font-size)] text-center tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] [font-style:var(--body-font-style)]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
        placerat scelerisque tortor ornare ornare. Convallis felis vitae tortor
        augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim
        et.
      </p>

      <LinkButton
        className="!absolute !left-[248px] !top-[179px]"
        linkButtonClassName="!text-[#0b9444]"
        text="En Savoir Plus"
      />
    </div>
  );
};
