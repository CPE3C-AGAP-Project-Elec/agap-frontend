import heroImage from "../../assets/hero.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f5f5f7] px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-[#2563eb] rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-5 md:h-5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-[#1e293b] hover:text-[#2563eb] transition-colors">Home</a>
              <a href="#" className="text-[#1e293b] hover:text-[#2563eb] transition-colors">About Us</a>
              <a href="#" className="text-[#1e293b] hover:text-[#2563eb] transition-colors">Contact</a>
            </nav>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button className="text-[#1e293b] hover:text-[#2563eb] transition-colors px-3 md:px-4 py-2 text-sm md:text-base">
              Login
            </button>
            <button className="border-2 border-[#1e293b] text-[#1e293b] hover:bg-[#1e293b] hover:text-white transition-colors px-3 md:px-4 py-2 rounded text-sm md:text-base">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 bg-[#f5f5f7] flex flex-col">
        <div className="max-w-5xl mx-auto text-center px-6 pt-12 md:pt-16 pb-6 md:pb-8">
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
            <span className="text-[#1e293b]">Stay ahead of floods.</span>
            <br />
            <span className="text-[#1e293b]">Stay safe with </span>
            <span className="text-[#2563eb]">AGAP</span>
            <span className="text-[#1e293b]">.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-[#1e293b] text-base md:text-lg">
            Get <span className="text-[#2563eb]">real-time flood risk</span> updates and
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-[#2563eb]">make smarter decisions</span> for your safety.
          </p>
        </div>
        
        {/* Hero Image - Full Width, Larger Size */}
        <div className="w-full flex-1 min-h-[300px] md:min-h-[400px]">
          <img 
            src={heroImage} 
            alt="AGAP - Flood Monitoring System" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e5a9e] text-white px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#1e5a9e"/>
                  <path d="M2 17L12 22L22 17" stroke="#1e5a9e" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="#1e5a9e" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm">AGAP</div>
                <div className="text-xs">AUTOMATED GEOSPATIAL</div>
                <div className="text-xs">ALERT PLATFORM</div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Contact Us</h3>
              <div className="text-xs md:text-sm space-y-1">
                <p><span className="font-semibold">Email:</span> agap.system@gmail.com</p>
                <p><span className="font-semibold">Phone:</span> +63 XXX XXX XXXX (optional)</p>
                <p><span className="font-semibold">Location:</span> Bulacao, Philippines</p>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-xs pt-4 border-t border-white/20">
            Copyright © 2025 Agap All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}