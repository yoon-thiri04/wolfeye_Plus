import React from "react";
import { motion } from "framer-motion";
import facedetectIcon from "../assets/images/face-detection.png";
import gearcheckIcon from "../assets/images/gear-check.png";
import pointIcon from "../assets/images/point-icon.png";

const EmployeeHowItWorks = () => {
  const steps = [
    {
      icon: (
      <img
        src={facedetectIcon}
        alt="Face Detection"
        className="w-10 h-10 object-contain"
      />
    ),
      title: "Face Detection",
      description:
        "Verifies each worker instantly to ensure only authorized personnel enter the site.",
      color: "from-[#8b5cf6] to-[#a78fba]",
      shadow: "shadow-[0_0_30px_5px_rgba(139,92,246,0.3)]",
      connector: "from-[#8b5cf6] via-[#60a5fa] to-[#38bdf8]",
      circleStart: "bg-[#8b5cf6]",
      circleEnd: "bg-[#38bdf8]",
    },
    {
     icon: (
      <img
        src={gearcheckIcon}
        alt="Face Detection"
        className="w-10 h-10 object-contain"
      />
    ),
      title: "Gear Check",
      description:
        "Our AI instantly checks if helmets, gloves, shirts, and glasses are properly worn before work begins.",
      color: "from-[#38bdf8] to-[#67e8f9]",
      shadow: "shadow-[0_0_30px_5px_rgba(56,189,248,0.3)]",
      connector: "from-[#38bdf8] via-[#fcd34d] to-[#fbbf24]",
      circleStart: "bg-[#38bdf8]",
      circleEnd: "bg-[#fbbf24]",
    },
    {
      icon: (
      <img
        src={pointIcon}
        alt="Face Detection"
        className="w-10 h-10 object-contain"
      />
    ),
      title: "Points & Attendance",
      description:
        "Attendance is recorded and safety points are added — motivating consistency and discipline.",
      color: "from-[#f97316] to-[#fb923c]",
      shadow: "shadow-[0_0_30px_5px_rgba(251,191,36,0.3)]",
    },
  ];

  return (
    <section className="w-full py-20 bg-white text-center mt-20">
      {/* Section Title */}
      <motion.h2
        className="text-4xl font-bold mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        style={{ fontFamily: "Plus Jakarta Sans"}}
      >
        How it Works?
      </motion.h2>

      {/* Steps */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-16 px-6 md:px-20 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center max-w-xs relative"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: index * 0.15, // smooth stagger effect
            }}
            viewport={{ once: false, amount: 0.3 }}
          >
            {/* Icon with gradient background */}
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 ${step.shadow}`}
            >
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{step.description}</p>

            {/* Connector + circles */}
            {index < steps.length - 1 && (
              <>
                {/* Dotted gradient line */}
                <div
                  className={`hidden md:block absolute top-10 right-[-140px] w-[140px] h-[2px] bg-gradient-to-r ${step.connector} opacity-70`}
                  style={{
                    maskImage:
                      "repeating-linear-gradient(to right, black 0 6px, transparent 6px 12px)",
                    WebkitMaskImage:
                      "repeating-linear-gradient(to right, black 0 6px, transparent 6px 12px)",
                  }}
                ></div>

                {/* Circle at start of connector */}
                <div
                  className={`hidden md:block absolute top-9 right-[-2px] w-4 h-4 rounded-full border-2 border-white ${step.circleStart} shadow-md`}
                ></div>

                {/* Circle at end of connector */}
                <div
                  className={`hidden md:block absolute top-9 right-[-142px] w-4 h-4 rounded-full border-2 border-white ${step.circleEnd} shadow-md`}
                ></div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EmployeeHowItWorks;
