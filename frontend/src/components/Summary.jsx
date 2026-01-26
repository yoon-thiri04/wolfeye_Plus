import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import wolf from "../assets/images/welcome-wolf.png";

export default function Summary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const employeeData = state?.employeeData;
  const [countdown, setCountdown] = useState(10);

  const getCompanyAuthToken = () => {
    return localStorage.getItem('face_verification_company_token') ||
           localStorage.getItem('company_token');
  };

  useEffect(() => {
    const companyToken = getCompanyAuthToken();
    if (!companyToken) {
      console.warn("No company token found, but continuing with summary display");
    }

    // Countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          const token = getCompanyAuthToken();
          if (token) {
            localStorage.setItem('face_verification_company_token', token);
          }

          navigate('/facewebcam');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  if (!employeeData) return <p>Loading...</p>;

  const points = employeeData.earn || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Wolf Image */}
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
          <img
            src={wolf}
            alt="Construction Worker"
            className="w-64 md:w-96 lg:w-[500px] h-auto object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex-1 w-full">
          <h1
            className="text-3xl md:text-5xl font-bold mb-6 text-left"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            <span className="text-[#ea7c3b]">Welcome</span>
            <span className="text-gray-900"> from</span>
            <br />
            <span className="text-gray-900">Construction Site!</span>
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-8 text-left max-w-xl">
            All your safety gear has been successfully verified, and your attendance is recorded. Now you're ready to begin a productive and secure workday with WolfEye+.
          </p>

          {/* Employee Details */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 mb-6 text-left shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Employee Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{employeeData.name}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <span className="text-gray-600">Status:</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  {employeeData.status}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <span className="text-gray-600">Check-In:</span>
                <span className="font-medium text-gray-900">{employeeData.checkIn}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <span className="text-gray-600">Earn:</span>
                <span className="font-bold text-[#ea7c3b]">{points} Points</span>
              </div>
            </div>
          </div>

          {/* PPE Items */}
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(employeeData.ppeItems)
              .filter(([item]) => item.toLowerCase() !== "person")
              .map(([item, hasItem]) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 ${hasItem ? "text-blue-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      hasItem ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    {hasItem ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : (
                      <X className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="font-medium">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </div>
              ))}
          </div>

          {/* Missing PPE */}
          {Object.entries(employeeData.ppeItems).map(
            ([item, hasItem]) =>
              !hasItem && (
                <p key={item} className="text-red-600 text-sm text-left">
                  You missed wearing safety{" "}
                  <span className="font-semibold">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>.
                </p>
              )
          )}

          {/* Countdown Timer */}
          <p className="mt-6 text-sm text-gray-500 text-left">
            Redirecting to face recognition in <span className="font-semibold text-gray-700">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  );
}