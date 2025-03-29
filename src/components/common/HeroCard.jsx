import React from "react";
import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import ParticlesBackground from "@/particles/ParticlesBackground";

function HeroCard({ name, subname }) {
  return (
    <div className="relative w-full h-[316px]">
      {/* Particles Background */}
      <div className="absolute inset-0">
        <ParticlesBackground />
      </div>

      {/* Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/Assets/Rectangle 1.png")',
          opacity: 0.5, // Adjust for transparency
        }}
      ></div>

      {/* Content */}
      <div className="relative flex items-center justify-center h-full text-white">
        <div>
          <div className="flex justify-center mb-3">
            <img src="/Assets/Meubel House_Logos-05.png" alt="Logo" />
          </div>
          <h2 className="text-center text-5xl font-medium mb-4">{name}</h2>
          <div className="flex items-center justify-center">
            <Link to={"/"} className="text-base font-medium text-primary">
              Home
            </Link>
            <LuChevronRight className="mx-2" size={"18px"} color="white" />
            <span>{subname ? subname : name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroCard;
