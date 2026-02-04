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

const EmployeeBanner = () => {
  const partners = [
    { name: "Aspen Online", logo: aspenLogo },
    { name: "Crop and Highlight", logo: cropLogo },
    { name: "N", logo: nLogo },
    { name: "Millssy", logo: millssyLogo },
    { name: "Peppermint", logo: peppermintLogo },
    { name: "Pixie Labs", logo: pixieLogo },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-orange-50 to-white py-16 px-6 md:px-12 flex flex-col items-center mt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Partner Logos */}
      <motion.div
        className="flex items-center justify-center gap-6 w-full max-w-6xl mb-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <button className="hidden md:block p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-orange-500 hover:scale-110 transition-all absolute left-0 z-20">
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap px-4 md:px-12 w-full">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="group"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="h-16 md:h-20 w-auto grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>

        <button className="hidden md:block p-3 rounded-full bg-white shadow-lg text-gray-700 hover:text-orange-500 hover:scale-110 transition-all absolute right-0 z-20">
          <ArrowRight size={20} />
        </button>
      </motion.div>

      {/* Banner Section */}
      <motion.div
        className="relative flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-10 max-w-6xl shadow-xl z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        {/* Stars */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-6 left-6"
        >
           <Star className="text-orange-400 fill-orange-400" size={24} />
        </motion.div>
        
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-6 right-6"
        >
           <Star className="text-blue-400 fill-blue-400" size={20} />
        </motion.div>

        {/* Image */}
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl z-10"></div>
          <div className="overflow-hidden rounded-3xl shadow-lg transform transition-transform duration-500 group-hover:scale-[1.02]">
            <img
              src={bannerImage}
              alt="Construction site"
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 md:pl-12 mt-8 md:mt-0 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight" style={{ fontFamily: "Plus Jakarta Sans" }}>
            Earn & Redeem Points with <span className="text-orange-500">Trusted Partners</span>
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed text-base md:text-lg">
            Workers earn points for full safety compliance, which can be
            redeemed at partner cafés, shops, and service outlets. Partners
            benefit from increased foot traffic and loyal customers.
          </p>

          <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 mx-auto md:mx-0 font-medium">
            Explore Partners{" "}
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default EmployeeBanner;
