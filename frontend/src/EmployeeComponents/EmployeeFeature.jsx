import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";

const EmployeeFeature = () => {
  const [active, setActive] = useState(0);

  const features = [
    {
      title: "Advanced real-time AI Gear Detection",
      description:
        "Detects helmets, gloves, vest and safety glasses in real-time to ensure full safety compliance.",
    },
    {
      title: "Real-Time Face Verification System",
      description:
        "We prioritize efficient planning and cost-effective solutions to meet deadlines without exceeding budgets.",
    },
    {
      title: "Gamified Points and Reward Program",
      description:
        "Encourages consistent safety habits with redeemable points for compliant workers.",
    },
    {
      title: "Unified Dashboard for Full Site Control",
      description:
        "Monitor attendance, performance and safety status all in one clean dashboard.",
    },
  ];

  return (
    <section className="w-full py-20 flex flex-col md:flex-row justify-between items-start px-6 md:px-0 gap-16 mt-20 relative mb-20 overflow-hidden bg-gradient-to-br from-white to-orange-50/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-0 w-[30%] h-[30%] bg-orange-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* LEFT SIDE CONTENT */}
      <motion.div
        className="relative z-10 flex-1 max-w-lg text-left md:pl-20"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <h2
          className="text-4xl font-bold leading-snug mb-4"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          <span className="text-[#f97316]">Smart Features</span> for Safer{" "}
          <br />
          Construction Sites
        </h2>
        <p className="mb-8 leading-relaxed text-sm" style={{color:'#696969'}}>
          WolfEye+ combines AI accuracy, automation, and motivation to keep your
          site secure and your workers consistent. From instant detection to
          performance tracking, every feature is built to make safety
          effortless. It’s not just about monitoring — it’s about building a
          safer, smarter, and more responsible workforce.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2">
          Start your project
          <span className="text-xl">↗</span>
        </button>
      </motion.div>

      {/* RIGHT SIDE FEATURE LIST */}
<div className="relative z-10 flex-1 w-full md:w-auto space-y-6 md:ml-20">
  {features.map((feature, index) => {
    const isActive = active === index;
    return (
      <motion.div
        key={index}
        className={`relative rounded-[2rem] p-6 md:p-8 transition-all duration-300 cursor-pointer w-full md:max-w-[500px] lg:max-w-[565px] backdrop-blur-md border ${
          isActive
            ? "bg-[#ea7c3b] text-white border-[#ea7c3b] shadow-xl"
            : "bg-white/60 text-gray-900 border-white/50 hover:bg-white/80 hover:shadow-lg"
        }`}
        onClick={() => setActive(isActive ? null : index)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: index * 0.15,
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold leading-snug">
                  {feature.title}
                </h3>

                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-black text-white hover:bg-gray-100"
                  } transition`}
                >
                  {isActive ? <X size={20} /> : <Plus size={20} />}
                </div>
              </div>

              {isActive && (
                <motion.p
                  className="text-sm mt-3 leading-relaxed text-white/90 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {feature.description}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeFeature;
