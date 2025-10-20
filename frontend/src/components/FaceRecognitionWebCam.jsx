import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Wifi, Sun, CheckCircle2, Users, Bell } from "lucide-react";

export default function LiveFaceVerify() {
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  const alertAudioRef = useRef(null);

  useEffect(() => {
    alertAudioRef.current = new Audio(`${import.meta.env.BASE_URL}alert.mp3`);
    alertAudioRef.current.preload = "auto";

    const preloadAudio = async () => {
      try {
        await alertAudioRef.current.load();
        alertAudioRef.current.volume = 0;
        await alertAudioRef.current.play().catch(() => {});
        alertAudioRef.current.pause();
        alertAudioRef.current.currentTime = 0;
        alertAudioRef.current.volume = 1;
      } catch (err) {
        console.log("Audio preload completed");
      }
    };

    preloadAudio();
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [boxScale, setBoxScale] = useState({ x: 1, y: 1 });
  const [checkInTime, setCheckInTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showMultipleFacesAlert, setShowMultipleFacesAlert] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [authError, setAuthError] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Speech synthesis cleanup ref
  const speechUtteranceRef = useRef(null);

  // Cleanup function to stop all audio and speech
  const stopAllAudio = () => {
    // Stop speech synthesis
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Stop alert audio
    if (alertAudioRef.current) {
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
    }

    setCountdown(null);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getCompanyAuthToken = () => {
    return localStorage.getItem('face_verification_company_token') ||
           localStorage.getItem('company_token');
  };

  const getCompanyId = () => {
    const faceVerificationId = localStorage.getItem('face_verification_company_id');
    if (faceVerificationId && faceVerificationId !== "") {
      return faceVerificationId;
    }

    const companyUser = localStorage.getItem('company_user');
    if (companyUser) {
      try {
        const userData = JSON.parse(companyUser);
        if (userData.id) {
          return userData.id;
        }
      } catch (err) {
        console.error("Error parsing company_user:", err);
      }
    }

    const token = getCompanyAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    return null;
  };

  const hasCompanyAuth = () => {
    const token = getCompanyAuthToken();
    const companyId = getCompanyId();

    console.log("Auth Check - Token:", token ? "Present" : "Missing");
    console.log("Auth Check - Company ID:", companyId);

    const hasAuth = !!(token && companyId && companyId !== "");
    console.log("Has Company Auth:", hasAuth);

    return hasAuth;
  };

  const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const token = getCompanyAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Adding Authorization header to request");
      } else {
        console.log("No token available for request");
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => {
      console.log("API Response received");
      return response;
    },
    (error) => {
      console.error("API Error:", error.response?.status, error.response?.data);
      if (error.response?.status === 401) {
        console.error("Authentication required - 401 received");
        setAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  // Fixed handleEndDetection function
  const handleEndDetection = async () => {
    try {
      const token = getCompanyAuthToken();
      const companyId = getCompanyId();

      console.log("Ending detection for company:", companyId);

      const res = await api.post(
        "http://localhost:8000/company/end_detect",
        {
          end: true,
          company_id: companyId
        }
      );

      console.log("End detection response:", res.data);
      stopAllAudio();
      navigate("/company/dashboard");

    } catch (err) {
      console.error("Error ending detection", err);
      stopAllAudio();
      navigate("/company/dashboard");
    }
  };

  const handleFaceSuccess = (email) => {
    stopAllAudio();

    const utter = new SpeechSynthesisUtterance("Face recognition success");
    utter.pitch = 1;
    utter.rate = 1;
    speechUtteranceRef.current = utter;

    utter.onend = () => {
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            // Stop audio before navigation
            stopAllAudio();
            navigate("/ppe-detect", { state: { email } });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    };
    window.speechSynthesis.speak(utter);
  };

  const playAlertSound = async () => {
    if (!alertAudioRef.current) return;

    try {
      alertAudioRef.current.currentTime = 0;
      await alertAudioRef.current.play();
    } catch (err) {
      console.error("Alert audio play failed:", err);
      const utter = new SpeechSynthesisUtterance("Alert! Unknown face detected");
      utter.pitch = 1.2;
      utter.rate = 1.1;
      speechUtteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    }
  };

  const captureAndVerify = async () => {
    if (!webcamRef.current || authError) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const byteString = atob(imageSrc.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      console.log("Sending face verification request...");
      const res = await api.post("/employee/verify/", formData);

      setResult(res.data);
      setAuthError(false);
      console.log("Face verification response:", res.data);

      // Check for multiple faces error from backend
      if (res.data.status === "error" && res.data.message && res.data.message.includes("Multiple faces detected")) {
        setShowMultipleFacesAlert(true);
        setTimeout(() => setShowMultipleFacesAlert(false), 5000);
        return;
      }

      if (res.data.status === "Identified") {
        clearInterval(intervalRef.current);
        handleFaceSuccess(res.data.email);
      } else {
        // Unknown face alert
        setShowAlert(true);
        playAlertSound();
        setTimeout(() => setShowAlert(false), 4000);
      }
    } catch (err) {
      console.error("Face verification error:", err);

      if (err.response?.status === 401) {
        setAuthError(true);
        setResult({
          status: "Authentication Required",
          detail: "Company authentication required"
        });
        console.log("Setting auth error to true due to 401 response");
      } else {
        setResult({ status: "Error", detail: err.message });
      }

      setShowAlert(true);
      playAlertSound();
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  const startCamera = () => {
    const hasAuth = hasCompanyAuth();
    console.log("Start Camera - Has Auth:", hasAuth);

    if (!hasAuth) {
      setAuthError(true);
      console.log("Authentication failed, setting auth error");
      return;
    }

    setIsActive(true);
    setIsRunning(true);
    setAuthError(false);
    console.log("Starting camera successfully");

    // Mark audio ready after user interaction
    setAudioReady(true);

    intervalRef.current = setInterval(captureAndVerify, 3000);

    const now = new Date();
    setCheckInTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  };

  const stopCamera = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (webcamRef.current && webcamRef.current.stream)
      webcamRef.current.stream.getTracks().forEach((track) => track.stop());
    setIsActive(false);

    // Stop all audio when stopping camera
    stopAllAudio();

    // Call handleEndDetection when stop camera is clicked
    handleEndDetection();
  };

  // Enhanced authentication check on component mount
  useEffect(() => {
    console.log("Component mounted - checking authentication");

    // Fix the missing company ID by extracting it from the token
    const token = getCompanyAuthToken();
    if (token && !localStorage.getItem('face_verification_company_id')) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          localStorage.setItem('face_verification_company_id', payload.id);
          console.log("Fixed missing company ID:", payload.id);
        }
      } catch (err) {
        console.error("Error extracting company ID from token:", err);
      }
    }

    const hasAuth = hasCompanyAuth();

    if (!hasAuth) {
      setAuthError(true);
      console.log("Authentication failed on mount");
      return;
    }

    console.log("Authentication successful, starting camera");
    startCamera();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Cleanup audio on unmount
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !webcamRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const video = webcamRef.current.video;
      if (!video) return;

      const xScale = container.width / video.videoWidth;
      const yScale = container.height / video.videoHeight;
      setBoxScale({ x: xScale, y: yScale });
    };
    window.addEventListener("resize", updateScale);
    const interval = setInterval(updateScale, 1000);
    return () => {
      window.removeEventListener("resize", updateScale);
      clearInterval(interval);
    };
  }, []);

  const getBoxStyle = (face) => ({
    position: "absolute",
    left: face?.x * boxScale.x + "px",
    top: face?.y * boxScale.y + "px",
    width: face?.w * boxScale.x + "px",
    height: face?.h * boxScale.y + "px",
    border: "3px solid #00ff00",
    backgroundColor: "transparent",
    pointerEvents: "none",
    boxSizing: "border-box",
    zIndex: 10,
  });

  const faceCount = result?.multiple_faces?.length || (result?.facial_area ? 1 : 0);

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-left">
            Real Time Safety Detection (Face)
          </h1>
          <p className="text-gray-600 text-sm mt-2 text-left">
            Your safety is your strength. WolfEye+ ensures every worker starts the day
            prepared and protected
          </p>
        </div>

        {/* Authentication Error Alert */}
        {authError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 text-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-yellow-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Access Required</p>
              <p className="text-sm text-yellow-700">
                Please access this page through the company dashboard to enable face verification.
                <button
                  onClick={() => {
                    stopAllAudio();
                    navigate('/company/dashboard');
                  }}
                  className="ml-2 underline hover:text-yellow-800 font-medium"
                >
                  Go to Dashboard
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Camera Feed</h2>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-500" />
                  <Sun className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Webcam container */}
              <div ref={containerRef} className="relative bg-white rounded-lg overflow-hidden">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden relative">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  </div>

                  <div className="aspect-[4/3] flex items-center justify-center relative">
                    {isActive && !authError ? (
                      <>
                        <Webcam
                          ref={webcamRef}
                          audio={false}
                          mirrored={true}
                          screenshotFormat="image/jpeg"
                          className="w-full h-full object-cover"
                          videoConstraints={{ facingMode: "user" }}
                          onLoadedMetadata={() => {
                            setTimeout(() => {
                              if (containerRef.current && webcamRef.current?.video) {
                                const container = containerRef.current.getBoundingClientRect();
                                const video = webcamRef.current.video;
                                setBoxScale({
                                  x: container.width / video.videoWidth,
                                  y: container.height / video.videoHeight,
                                });
                              }
                            }, 500);
                          }}
                        />

                        {result?.facial_area && <div style={getBoxStyle(result.facial_area)} />}
                        {result?.multiple_faces?.map((face, i) => (
                          <div key={i} style={getBoxStyle(face)} />
                        ))}

                        {!result?.facial_area && !result?.multiple_faces && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-green-700">
                            {/* Camera active but no faces detected */}
                          </div>
                        )}
                      </>
                    ) : authError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                        <Users className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium text-gray-500">Access Required</p>
                        <p className="text-sm text-gray-400 mt-1">Please access through company dashboard</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <Camera className="h-10 w-10 mb-2" />
                        <p className="text-lg font-medium">Camera Preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Alert for unknown faces */}
              {showAlert && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 text-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-.01-8a9 9 0 100 18 9 9 0 000-18z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800">Unknown Face Detected</p>
                    <p className="text-sm text-yellow-700">An unregistered face was detected.</p>
                  </div>
                </div>
              )}

              {/* Camera Controls */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={startCamera}
                  disabled={isRunning || authError}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4" />
                  Start Camera
                </button>

                <button
                  onClick={stopCamera}
                  disabled={!isRunning}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-4 h-4" />
                  Stop Camera
                </button>
              </div>

              {countdown && (
                <div className="text-center mt-4 text-gray-600 text-sm font-medium">
                  PPE Detection will start in {countdown}...
                </div>
              )}
            </div>
          </div>

          {/* Right Side Panels */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Network</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Online</span>
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Sun className="w-4 h-4 text-green-500" />
                    <span>Lighting</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Good</span>
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Camera</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Ready</span>
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>Faces</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{faceCount}</span>
                </div>
              </div>

              {/* Multiple Faces Detected Alert */}
              {showMultipleFacesAlert && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-800 text-sm mb-1">
                        Multiple faces detected ({result?.multiple_faces?.length || 2})
                      </p>
                      <p className="text-xs text-blue-700">
                        Please ensure only one person is in the camera frame for accurate recognition.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <span className="text-sm font-medium text-gray-900">Face Recognition</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isRunning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isRunning ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Check In:</span>
                  <span className="text-sm font-medium text-gray-900">{checkInTime}</span>
                </div>
              </div>
            </div>

            {/* Detected Person */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Detected Person</h3>
              </div>

              {result?.status === "Identified" ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex flex-col items-start justify-center space-y-1">
                  <p className="font-semibold text-gray-900">{result.name || "Unknown"}</p>
                  <p className="text-xs text-gray-600">Role: Employee</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              ) : authError ? (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-600 text-center py-2">
                    Authentication Required
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 text-center py-6">
                    No employee marked present
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}