import React from "react";
import { motion } from "framer-motion";

const LandingGetInTouch = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-start justify-between gap-12 bg-white">
      {/* Left Text Section */}
      <motion.div
        className="md:w-1/2 text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-left">
          Let’s build something <br /> great together!
        </h2>
        <p className="text-gray-500 max-w-md text-left">
          Get in touch with us for a consultation or quote on your next
          commercial project.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="md:w-1/2 w-full bg-gray-50 rounded-3xl p-8 md:p-10 shadow-sm"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <form className="flex flex-col space-y-6 text-left">
          {/* Name */}
          <div>
            <label className="block text-gray-500 text-sm mb-2 text-left">Home</label>
            <input
              type="text"
              placeholder="Michael Carter"
              defaultValue="Michael Carter"
              className="w-full px-4 py-3 border border-orange-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-500 text-sm mb-2 text-left">Email</label>
            <input
              type="email"
              placeholder="michaelcarter@gmail.com"
              defaultValue="michaelcarter@gmail.com"
              className="w-full px-4 py-3 bg-white rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-medium"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-500 text-sm mb-2 text-left">Phone number</label>
            <input
              type="tel"
              placeholder="+1 650 213 7379"
              defaultValue="+1 650 213 7379"
              className="w-full px-4 py-3 bg-white rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-medium"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-500 text-sm mb-2 text-left">Message</label>
            <textarea
              placeholder="Tell us about your project needs..."
              defaultValue="Tell us about your project needs..."
              rows="3"
              className="w-full px-4 py-3 bg-white rounded-lg outline-none focus:ring-2 focus:ring-orange-400 font-medium"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Submit <span className="ml-1 text-lg leading-none">↗</span>
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default LandingGetInTouch;
