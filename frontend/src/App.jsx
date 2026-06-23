import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [patientName, setPatientName] = useState("John Doe")
  const [patientAge, setPatientAge] = useState("45")
  const [patientGender, setPatientGender] = useState("M")


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {}
        <div className="w-1/2 relative flex items-center justify-center overflow-hidden">
          {}
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2000&auto=format&fit=crop" 
            alt="Doctors analyzing medical data" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* The Dim/Dark Blue Overlay so the text is readable */}
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-[2px]"></div>
          
          {}
          <div className="relative z-10 text-center text-white px-12 border border-white/10 bg-white/5 p-12 rounded-3xl backdrop-blur-md shadow-2xl">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">CXR-MultiQuant</h1>
            <p className="text-xl text-blue-100 font-light">Intelligent AI Assistance for Clinical Triage</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-white relative">
          
          {/* Enterprise Feature: System Status Indicator */}
          <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">PACS Server Connected</span>
          </div>

          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Sign in to access your unified clinical inbox</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor ID / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="doctor@hospital.org" />
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
                  <input type="password" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />
                  I agree to Patient Data Privacy terms
                </label>
              </div>
              
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg mt-4">
                Secure Sign In
              </button>

              {/* Enterprise Feature: SSO Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Enterprise Feature: SSO Button */}
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Log in with Hospital Portal
              </button>
            </div>

            {/* Enterprise Feature: HIPAA Badge */}
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

  // Screen 2: Light Mode Medical Dashboard
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
          
          {/* Left Column: Live Metrics & Patient List */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Patient Demographics Card */}
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

            {/* Patients Queue */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] border border-gray-100">
              <h3 className="text-gray-900 font-bold mb-4 text-lg">Scan Queue</h3>
              <div className="space-y-3">
                <div className="bg-blue-600 p-4 rounded-2xl cursor-pointer text-white shadow-lg shadow-blue-600/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">JD</div>
                    <div>
                      <p className="font-semibold text-sm">John Doe</p>
                      <p className="text-blue-100 text-xs mt-0.5">Suspected Pneumonia</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">AS</div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Alice Smith</p>
                      <p className="text-gray-500 text-xs mt-0.5">Routine Scan</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">RJ</div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Robert Jones</p>
                      <p className="text-gray-500 text-xs mt-0.5">Effusion Checkup</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
              </div>
            </div>

          </div>

          {/* Center Column: The Visual Scan */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-[0_4px_25px_-5px_rgba(6,81,237,0.08)] border border-gray-100 h-full overflow-hidden flex flex-col relative">
              <div className="p-5 flex justify-between items-center bg-white z-10">
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm">X-Ray Scan</button>
                  <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-full text-sm font-medium transition-colors">AI Report</button>
                  <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-full text-sm font-medium transition-colors">Patient History</button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg></button>
                </div>
              </div>
              
              <div className="flex-grow bg-[#f8fafc] flex flex-col items-center justify-center relative p-8 m-2 rounded-2xl border border-gray-100 overflow-hidden">
                
                {/* NEW: Patient Intake Form */}
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
                </div>

                {/* Image Placeholder - Awaiting User Upload */}
                <div className="w-full flex flex-col items-center justify-center text-center max-w-lg z-10 relative">
                  <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-blue-200 shadow-sm w-full hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Chest X-Ray</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Drag and drop your radiology image here to replace this box and run analysis.</p>
                  </div>
                </div>

                {/* Floating AI Diagnostic Bubble */}
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 max-w-xs z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Awaiting Scan</p>
                  </div>
                  <p className="text-gray-500 text-sm flex items-center justify-between">
                    Severity Assessment <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Action */}
          <div className="xl:col-span-1 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-900 font-bold text-lg">AI Programs</h3>
                <button className="p-1.5 bg-gray-50 rounded-lg text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg></button>
              </div>
              
              <div className="space-y-4">
                
                {/* Pill 1 */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Clinical Notes</p>
                      <p className="text-xs text-gray-500 mt-0.5">Read Radiologist text</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>

                {/* Pill 2 */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-teal-300 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Feature Extraction</p>
                      <p className="text-xs text-gray-500 mt-0.5">Scan pixel densities</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>

                {/* Prediction Bar */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-800 mb-4">Severity Output</p>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden flex">
                    <div className="bg-green-400 h-full w-[15%]"></div>
                    <div className="bg-blue-500 h-full w-[75%] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    <div className="bg-red-400 h-full w-[10%]"></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-400">Mild</span>
                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Moderate 75%</span>
                    <span className="text-gray-400">Severe</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#111827] hover:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex justify-center items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Run Full Analysis
            </button>
            
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
