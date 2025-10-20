import React from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import bannerImage from "../assets/images/construction.png";
import aspenLogo from "../assets/images/brand_logo1.png";
import cropLogo from "../assets/images/brand_logo2.png";
import nLogo from "../assets/images/brand_logo3.png";
import millssyLogo from "../assets/images/brand_logo4.png";
import peppermintLogo from "../assets/images/brand_logo5.png";
import pixieLogo from "../assets/images/brand_logo6.png";

const LandingBanner = () => {
  const partners = [
    { name: "Aspen Online", logo: aspenLogo },
    { name: "Crop and Highlight", logo: cropLogo },
    { name: "N", logo: nLogo },
    { name: "Millssy", logo: millssyLogo },
    { name: "Peppermint", logo: peppermintLogo },
    { name: "Pixie Labs", logo: pixieLogo },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 flex flex-col items-center">
      {/* Partner Logos */}
      <motion.div
        className="flex items-center justify-center gap-6 w-full max-w-6xl mb-12 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <button className="p-2 rounded-full bg-black text-white hover:opacity-80 absolute left-0">
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center justify-center gap-12 flex-wrap px-12">
          {partners.map((p, i) => (
            <motion.img
              key={i}
              src={p.logo}
              alt={p.name}
              className="h-25 w-auto grayscale hover:grayscale-0 transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
            />
          ))}
        </div>

        <button className="p-2 rounded-full bg-black text-white hover:opacity-80 absolute right-0">
          <ArrowRight size={20} />
        </button>
      </motion.div>

      {/* Banner Section */}
      <motion.div
        className="relative flex flex-col md:flex-row items-center bg-gray-50 rounded-3xl p-6 md:p-10 max-w-6xl shadow-sm"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Stars */}
        <Star className="absolute top-4 left-4 text-orange-500" size={18} />
        <Star className="absolute top-4 right-4 text-orange-500" size={18} />

        {/* Image */}
        <div className="w-full md:w-1/2">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={bannerImage}
              alt="Construction site"
              className="w-full h-full object-cover"
              style={{ filter: "sepia(1) hue-rotate(-10deg) saturate(2)" }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 md:pl-10 mt-6 md:mt-0 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
            Earn & Redeem Points with Trusted Partners
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Workers earn points for full safety compliance, which can be
            redeemed at partner cafés, shops, and service outlets. Partners
            benefit from increased foot traffic and loyal customers.
          </p>

          <button className="bg-black text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 hover:opacity-90 mx-auto md:mx-0">
            Explore Partners{" "}
            <span className="ml-1 text-lg leading-none">↗</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default LandingBanner;
