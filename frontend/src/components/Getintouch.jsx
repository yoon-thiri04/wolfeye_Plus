import React from "react";
import { motion } from "framer-motion";

const GetInTouch = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-start justify-between gap-12 bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-orange-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Left Text Section */}
      <motion.div
        className="md:w-1/2 text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-left">
          Let’s build something <br /> great together!
        </h2>
        <p className="text-gray-500 max-w-md text-left">
          Get in touch with us for a consultation or quote on your next
          commercial project.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        className="md:w-1/2 w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 md:p-10 shadow-xl"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <form className="flex flex-col space-y-6 text-left">
          {/* Name */}
          <div>
            <label className="block text-gray-600 text-sm mb-2 text-left font-medium">Home</label>
            <input
              type="text"
              placeholder="Michael Carter"
              defaultValue="Michael Carter"
              className="w-full px-4 py-3 text-base bg-white/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm mb-2 text-left font-medium">Email</label>
            <input
              type="email"
              placeholder="michaelcarter@gmail.com"
              defaultValue="michaelcarter@gmail.com"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium transition-all duration-300"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-600 text-sm mb-2 text-left font-medium">Phone number</label>
            <input
              type="tel"
              placeholder="+1 650 213 7379"
              defaultValue="+1 650 213 7379"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium transition-all duration-300"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-600 text-sm mb-2 text-left font-medium">Message</label>
            <textarea
              placeholder="Tell us about your project needs..."
              defaultValue="Tell us about your project needs..."
              rows="3"
              className="w-full px-4 py-3 text-base bg-white/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium transition-all duration-300"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#ea7c3b] hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Submit <span className="ml-1 text-lg leading-none">↗</span>
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default GetInTouch;
