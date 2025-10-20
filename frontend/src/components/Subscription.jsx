import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import wolflying from "../assets/images/wolf-lying.png";
import Content from "../assets/images/Content.png";

const Subscription = () => {
  return (
    <section className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Wolf mascot */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <img
          src={wolflying}
          alt="Wolf mascot"
          className="w-100 h-100 object-contain"
        />
      </motion.div>

      {/* Header text */}
      <motion.div
        className="text-center mb-4 max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2 className="text-4xl md:text-3xl font-bold text-gray-900 mb-4">
          Starter Plan Activated!
        </h2>

        <div className="flex items-center justify-center gap-2">
          <p className="text-gray-500 leading-relaxed">
            You now have access to your Starter Plan features. Monitor up to 5 workers, track
            attendance, check safety gear compliance, and reward your team for following protocols all
            from your dashboard.
          </p>
          <ArrowRight className="w-6 h-6 text-gray-900 flex-shrink-0 ml-3" />
        </div>
      </motion.div>

      {/* image */}
      <motion.div
        className="relative w-full max-w-4xl mt-16 flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <img
          src={Content}
          alt="Dashboard Illustration"
          className="w-[855px] h-[566px] object-contain"
        />
      </motion.div>
    </section>
  );
};

export default Subscription;
