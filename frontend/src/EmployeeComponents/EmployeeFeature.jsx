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
    <section className="w-full py-20 flex flex-col md:flex-row justify-between items-start px-6 md:px-0 gap-16 mt-30 relative mb-40">
  {/* background image */}
{/*  <img*/}
{/*  src={snowflake}*/}
{/*  alt="background"*/}
{/*  className="absolute inset-0 m-auto w-[799px] h-[841px] object-contain opacity-20 pointer-events-none"*/}
{/*/>*/}


      {/* LEFT SIDE CONTENT */}
      <motion.div
        className="relative z-10 flex-1 max-w-lg text-left"
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
<div className="relative z-10 flex-1 md:w-[400px] lg:w-[400px] md:h-[198px] lg:h-[198px] space-y-6 ml-20">
  {features.map((feature, index) => {
    const isActive = active === index;
    return (
      <motion.div
        key={index}
        className={`relative rounded-[2rem] p-8 transition-all duration-300 cursor-pointer w-[565px] ${
          isActive
            ? "bg-[#ea7c3b] text-white"
            : "bg-[#F5F5F5] text-black hover:bg-white/90"
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
