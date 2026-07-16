import { useState } from 'react'

const MOCK_PATIENTS = [
  {
    id: "JD",
    name: "John Doe",
    age: "45",
    gender: "M",
    reason: "Suspected Pneumonia",
    history: [
      { date: "Oct 2025", event: "Routine Checkup", notes: "Patient reported mild cough. Prescribed rest." },
      { date: "Jan 2026", event: "Follow-up", notes: "Cough persisted. Ordered preliminary blood tests." }
    ]
  },
  {
    id: "AS",
    name: "Alice Smith",
    age: "32",
    gender: "F",
    reason: "Routine Scan",
    history: [
      { date: "Mar 2024", event: "Annual Physical", notes: "All vitals normal." },
      { date: "Dec 2025", event: "Vaccination", notes: "Administered flu shot." }
    ]
  },
  {
    id: "RJ",
    name: "Robert Jones",
    age: "58",
    gender: "M",
    reason: "Effusion Checkup",
    history: [
      { date: "Nov 2023", event: "Cardiac Evaluation", notes: "Mild palpitations. ECG normal." },
      { date: "May 2025", event: "Pulmonary Scan", notes: "Detected minor fluid buildup. Monitoring." }
    ]
  }
];


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  
  const [patientName, setPatientName] = useState("John Doe")
  const [patientAge, setPatientAge] = useState("45")
  const [patientGender, setPatientGender] = useState("M")
  const [clinicalText, setClinicalText] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [activeTab, setActiveTab] = useState("scan")
  const [activePatientId, setActivePatientId] = useState("JD")
  const [realPatients, setRealPatients] = useState([])

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchDashboardData = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Transform the backend DashboardData objects into the frontend patient format
        const formatted = data.map(item => ({
          id: `DB-${item.id}`,
          name: item.patient_name || "Unknown Patient",
          age: item.patient_age ? String(item.patient_age) : "N/A",
          gender: item.patient_gender || "U",
          reason: `Severity: ${item.severity}`,
          history: [
            { date: new Date(item.created_at).toLocaleDateString(), event: "AI Scan", notes: item.clinical_notes || "No notes." }
          ]
        }));
        setRealPatients(formatted);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoginError("");
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        setIsLoggedIn(true);
        fetchDashboardData(data.access_token);
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("Failed to connect to backend");
    }
  };

  const handleSignUp = async () => {
    try {
      setLoginError("");
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        setIsLoggedIn(true);
        fetchDashboardData(data.access_token);
      } else {
        const errData = await response.json();
        setLoginError(errData.detail || "Failed to register");
      }
    } catch (error) {
      setLoginError("Failed to connect to backend");
    }
  };

  const handlePatientClick = (patient) => {
    setActivePatientId(patient.id);
    setPatientName(patient.name);
    setPatientAge(patient.age);
    setPatientGender(patient.gender);
    setClinicalText("");
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPrediction(null); // Reset previous prediction
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) {
      alert("Please upload a Chest X-Ray image first!");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("report", clinicalText || "No clinical notes provided.");
      formData.append("patient_name", patientName);
      formData.append("patient_age", patientAge);
      formData.append("patient_gender", patientGender);
      
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      
      const data = await response.json();
      setPrediction(data.prediction);
      
      // Refresh the queue to show the newly saved patient
      fetchDashboardData(token);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to connect to the Python Backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Login Page */}
        <div className="w-1/2 relative flex items-end justify-center pb-32 overflow-hidden">
          {}
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop" 
            alt="Doctors analyzing medical data" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
                    <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-[2px]"></div>
          
          {}
          <div className="relative z-10 text-center text-white px-12 border border-white/10 bg-white/5 p-12 rounded-3xl backdrop-blur-md shadow-2xl">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">CXR-MultiQuant</h1>
            <p className="text-xl text-blue-100 font-light">Intelligent AI Assistance for Clinical Triage</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-white relative">
          
                    <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">PACS Server Connected</span>
          </div>

          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{isSignUpMode ? "Create an Account" : "Welcome Back"}</h2>
            <p className="text-gray-500 mb-4">{isSignUpMode ? "Sign up to start analyzing chest X-rays" : "Sign in to access your unified clinical inbox"}</p>
            
            {!isSignUpMode && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm">
                <p className="font-bold text-blue-900 mb-1">Demo Credentials:</p>
                <p className="text-blue-800"><strong>Email:</strong> admin@hospital.org</p>
                <p className="text-blue-800"><strong>Password:</strong> securepassword123</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor ID / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                    placeholder="doctor@hospital.org" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />
                  I agree to Patient Data Privacy terms
                </label>
              </div>
              
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              
              <button 
                onClick={isSignUpMode ? handleSignUp : handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-4">
                {isSignUpMode ? "Create Account" : "Secure Sign In"}
              </button>

              <div className="text-center mt-4">
                <button 
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setLoginError("");
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  {isSignUpMode ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                </button>
              </div>

                            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

                            <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Log in with Hospital Portal
              </button>
            </div>

                        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <span className="text-xs font-bold uppercase tracking-wider">HIPAA Compliant System</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">End-to-End Encrypted • Authorized Clinical Personnel Only</p>
            </div>

          </div>
        </div>
      </div>
    )
  }

  {/* Main Dashboard */}
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans pb-10">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CXR-<span className="text-blue-600">MultiQuant</span></h1>
        </div>
        
        <div className="flex gap-6 text-gray-500 font-medium">
          <button className="text-blue-600 bg-blue-50 px-5 py-2 rounded-full border border-blue-100">Dashboard</button>
          <button className="hover:text-gray-900 px-4 py-2 transition-colors">Patients</button>
          <button className="hover:text-gray-900 px-4 py-2 transition-colors">Records</button>
        </div>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
          Log Out
        </button>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Patient Data */}
          <div className="xl:col-span-1 space-y-6">
            
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] border border-gray-100">
              <h3 className="text-gray-900 font-bold mb-4 flex justify-between items-center text-lg">
                Active Patient
                <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </h3>
              
              <div className="space-y-3">
                <div className="bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100/50 flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Name</span>
                  <span className="text-base font-bold text-gray-900">{patientName || "—"}</span>
                </div>
                <div className="flex gap-3">
                  <div className="bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100/50 flex-1 flex flex-col justify-center items-center">
                    <span className="text-xs text-gray-500 font-medium mb-1">Age</span>
                    <span className="text-xl font-bold text-gray-900">{patientAge || "—"} <span className="text-xs font-normal text-gray-500">Yrs</span></span>
                  </div>
                  <div className="bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100/50 flex-1 flex flex-col justify-center items-center">
                    <span className="text-xs text-gray-500 font-medium mb-1">Gender</span>
                    <span className="text-xl font-bold text-gray-900 text-blue-600">{patientGender || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan Queue */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] border border-gray-100">
              <h3 className="text-gray-900 font-bold mb-4 text-lg">Scan Queue</h3>
              <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
                {[...realPatients, ...MOCK_PATIENTS].map((p) => {
                  const isActive = p.id === activePatientId;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => handlePatientClick(p)}
                      className={`${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border border-gray-100 hover:border-gray-300 hover:bg-gray-50'} p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                          {p.id}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isActive ? '' : 'text-gray-800'}`}>{p.name}</p>
                          <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>{p.reason}</p>
                        </div>
                      </div>
                      {!isActive && <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Main Visuals */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-[0_4px_25px_-5px_rgba(6,81,237,0.08)] border border-gray-100 h-full overflow-hidden flex flex-col relative">
              <div className="p-5 flex justify-between items-center bg-white z-10">
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('scan')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'scan' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>X-Ray Scan</button>
                  <button onClick={() => setActiveTab('report')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'report' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>AI Report</button>
                  <button onClick={() => setActiveTab('history')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Patient History</button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg></button>
                </div>
              </div>
              
              <div className="flex-grow bg-[#f8fafc] flex flex-col items-center justify-center relative p-8 m-2 rounded-2xl border border-gray-100 overflow-hidden overflow-y-auto">
                
                {activeTab === 'scan' && (
                  <>
                    {/* Intake Form */}
                    <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 z-10 relative">
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Patient Intake Form</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                            placeholder="e.g. John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                          <input 
                            type="number" 
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                            placeholder="e.g. 45"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                          <select 
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium appearance-none">
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* NLP Text Input */}
                      <div className="mt-5">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Clinical Notes (Radiologist Report)</label>
                        <textarea 
                          value={clinicalText}
                          onChange={(e) => setClinicalText(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium resize-none" 
                          rows="3"
                          placeholder="Paste radiologist findings here for NLP analysis..."
                        ></textarea>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="w-full flex flex-col items-center justify-center text-center max-w-lg z-10 relative">
                      <label className="bg-white p-12 rounded-3xl border-2 border-dashed border-blue-200 shadow-sm w-full hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative overflow-hidden group">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        
                        {imagePreview ? (
                          <div className="absolute inset-0 w-full h-full p-2">
                            <img src={imagePreview} alt="X-Ray Preview" className="w-full h-full object-contain rounded-2xl" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                              <p className="text-white font-bold">Click to change image</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Chest X-Ray</h3>
                            <p className="text-gray-500 max-w-xs mx-auto text-sm">Click to select your radiology image here to run analysis.</p>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 max-w-xs z-20">
                      <div className="flex items-center gap-2 mb-2">
                        {isAnalyzing ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping"></div>
                        ) : prediction ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        )}
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          {isAnalyzing ? "Analyzing..." : prediction ? "Scan Complete" : "Awaiting Scan"}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm flex items-center justify-between">
                        Severity Assessment <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </p>
                    </div>
                  </>
                )}

                {activeTab === 'report' && (
                  <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Diagnostic Report</h2>
                        <p className="text-gray-500 text-sm mt-1">Generated by CXR-MultiQuant Engine</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Patient: {patientName}</p>
                      </div>
                    </div>
                    
                    {prediction ? (
                      <div className="space-y-6">
                        <div className={`p-4 rounded-xl border ${prediction.severity === 'Severe' ? 'bg-red-50 border-red-200' : prediction.severity === 'Moderate' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                          <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${prediction.severity === 'Severe' ? 'text-red-800' : prediction.severity === 'Moderate' ? 'text-blue-800' : 'text-green-800'}`}>Primary Finding</h3>
                          <p className="text-lg font-medium text-gray-900">
                            The multimodal model has assessed this scan as <span className="font-bold">{prediction.severity}</span> with a confidence of {Math.round(prediction.probabilities[prediction.severity] * 100)}%.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-100 pb-1">Radiologist Input Provided</h4>
                          <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                            "{clinicalText || "No clinical notes provided."}"
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-100 pb-1">Model Synthesis</h4>
                          <p className="text-gray-600">
                            The DenseNet Vision model analyzed the pixel densities of the provided radiograph, while the ClinicalBERT language model parsed the associated clinical notes. 
                            The co-attention layer fused these representations, leading to the final classification of {prediction.severity}. 
                            Clinical correlation is required.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p className="text-lg font-medium text-gray-600">No report generated yet.</p>
                        <p className="text-sm">Upload an image and run the analysis to generate a report.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Patient Medical History</h2>
                    <div className="relative border-l-2 border-blue-100 ml-4 space-y-8 pb-8">
                      {[...realPatients, ...MOCK_PATIENTS].find(p => p.id === activePatientId)?.history.map((record, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-blue-600 mb-1">{record.date}</p>
                          <h4 className="text-lg font-bold text-gray-900">{record.event}</h4>
                          <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">{record.notes}</p>
                        </div>
                      ))}
                      <div className="relative pl-6 opacity-50">
                        <div className="absolute w-4 h-4 bg-gray-300 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                        <p className="text-sm font-bold text-gray-400 mb-1">Prior to 2023</p>
                        <h4 className="text-lg font-bold text-gray-500">No records available</h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="xl:col-span-1 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg">AI Programs</h3>
                <button className="p-1.5 bg-gray-50 rounded-lg text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg></button>
              </div>
              
              <div className="space-y-4">
                
                                <div className={`bg-white p-4 rounded-2xl border ${prediction ? 'border-green-300' : 'border-gray-100'} shadow-sm flex items-center justify-between transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className={`${prediction ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'} p-2.5 rounded-xl transition-colors`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Clinical Notes</p>
                      <p className="text-xs text-gray-500 mt-0.5">Read Radiologist text</p>
                    </div>
                  </div>
                  {prediction && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                </div>

                                <div className={`bg-white p-4 rounded-2xl border ${prediction ? 'border-green-300' : 'border-gray-100'} shadow-sm flex items-center justify-between transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div className={`${prediction ? 'bg-green-50 text-green-600' : 'bg-teal-50 text-teal-600'} p-2.5 rounded-xl transition-colors`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Feature Extraction</p>
                      <p className="text-xs text-gray-500 mt-0.5">Scan pixel densities</p>
                    </div>
                  </div>
                  {prediction && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-800 mb-4">Severity Output</p>
                  
                  {prediction ? (
                    <>
                      <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden flex">
                        <div className="bg-green-400 h-full transition-all duration-1000" style={{ width: `${prediction.probabilities.Mild * 100}%` }}></div>
                        <div className="bg-blue-500 h-full shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-1000" style={{ width: `${prediction.probabilities.Moderate * 100}%` }}></div>
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${prediction.probabilities.Severe * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">Mild ({Math.round(prediction.probabilities.Mild * 100)}%)</span>
                        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          Moderate ({Math.round(prediction.probabilities.Moderate * 100)}%) 
                          <span className="text-blue-800 ml-2">Result: {prediction.severity}</span>
                        </span>
                        <span className="text-gray-400">Severe ({Math.round(prediction.probabilities.Severe * 100)}%)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden flex">
                        <div className="bg-gray-200 h-full w-full"></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-gray-400">Mild</span>
                        <span className="text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded">Awaiting Data</span>
                        <span className="text-gray-400">Severe</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full ${isAnalyzing ? 'bg-gray-500' : 'bg-[#111827] hover:bg-gray-800'} text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex justify-center items-center gap-2`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Processing Multimodal Data...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Run Full Analysis
                </>
              )}
            </button>
            
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
