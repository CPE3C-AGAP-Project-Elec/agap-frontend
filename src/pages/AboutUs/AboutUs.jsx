import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import philippinesMapBg from '../../assets/philippines-hero-relief.png';
import './AboutUs.css';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-[#2B5F8E] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-[#2B5F8E] p-1.5">
              <img src={logoImage} alt="AGAP" className="w-full h-full object-contain" width={48} height={48} />
            </div>
            <div className="hidden lg:block">
              <span className="text-xs font-semibold tracking-wider leading-tight">
                AUTOMATED GEOSPATIAL<br />ALERT PLATFORM
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => navigate('/')}
              className="text-sm hover:text-gray-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm hover:text-gray-200 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('donate')}
              className="text-sm hover:text-gray-200 transition-colors"
            >
              Donate
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm hover:text-gray-200 transition-colors"
            >
              Contact
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search size={20} />
            </button>
          </div>
 
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#234d73] border-t border-white/20">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm hover:text-gray-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm hover:text-gray-200 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('donate')}
              className="block w-full text-left py-2 text-sm hover:text-gray-200 transition-colors"
            >
              Donate
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm hover:text-gray-200 transition-colors"
            >
              Contact
            </button>
          </div> 
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative h-[350px] md:h-[450px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={philippinesMapBg}
          alt="Topographic map of the Philippines"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4 flex flex-col items-center gap-5 md:gap-6">
          <img
            src={logoImage}
            alt="AGAP logo"
            className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_4px_28px_rgba(0,0,0,0.5)]"
            width={128}
            height={128}
          />
          <h1 className="text-5xl md:text-7xl tracking-wide drop-shadow-md">About Us</h1>
        </div>
      </div>
    </section>
  );
}

function AboutContent() {
  return (
    <section id="about" className="py-16 md:py-20 bg-[#F5F5F5]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="space-y-6 text-gray-800">
          <p className="leading-relaxed text-base">
            AGAP (Automated Geospatial Alert Platform) is a web-based tool that was
            developed for communities and government agencies. These institutions can
            significantly improve operations with the help of geospatial technology.
            We provide real-time monitoring of changes in land use, forests, and
            vegetation with our alerts, location-based mapping, and risk analysis; thus
            allows users to respond swiftly to environment shifts and help enhance
            decision-making and operations.
          </p>

          <p className="leading-relaxed text-base">
            Our platform integrates with satellite data and geographic Information
            systems, and data visualization to original unify widespread data. Besides,
            AGAP supports organizations in risk assessment and resource management.
          </p>

          <p className="leading-relaxed text-base">
            We decided to make and were prompted community by empowering
            governments and organizations to use geo-technology in their operations,
            enabling immediate responses and informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

function TeamMembers() {
  const teamMembers = [
    {
      id: 1,
      name: 'MEMBER 1',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'MEMBER 1',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'MEMBER 1',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'MEMBER 1',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'MEMBER 1',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    }
  ];

  const handleMeetOurTeam = () => {
    // This button will work when team page is connected
    console.log('Navigate to team page');
  };

  return (
    <section id="team" className="py-16 md:py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <button
            onClick={handleMeetOurTeam}
            className="bg-[#2B5F8E] text-white text-sm tracking-wider px-10 py-3 rounded-full hover:bg-[#234d73] transition-colors mb-6 inline-block"
          >
            MEET OUR
          </button>
          <h2 className="text-4xl md:text-5xl text-[#8B1C1C] tracking-wide">
            Team Members
          </h2>
        </div>

        {/* Team Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {teamMembers.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-64"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-[#1E73BE] text-sm tracking-wider">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[580px]">
            {teamMembers.slice(3, 5).map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-64 mx-auto"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-[#1E73BE] text-sm tracking-wider">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#2B5F8E] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
          {/* Logo and Platform Name */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <img src={logoImage} alt="AGAP" className="w-full h-full object-contain" width={80} height={80} />
            </div>
            <div className="pt-2">
              <h3 className="text-xs tracking-wider leading-tight">
                AUTOMATED GEOSPATIAL<br />ALERT PLATFORM
              </h3>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-2xl mb-4 tracking-wide">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                <a
                  href="mailto:agap.systemtoolkit@gmail.com"
                  className="hover:text-gray-200 transition-colors"
                >
                  agap.systemtoolkit@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{' '}
                <a
                  href="tel:+639XXXXXXXXX"
                  className="hover:text-gray-200 transition-colors"
                >
                  +63 9XX XXX XXXX (optional)
                </a>
              </p>
              <p>
                <span className="font-semibold">Location:</span> Butuan City, Agusan del Norte
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-xs">Copyright © 2025 AGAP All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default function AboutUs() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  return (
    <div className="about-us-page min-h-screen bg-[#F5F5F5]">
      <Navigation />
      <HeroSection />
      <AboutContent />
      <TeamMembers />
      <Footer />
    </div>
  );
}
