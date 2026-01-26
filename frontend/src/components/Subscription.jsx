import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import wolflying from "../assets/images/wolf-lying.png";
import Content from "../assets/images/Content.png";

const Subscription = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] bg-orange-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Wolf mascot */}
      <motion.div
        className="mb-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <img
          src={wolflying}
          alt="Wolf mascot"
          className="w-64 h-auto md:w-96 object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Header text */}
      <motion.div
        className="text-center mb-8 max-w-3xl px-4 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
          Starter Plan Activated!
        </h2>

        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              You now have access to your Starter Plan features. Monitor up to <span className="font-semibold text-orange-600">5 workers</span>, track
              attendance, check safety gear compliance, and reward your team for following protocols all
              from your dashboard.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:justify-end">
             <div className="flex items-center text-orange-600 font-semibold text-sm group cursor-pointer">
                Explore Dashboard <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        </div>
      </motion.div>

      {/* image */}
      <motion.div
        className="relative w-full max-w-5xl mt-8 flex items-center justify-center px-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
          <img
            src={Content}
            alt="Dashboard Illustration"
            className="w-full h-auto object-contain bg-white"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Subscription;
