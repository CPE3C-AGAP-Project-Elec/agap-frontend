import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getWeatherAndFloodData } from "../../utils/weatherUtils";
import { getCurrentLocation, getLocationName } from "../../utils/geolocation";
import FloodRiskWidget from "../../components/FloodRiskWidget/FloodRiskWidget";
import {
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Cloud,
  CloudRain,
  Navigation,
  MapPin,
  AlertCircle,
  LogOut,
} from "lucide-react";
import GoogleMapView from "../../components/Googlemapview/GoogleMapView.jsx";
import logoImage from "../../assets/logo.png";
import { logout, isAuthenticated } from "../../services/auth";
import "./Result.css";

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIG9wYWNpdHk9Ii4zIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMuNyI+PHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHJ4PSI2Ii8+PHBhdGggZD0ibTE2IDU4IDE2LTE4IDMyIDMyIi8+PGNpcmNsZSBjeD0iNTMiIGN5PSIzNSIgcj0iNyIvPjwvc3ZnPgoKCg==';

function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const handleError = () => setDidError(true);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div className={`result-imgfb ${className ?? ''}`} style={style}>
      <div className="result-imgfb__inner">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}

function Header({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = isAuthenticated();
  const profileRoute = isLoggedIn ? '/profile' : '/login';
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="result-header about-nav text-white shadow-md sticky top-0 z-50">
      <div className="about-nav__inner app-nav-inner">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="app-nav-logo-box shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-[#2B5F8E] p-1.5"
            onClick={closeMenu}
          >
            <ImageWithFallback src={logoImage} alt="AGAP logo" className="result-header__logo h-full w-full object-contain" />
          </Link>
          <div className="hidden lg:grid app-nav-brand text-white">
            <p>AUTOMATED GEOSPATIAL</p>
            <p>ALERT PLATFORM</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="app-nav-link text-white">Home</Link>
            <Link to="/about-us" className="app-nav-link text-white">About Us</Link>
            <Link to="/" state={{ scrollToLandingContact: true }} className="app-nav-link text-white">Contact</Link>
          </div>
          
          {/* Logout Button - Only show if logged in */}
          {isLoggedIn && (
            <button 
              onClick={handleLogoutClick} 
              className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
              aria-label="Logout"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          )}
          
          <Link to={profileRoute} className="app-profile-link app-profile-link--on-dark p-2 md:p-3" aria-label="Profile">
            <User size={20} aria-hidden />
          </Link>
          <button type="button" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#234d73] border-t border-white/20">
          <div className="px-4 py-3 space-y-3">
            <Link to="/" className="app-nav-link block w-full text-left py-2 text-white" onClick={closeMenu}>Home</Link>
            <Link to="/about-us" className="app-nav-link block w-full text-left py-2 text-white" onClick={closeMenu}>About Us</Link>
            <Link to="/" state={{ scrollToLandingContact: true }} className="app-nav-link block w-full text-left py-2 text-white" onClick={closeMenu}>Contact</Link>
            {isLoggedIn && (
              <button 
                onClick={() => { handleLogoutClick(); closeMenu(); }} 
                className="app-nav-link block w-full text-left py-2 text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function SearchBar({ value, onChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };
  return (
    <form onSubmit={handleSubmit} className="result-search">
      <div className="result-search__row">
        <Search aria-hidden />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search location..." className="result-search__input" />
        <button type="submit" className="result-search__submit">Search</button>
      </div>
    </form>
  );
}

function FloodHazardLevel({ level }) {
  const levels = [
    { id: 'low', label: 'LOW CHANCE OF FLOOD' },
    { id: 'medium', label: 'MEDIUM CHANCE OF FLOOD' },
    { id: 'high', label: 'HIGH CHANCE OF FLOOD' },
  ];
  return (
    <div className="result-hazard">
      {levels.map((lvl) => {
        const isActive = level === lvl.id;
        return (
          <div key={lvl.id} className={`result-hazard__row result-hazard__row--${lvl.id}${isActive ? ' is-active' : ''}`}>
            <div className="result-hazard__swatch" aria-label={`${lvl.id} warning symbol`}>
              <span className={`result-warning-triangle result-warning-triangle--${lvl.id}`} aria-hidden>
                <span className="result-warning-triangle__mark">!</span>
              </span>
            </div>
            <span>{lvl.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function FloodForecast({ data, loading, error }) {
  const floodLevelMeta = {
    low: { label: 'Low', value: 1, colorVar: '--result-hazard-low' },
    medium: { label: 'Medium', value: 2, colorVar: '--result-hazard-medium' },
    high: { label: 'High', value: 3, colorVar: '--result-hazard-high' },
  };

  if (loading) return <div className="result-placeholder"><p>Loading flood forecast...</p></div>;
  if (error) return <div className="result-placeholder"><p style={{ color: '#dc143c' }}>Error: {error}</p></div>;
  if (!data?.length) return <div className="result-placeholder"><p>No flood forecast data available.</p></div>;

  return (
    <div className="result-weather-chart">
      <div className="result-weather-chart__plot">
        <div className="result-weather-chart__y-axis">
          <span>High</span><span>Medium</span><span>Low</span>
        </div>
        <div className="result-weather-chart__bars">
          {data.map((item) => {
            const levelMeta = floodLevelMeta[item.level] ?? floodLevelMeta.low;
            const barHeight = `${(levelMeta.value / 3) * 100}%`;
            return (
              <div key={`${item.date}-${item.level}`} className="result-weather-chart__col">
                <div className="result-weather-chart__bar-wrap">
                  <div className="result-weather-chart__bar" style={{ height: barHeight, backgroundColor: `var(${levelMeta.colorVar})` }}>
                    <span className={`result-warning-triangle result-warning-triangle--${item.level}`} aria-hidden>
                      <span className="result-warning-triangle__mark">!</span>
                    </span>
                  </div>
                </div>
                <span className="result-weather-chart__date">{item.date}</span>
                {item.rainfall && <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{item.rainfall}mm</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="result-weather-chart__legend">
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--low">Low</span>
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--medium">Medium</span>
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--high">High</span>
      </div>
    </div>
  );
}

function WeatherForecast({ data, loading, error }) {
  const getWeatherIcon = (weatherMain, iconCode, description) => {
    if (iconCode) {
      return <img src={`https://openweathermap.org/img/w/${iconCode}.png`} alt={description || weatherMain} className="result-weather__icon" />;
    }
    const condition = (weatherMain + ' ' + (description || '')).toLowerCase();
    if (condition.includes('clear')) return <Sun className="result-weather__icon result-weather__icon--sun" aria-hidden />;
    if (condition.includes('cloud')) return <Cloud className="result-weather__icon result-weather__icon--cloud" aria-hidden />;
    if (condition.includes('rain')) return <CloudRain className="result-weather__icon result-weather__icon--rain" aria-hidden />;
    return <Sun className="result-weather__icon result-weather__icon--sun" aria-hidden />;
  };

  if (loading) return <div className="result-placeholder"><p>Loading weather forecast...</p></div>;
  if (error) return <div className="result-placeholder"><p style={{ color: '#dc143c' }}>Error: {error}</p></div>;
  if (!data?.length) return <div className="result-placeholder"><p>No weather forecast available.</p></div>;

  return (
    <div className="result-weather">
      {data.map((weather, index) => (
        <div key={index} className="result-weather__card">
          <div className="result-weather__date"><strong>{weather.date}</strong></div>
          <div className="result-weather__meta">
            <div style={{ textAlign: 'right' }}>
              <div>{weather.temp}°C</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{weather.description || weather.condition}</div>
            </div>
            {getWeatherIcon(weather.condition, weather.icon, weather.description)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({ latitude, longitude, locationName, floodRiskLevel }) {
  return (
    <div className="result-map">
      <GoogleMapView latitude={latitude} longitude={longitude} locationName={locationName} floodRiskLevel={floodRiskLevel} />
    </div>
  );
}

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const welcomeSearchHandledKey = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFloodHazardOpen, setShowFloodHazardOpen] = useState(true);
  const [showFloodForecast, setShowFloodForecast] = useState(false);
  const [showWeatherForecast, setShowWeatherForecast] = useState(false);
  const [floodLevel, setFloodLevel] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [floodForecastData, setFloodForecastData] = useState([]);
  const [floodForecastLoading, setFloodForecastLoading] = useState(false);
  const [floodForecastError, setFloodForecastError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleFloodHazard = () => {
    setShowFloodForecast(false);
    setShowWeatherForecast(false);
    setShowFloodHazardOpen((prev) => !prev);
  };
  const toggleFloodForecast = () => {
    setShowFloodHazardOpen(false);
    setShowWeatherForecast(false);
    setShowFloodForecast((prev) => !prev);
  };
  const toggleWeatherForecast = () => {
    setShowFloodHazardOpen(false);
    setShowFloodForecast(false);
    setShowWeatherForecast((prev) => !prev);
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked - showing modal");
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log("Logout confirmed");
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    console.log("Logout cancelled");
    setShowLogoutModal(false);
  };

  const fetchWeatherAndFloodData = useCallback(async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError(null);
    setFloodForecastLoading(true);
    setFloodForecastError(null);
    try {
      const data = await getWeatherAndFloodData(lat, lon, USE_MOCK_DATA);
      setWeatherData(data.weather);
      setFloodForecastData(data.floodHistory);
      setFloodLevel(data.floodRisk);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError(error.message);
      setFloodForecastError(error.message);
      try {
        const mockData = await getWeatherAndFloodData(lat, lon, true);
        setWeatherData(mockData.weather);
        setFloodForecastData(mockData.floodHistory);
        setFloodLevel(mockData.floodRisk);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setWeatherLoading(false);
      setFloodForecastLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (rawQuery) => {
    const q = String(rawQuery ?? '').trim();
    if (!q) return;
    setSearchQuery(q);
    setShowFloodHazardOpen(true);
    setShowFloodForecast(false);
    setShowWeatherForecast(false);
    setLocationError(null);
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=ph&format=json&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const coords = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        setCoordinates(coords);
        await fetchWeatherAndFloodData(coords.latitude, coords.longitude);
      } else {
        setCoordinates(null);
        setFloodLevel(null);
        setLocationError('not_found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setCoordinates(null);
      setFloodLevel(null);
      setLocationError('api_error');
    } finally {
      setIsSearching(false);
    }
  }, [fetchWeatherAndFloodData]);

  const performSearchWithCoords = useCallback(async (lat, lon, locationName) => {
    setSearchQuery(locationName);
    setShowFloodHazardOpen(true);
    setShowFloodForecast(false);
    setShowWeatherForecast(false);
    setLocationError(null);
    setIsSearching(true);

    try {
      const coords = {
        latitude: lat,
        longitude: lon,
      };
      setCoordinates(coords);
      await fetchWeatherAndFloodData(coords.latitude, coords.longitude);
    } catch (error) {
      console.error('Error fetching data for location:', error);
      setLocationError('Failed to load data for your location');
    } finally {
      setIsSearching(false);
    }
  }, [fetchWeatherAndFloodData]);

  const handleUseMyLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const coords = await getCurrentLocation();
      console.log('Got coordinates:', coords);
      
      const locationInfo = await getLocationName(coords.lat, coords.lon);
      console.log('Location name:', locationInfo);
      
      const locationQuery = locationInfo.city || locationInfo.name || 'Current Location';
      await performSearchWithCoords(coords.lat, coords.lon, locationQuery);
      
    } catch (err) {
      console.error('Location error:', err);
      setLocationError(err.message);
      setTimeout(() => setLocationError(null), 5000);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleRetry = () => { if (searchQuery) performSearch(searchQuery); };
  const handleNewSearch = () => navigate('/welcome');
  const handleGoHome = () => navigate('/');

  useEffect(() => {
    const q = location.state?.welcomeSearchQuery;
    if (!q || !String(q).trim()) return;
    if (welcomeSearchHandledKey.current === location.key) return;
    welcomeSearchHandledKey.current = location.key;
    void performSearch(String(q).trim());
  }, [location.key, location.state, performSearch]);

  const handleSearch = async () => { await performSearch(searchQuery); };

  // Shared modal component
  const LogoutModal = () => (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="logout-modal-buttons">
          <button onClick={cancelLogout} className="logout-modal-btn-no">No</button>
          <button onClick={confirmLogout} className="logout-modal-btn-yes">Yes</button>
        </div>
      </div>
    </div>
  );

  // Show error page if location not found
  if (locationError === 'not_found') {
    return (
      <div className="result-page">
        <Header onLogout={handleLogoutClick} />
        <div className="result-error-container">
          <div className="result-error-card">
            <div className="error-icon"><AlertCircle size={64} style={{ color: '#f59e0b' }} /></div>
            <h2>Location Not Found</h2>
            <p>"{searchQuery}" is not a valid location in the Philippines. Please try a different search term.</p>
            <div className="error-suggestions">
              <h3>Try these suggestions:</h3>
              <ul>
                <li>Check the spelling of the location</li>
                <li>Try a nearby city or municipality</li>
                <li>Use a more specific location name</li>
                <li>Examples: "Manila", "Quezon City", "Cebu", "Davao"</li>
              </ul>
            </div>
            <div className="error-buttons">
              <button onClick={handleNewSearch} className="error-btn error-btn-primary"><Search size={18} /> New Search</button>
              <button onClick={handleUseMyLocation} className="error-btn error-btn-secondary"><Navigation size={18} /> Use My Location</button>
              <button onClick={handleGoHome} className="error-btn error-btn-outline"><MapPin size={18} /> Go Home</button>
            </div>
          </div>
        </div>
        {showLogoutModal && <LogoutModal />}
      </div>
    );
  }

  if (locationError === 'api_error' && !coordinates) {
    return (
      <div className="result-page">
        <Header onLogout={handleLogoutClick} />
        <div className="result-error-container">
          <div className="result-error-card">
            <div className="error-icon"><AlertCircle size={64} style={{ color: '#ef4444' }} /></div>
            <h2>Unable to Load Data</h2>
            <p>Unable to search for location. Please check your connection and try again.</p>
            <div className="error-buttons">
              <button onClick={handleRetry} className="error-btn error-btn-primary"><Search size={18} /> Try Again</button>
              <button onClick={handleGoHome} className="error-btn error-btn-outline"><MapPin size={18} /> Go Home</button>
            </div>
          </div>
        </div>
        {showLogoutModal && <LogoutModal />}
      </div>
    );
  }

  return (
    <div className="result-page">
      <Header onLogout={handleLogoutClick} />
      <div className="result-page__body">
        {/* LEFT COLUMN - Weather, Flood Forecast, Hazard Level */}
        <aside className="result-sidebar-left">
          <div className="result-sidebar__inner">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
            
            <div className="result-location-btn">
              <button 
                onClick={handleUseMyLocation} 
                disabled={isLoadingLocation}
                className={`location-btn ${isLoadingLocation ? 'loading' : ''}`}
              >
                <Navigation size={16} />
                {isLoadingLocation ? 'Getting location...' : '📍 Use My Current Location'}
              </button>
            </div>
            
            {locationError && (
              <div className="location-error">
                <AlertCircle size={14} />
                <span>{locationError}</span>
              </div>
            )}
            
            <section className="result-section">
              <button type="button" className="result-section__toggle" onClick={toggleWeatherForecast}>
                <span>WEATHER FORECAST</span>
                {showWeatherForecast ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showWeatherForecast && <WeatherForecast data={weatherData} loading={weatherLoading} error={weatherError} />}
            </section>

            <section className="result-section">
              <button type="button" className="result-section__toggle" onClick={toggleFloodForecast}>
                <span>FLOOD FORECAST</span>
                {showFloodForecast ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showFloodForecast && <FloodForecast data={floodForecastData} loading={floodForecastLoading} error={floodForecastError} />}
            </section>

            <section className="result-section">
              <button type="button" className="result-section__toggle" onClick={toggleFloodHazard}>
                <span>FLOOD HAZARD LEVEL</span>
                {showFloodHazardOpen ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showFloodHazardOpen ? <FloodHazardLevel level={floodLevel} /> : null}
            </section>
          </div>
        </aside>
        
        {/* MIDDLE COLUMN - Map */}
        <main className="result-main">
          <MapView 
            latitude={coordinates?.latitude} 
            longitude={coordinates?.longitude} 
            locationName={searchQuery} 
            floodRiskLevel={floodLevel} 
          />
        </main>
        
        {/* RIGHT COLUMN - Risk Forecast */}
        <aside className="result-sidebar-right">
          <FloodRiskWidget location={searchQuery} coordinates={coordinates} />
        </aside>
      </div>
      
      {showLogoutModal && <LogoutModal />}
    </div>
  );
}
