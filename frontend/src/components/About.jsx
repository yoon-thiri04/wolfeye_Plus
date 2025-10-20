import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import wolfMascot from "../assets/images/wolf-about.png";

export default function About() {
  return (
    <section className="flex justify-center items-center py-20 px-6 bg-white overflow-visible">
      <div className="relative max-w-6xl w-full flex flex-col lg:flex-row items-center bg-white border border-[#f28c3a] rounded-[36px] overflow-visible shadow-lg">

        {/* Wolf Mascot */}
        <motion.div
          className="relative w-full lg:w-[40%] flex justify-center lg:justify-start -mt-16 lg:-mt-24 z-30"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}
        >
          <img
            src={wolfMascot}
            alt="Wolf Mascot"
            className="w-[300px] lg:w-[380px] -ml-6 lg:-ml-10"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="relative w-full lg:w-[60%] flex flex-col justify-center px-8 lg:px-12 py-10 space-y-6 text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black" style={{ fontFamily: "Plus Jakarta Sans"}}>
            The Eye on <span className="text-[#f28c3a]">Safety</span>
          </h2>

          <p className="text-gray-700 text-[15px] leading-relaxed">
            With advanced AI detection, <strong>WolfEye+</strong> ensures worker
            wears the required safety gear before starting work, reducing
            accidents and maintaining strict safety standards on every
            construction site. By combining real-time face and{" "}
            <strong>PPE detection with automated attendance tracking</strong>,
            supervisors can monitor compliance effortlessly, while workers are
            motivated through a gamified points and rewards system.
          </p>

          <p className="text-gray-700 text-[15px] leading-relaxed">
            WolfEye+ empowers teams to work safer by providing detailed insights
            into worker performance, gear compliance, and attendance trends.
            WolfEye+ creates a culture of accountability and discipline, helping
            construction companies minimize risks, increase efficiency, and
            protect every member of the workforce.
          </p>
        </motion.div>

        {/* Corner Button */}
        <motion.div
          className="absolute -bottom-6 right-6"
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "backOut", delay: 0.3 }}
          viewport={{ once: false }}
        >
          <button className="bg-black hover:bg-gray-800 text-white p-4 rounded-lg transition-all shadow-md">
            <ArrowUpRight size={22} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
