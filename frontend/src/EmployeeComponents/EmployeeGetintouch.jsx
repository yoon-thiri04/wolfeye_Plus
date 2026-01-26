import React from "react";
import { motion } from "framer-motion";

const EmployeeGetInTouch = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-start justify-between gap-12 bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Left Text Section */}
      <motion.div
        className="md:w-1/2 text-left relative z-10"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left" style={{ fontFamily: "Plus Jakarta Sans" }}>
          Let’s build something <br /> <span className="text-orange-500">great together!</span>
        </h2>
        <p className="text-gray-500 max-w-lg text-left text-lg leading-relaxed">
          Get in touch with us for a consultation or quote on your next
          commercial project. We are here to help you achieve your safety goals.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="md:w-1/2 w-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative z-10"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <form className="flex flex-col space-y-6 text-left">
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 text-left ml-1">Name</label>
            <input
              type="text"
              placeholder="Michael Carter"
              defaultValue="Michael Carter"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 text-left ml-1">Email</label>
            <input
              type="email"
              placeholder="michaelcarter@gmail.com"
              defaultValue="michaelcarter@gmail.com"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 text-left ml-1">Phone number</label>
            <input
              type="tel"
              placeholder="+1 650 213 7379"
              defaultValue="+1 650 213 7379"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 text-left ml-1">Message</label>
            <textarea
              placeholder="Tell us about your project needs..."
              defaultValue="Tell us about your project needs..."
              rows="4"
              className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800 resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 mt-4"
          >
            Submit Request <span className="ml-1 text-lg leading-none">↗</span>
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default EmployeeGetInTouch;
