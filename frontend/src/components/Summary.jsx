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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-6xl w-full flex gap-12 items-center">
        {/* Wolf Image */}
        <div className="flex-shrink-0">
          <img
            src={wolf}
            alt="Construction Worker"
            className="w-140 h-auto object-contain"
          />
        </div>

        <div className="flex-1">
          <h1
            className="text-5xl font-bold mb-6 text-left"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            <span className="text-orange-500">Welcome</span>
            <span className="text-black"> from</span>
            <br />
            <span className="text-black">Construction Site!</span>
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-8 text-left">
            All your safety gear has been successfully verified, and your attendance is recorded. Now you're ready to begin a productive and secure workday with WolfEye+.
          </p>

          {/* Employee Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold mb-4">Employee Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{employeeData.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                  {employeeData.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Check-In:</span>
                <span className="font-medium">{employeeData.checkIn}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Earn:</span>
                <span className="font-medium">{points} Points</span>
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