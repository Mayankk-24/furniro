import { Button } from "@heroui/react";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { MdChevronLeft } from "react-icons/md";
import { Link, Navigate } from "react-router-dom";

function Thankyou() {
  return (
    <>
      <main className="w-screen h-screen flex justify-center items-center">
        <div>
          <div className="text-center">
            <h3 className="text-2xl text-[#1C252E] font-bold mb-4 animate-appearance-in">
              Thank you for your purchase!
            </h3>
          </div>
          <div className="flex justify-center py-10 animate-appearance-in">
            <svg
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1aah3z4 w-[320px] h-[240px]"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 480 360"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id=":r6c:"
                  x1="19.496%"
                  x2="77.479%"
                  y1="71.822%"
                  y2="16.69%"
                >
                  <stop offset="0%" stop-color="#00A76F"></stop>
                  <stop
                    offset="100%"
                    stop-color="#00A76F"
                    stop-opacity="0"
                  ></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#:r6c:)"
                fill-rule="nonzero"
                d="M0 198.78c0 41.458 14.945 79.236 39.539 107.786 28.214 32.765 69.128 53.365 114.734 53.434a148.44 148.44 0 0056.495-11.036c9.051-3.699 19.182-3.274 27.948 1.107a75.779 75.779 0 0033.957 8.01c5.023 0 9.942-.494 14.7-1.433 13.58-2.67 25.94-8.99 36.09-17.94 6.378-5.627 14.547-8.456 22.897-8.446h.142c27.589 0 53.215-8.732 74.492-23.696 19.021-13.36 34.554-31.696 44.904-53.224C474.92 234.58 480 213.388 480 190.958c0-76.93-59.774-139.305-133.498-139.305-7.516 0-14.88.663-22.063 1.899C305.418 21.42 271.355 0 232.499 0a103.651 103.651 0 00-45.88 10.661c-13.24 6.487-25.011 15.705-34.64 26.939-32.698.544-62.931 11.69-87.676 30.291C25.351 97.155 0 144.882 0 198.781z"
                opacity="0.2"
              ></path>
              <image
                href="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/illustrations/characters/character-happy-jump.webp"
                height="280"
                x="270"
                y="40"
              ></image>
              <path
                fill="#DFE3E8"
                d="M253.579 162.701a5.06 5.06 0 01-4.861-3.646l-15.033-53.327a16.19 16.19 0 00-15.276-12.007h-78.471a16.174 16.174 0 00-15.325 11.995l-14.985 53.29a5.06 5.06 0 01-6.164 3.266 5.055 5.055 0 01-3.558-6l14.985-53.291a26.31 26.31 0 0125.047-19.347h78.471a26.327 26.327 0 0124.998 19.36l14.985 53.29a5.054 5.054 0 01-3.5 6.222 4.786 4.786 0 01-1.313.195z"
              ></path>
              <path
                fill="url(#paint0_linear_1_68)"
                d="M244.501 272.368H113.846a10.329 10.329 0 01-10.245-9.017l-12.153-95.716H266.85l-12.153 95.716a10.3 10.3 0 01-10.196 9.017z"
              ></path>
              <path
                fill="url(#paint1_linear_1_68)"
                d="M268.151 155.117H90.196c-5.631 0-10.196 4.565-10.196 10.196v.887c0 5.632 4.565 10.197 10.196 10.197h177.955c5.631 0 10.196-4.565 10.196-10.197v-.887c0-5.631-4.565-10.196-10.196-10.196z"
              ></path>
              <path
                fill="#004B50"
                d="M128.66 184.017h-.012a7.874 7.874 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875zM162.335 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM196.023 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM229.699 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875z"
              ></path>
              <path
                fill="url(#paint2_linear_1_68)"
                d="M202.793 80h-47.239a8.762 8.762 0 00-8.762 8.762v.012a8.762 8.762 0 008.762 8.763h47.239a8.762 8.762 0 008.762-8.763v-.012A8.762 8.762 0 00202.793 80z"
              ></path>
              <path
                fill="#fff"
                d="M254.289 279.577c23.907 0 43.288-19.381 43.288-43.288 0-23.908-19.381-43.289-43.288-43.289C230.381 193 211 212.381 211 236.289c0 23.907 19.381 43.288 43.289 43.288z"
              ></path>
              <path
                fill="url(#paint3_linear_1_68)"
                d="M243.999 256.002l-15.183-16.746a3.15 3.15 0 01.214-4.444l4.219-3.833a3.146 3.146 0 014.444.214l9.144 10.065 25.184-23.417a3.149 3.149 0 014.444.16l3.876 4.176a3.146 3.146 0 01.843 2.255 3.148 3.148 0 01-1.004 2.189l-31.758 29.531a3.119 3.119 0 01-4.423-.15z"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_1_68"
                  x1="267"
                  x2="80.541"
                  y1="272"
                  y2="247.455"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#00A76F"></stop>
                  <stop offset="1" stop-color="#007867"></stop>
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1_68"
                  x1="80"
                  x2="80"
                  y1="155.117"
                  y2="176.397"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#5BE49B"></stop>
                  <stop offset="1" stop-color="#007867"></stop>
                </linearGradient>
                <linearGradient
                  id="paint2_linear_1_68"
                  x1="146.792"
                  x2="146.792"
                  y1="80"
                  y2="97.537"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#5BE49B"></stop>
                  <stop offset="1" stop-color="#007867"></stop>
                </linearGradient>
                <linearGradient
                  id="paint3_linear_1_68"
                  x1="228"
                  x2="228"
                  y1="217"
                  y2="257"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#5BE49B"></stop>
                  <stop offset="1" stop-color="#007867"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-center border-b border-dashed animate-appearance-in">
            <h3 className="text-base text-[#1C252E] font-medium mb-6">
              Thanks for placing order
            </h3>
            <p className="text-base text-[#637381] mb-10">
              We will send you a notification within 5 days when it ships.{" "}
              <br />
              If you have any question or queries then fell to get in contact
              us. <br />
              All the best,
            </p>
          </div>
          <div className="flex justify-center py-10">
            <Link to={"/"}>
              <button className="bg-transparent font-semibold text-black border border-[#909eab52] hover:bg-gray-100 transition-transform-background  h-12 focus:outline-none flex items-center gap-x-2">
                <MdChevronLeft size={"25px"} /> Go to home
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Thankyou;
