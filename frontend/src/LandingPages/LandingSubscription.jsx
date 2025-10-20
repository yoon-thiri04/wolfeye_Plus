import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import mascot from "../assets/images/wolf-lying.png";

const LandingSubscription = () => {
  const [billing, setBilling] = useState("yearly");

  const plans = [
    {
      name: "Free",
      price: "$0",
      subtitle: "Best for personal use",
      button: "Get started",
      topic: "What you get:",
      features: [
        "Up to 5 workers",
        "Real-time gear detection",
        "Face verification",
        "Basic attendance tracking",
        "Points redemption at cafés",
      ],
      highlight: false,
    },
    {
      name: "Starter",
      price: "$19",
      subtitle: "Best for personal use",
      button: "Get started",
      topic: "All free features, plus:",
      features: [
        "Up to 20 workers",
        "Advanced gear detection",
        "Face verification",
        "Adv attendance tracking",
        "Points redemption at cafés",
      ],
      highlight: false,
    },
    {
      name: "Business",
      price: "$39",
      subtitle: "Best for personal use",
      button: "Get started",
      topic: "All starter features, plus:",
      features: [
        "Up to 100 workers",
        "Advanced gear detection",
        "Face verification",
        "Adv attendance tracking",
        "Points redemption at cafés",
      ],
      highlight: true,
      tag: "Most Popular ✨",
    },
    {
      name: "Enterprise",
      price: "Custom",
      subtitle: "Best for personal use",
      button: "Get started",
      topic: "All business features, plus:",
      features: [
        "Supports 250+ workers",
        "Full enterprise-level",
        "Dedicated support & training",
        "Advanced analytics",
        "Custom alerts and location",
      ],
      highlight: false,
    },
  ];

  return (
    <section className="w-full py-20 bg-white flex flex-col items-start px-6 md:px-12">
      {/* Header & Mascot */}
      <div className="w-full flex flex-col items-center mb-6">
        <img
          src={mascot}
          alt="Wolf mascot"
          className="w-100 h-100 object-contain mb-6"
        />

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Flexible Plans for Every Team Size
        </h2>

        <p className="text-gray-600 text-center">
          Choose the perfect plan for your business needs
        </p>
      </div>

      {/* Billing Toggle */}
      <motion.div
        className="w-full flex flex-row items-center text-left gap-4 mb-12 justify-start pl-6 md:pl-190"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <span className="text-sm text-orange-500">Save 15% on yearly plan!</span>

        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              billing === "yearly"
                ? "bg-orange-500 text-white"
                : "text-gray-700"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              billing === "monthly"
                ? "bg-orange-500 text-white"
                : "text-gray-700"
            }`}
          >
            Monthly
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className={`rounded-xl border transition-all duration-300 ${
              plan.highlight
                ? "border-orange-500 bg-orange-50 relative scale-105"
                : "border-gray-200 bg-white"
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-sm font-medium py-1 rounded-t-xl text-center">
                {plan.tag}
              </div>
            )}

            <div className={`p-6 pt-${plan.highlight ? "10" : "6"} text-left`}>
              <h3 className="text-lg font-semibold mb-1 mt-9">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.subtitle}</p>

              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-gray-500 text-sm"> /month</span>
                )}
              </div>

              <button
                className={`w-full py-2 rounded-md font-medium transition ${
                  plan.highlight
                    ? "bg-orange-500 text-white hover:opacity-90"
                    : "bg-orange-500 text-white hover:opacity-90"
                }`}
              >
                {plan.button}
              </button>

              <div className="mt-6 text-sm text-gray-700">
                <p className="font-semibold mb-2">{plan.topic}</p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className={`mt-0.5 text-orange-500`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LandingSubscription;
