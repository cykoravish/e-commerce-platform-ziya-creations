"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "./ui/Modal";
import { footerContent } from "./footerContent";

import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<
    keyof typeof footerContent | null
  >(null);
  return (
    <>
      <footer className="bg-[#121826] text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-5">Quick Links</h3>

              <ul className="space-y-3 text-[15px] text-gray-400">
                <li>
                  <button
                    onClick={() => setActiveModal("about")}
                    className="hover:text-white transition"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("contact")}
                    className="hover:text-white transition"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("store")}
                    className="hover:text-white transition"
                  >
                    Store Locator
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-5">Customer Service</h3>

              <ul className="space-y-3 text-[15px] text-gray-400">
                <li>
                  <button
                    onClick={() => setActiveModal("shipping")}
                    className="hover:text-white transition"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("returns")}
                    className="hover:text-white transition"
                  >
                    Return Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("faq")}
                    className="hover:text-white transition"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("replacement")}
                    className="hover:text-white transition"
                  >
                    Replacement & Damage Claim Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-5">Legal</h3>

              <ul className="space-y-3 text-[15px] text-gray-400">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="hover:text-white transition"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("refund")}
                    className="hover:text-white transition"
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="hover:text-white transition"
                  >
                    Terms & Conditions For Cash On Delivery
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-semibold mb-5">Connect</h3>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1d2636] hover:bg-[#273247] transition flex items-center justify-center"
                >
                  <FaInstagram size={18} />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1d2636] hover:bg-[#273247] transition flex items-center justify-center"
                >
                  <FaFacebookF size={18} />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1d2636] hover:bg-[#273247] transition flex items-center justify-center"
                >
                  <FaWhatsapp size={18} />
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1d2636] hover:bg-[#273247] transition flex items-center justify-center"
                >
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#283041] mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2026 Ziya Creation. All rights reserved.
          </div>
        </div>
      </footer>
      <Modal
        open={activeModal !== null}
        title={activeModal ? footerContent[activeModal].title : ""}
        onClose={() => setActiveModal(null)}
      >
        {activeModal && footerContent[activeModal].content}
      </Modal>
    </>
  );
}
