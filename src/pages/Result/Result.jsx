import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  User,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Edit3,
  Map as MapIcon,
  Search as SearchIcon,
  Sun,
  Cloud,
  CloudRain,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoImage from '../../assets/logo.png';
import './Result.css';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

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

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('agapIsLoggedIn') === 'true';
  const profileRoute = isLoggedIn ? '/welcome' : '/login';
  const closeMenu = () => setIsMenuOpen(false);

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
            <Link to="/" className="app-nav-link text-white">
              Home
            </Link>
            <Link to="/about-us" className="app-nav-link text-white">
              About Us
            </Link>
            <Link to="/" state={{ scrollToLandingContact: true }} className="app-nav-link text-white">
              Contact
            </Link>
          </div>
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
            <Link
              to="/"
              className="app-nav-link block w-full text-left py-2 text-white"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="app-nav-link block w-full text-left py-2 text-white"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              to="/"
              state={{ scrollToLandingContact: true }}
              className="app-nav-link block w-full text-left py-2 text-white"
              onClick={closeMenu}
            >
              Contact
            </Link>
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
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search location..."
          className="result-search__input"
        />
        <button type="submit" className="result-search__submit">
          Search
        </button>
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
          <div
            key={lvl.id}
            className={`result-hazard__row result-hazard__row--${lvl.id}${isActive ? ' is-active' : ''}`}
          >
            <div className="result-hazard__swatch" aria-label={`${lvl.id} warning symbol`}>
              <span
                className={`result-warning-triangle result-warning-triangle--${lvl.id}`}
                aria-hidden
              >
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

function FloodHistory({ data }) {
  const floodLevelMeta = {
    low: { label: 'Low', value: 1, colorVar: '--result-hazard-low' },
    medium: { label: 'Medium', value: 2, colorVar: '--result-hazard-medium' },
    high: { label: 'High', value: 3, colorVar: '--result-hazard-high' },
  };

  if (!data?.length) {
    return (
      <div className="result-placeholder">
        <div className="result-placeholder__row">
          <div className="result-placeholder__block result-placeholder__block--lg" />
          <div className="result-placeholder__block result-placeholder__block--tall" />
        </div>
        <p className="result-placeholder__message">No data to display</p>
        <div className="result-placeholder__row">
          <div className="result-placeholder__block result-placeholder__block--sm" />
          <div className="result-placeholder__block result-placeholder__block--sm" />
          <div className="result-placeholder__block result-placeholder__block--sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="result-weather-chart">
      <div className="result-weather-chart__plot">
        <div className="result-weather-chart__y-axis">
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
        </div>

        <div className="result-weather-chart__bars">
          {data.map((item) => {
            const levelMeta = floodLevelMeta[item.level] ?? floodLevelMeta.low;
            const barHeight = `${(levelMeta.value / 3) * 100}%`;

            return (
              <div key={`${item.date}-${item.level}`} className="result-weather-chart__col">
                <div className="result-weather-chart__bar-wrap">
                  <div
                    className="result-weather-chart__bar"
                    style={{ height: barHeight, backgroundColor: `var(${levelMeta.colorVar})` }}
                    title={`${item.date} - ${levelMeta.label}`}
                    aria-label={`${item.date} flood level ${levelMeta.label}`}
                  >
                    <span
                      className={`result-warning-triangle result-warning-triangle--${item.level}`}
                      aria-hidden
                    >
                      <span className="result-warning-triangle__mark">!</span>
                    </span>
                  </div>
                </div>
                <span className="result-weather-chart__date">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="result-weather-chart__legend">
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--low">
          Low
        </span>
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--medium">
          Medium
        </span>
        <span className="result-weather-chart__legend-item result-weather-chart__legend-item--high">
          High
        </span>
      </div>
    </div>
  );
}

function WeatherHistory({ data }) {
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="result-weather__icon result-weather__icon--sun" aria-hidden />;
      case 'Cloudy':
        return <Cloud className="result-weather__icon result-weather__icon--cloud" aria-hidden />;
      case 'Rainy':
        return <CloudRain className="result-weather__icon result-weather__icon--rain" aria-hidden />;
      default:
        return <Sun className="result-weather__icon result-weather__icon--sun" aria-hidden />;
    }
  };

  if (!data?.length) {
    return (
      <div className="result-placeholder">
        <p className="result-weather__empty">No weather history to display.</p>
      </div>
    );
  }

  return (
    <div className="result-weather">
      {data.map((weather, index) => (
        <div key={index} className="result-weather__card">
          <span className="result-weather__date">{weather.date}</span>
          <div className="result-weather__meta">
            <span className="result-weather__condition">{weather.condition}</span>
            {getWeatherIcon(weather.condition)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MapView({ latitude, longitude, locationName }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const philippinesBounds = [
      [4.5, 116.0],
      [21.0, 127.0],
    ];

    const map = L.map(mapContainerRef.current, {
      center: [12.8797, 121.774],
      zoom: 6,
      minZoom: 6,
      maxZoom: 18,
      maxBounds: philippinesBounds,
      maxBoundsViscosity: 1.0,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (latitude !== undefined && longitude !== undefined) {
      const newLatLng = [latitude, longitude];
      mapRef.current.setView(newLatLng, 12);

      const marker = L.marker(newLatLng).addTo(mapRef.current);
      if (locationName) {
        marker.bindPopup(locationName);
      }
      markerRef.current = marker;
    }
  }, [latitude, longitude, locationName]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="result-map">
      <div ref={mapContainerRef} className="result-map__canvas" />

      <div className="result-map__controls result-map__controls--side">
        <button type="button" onClick={handleZoomIn} className="result-map__tool" aria-label="Zoom in">
          <Plus className="result-map__icon-lg" aria-hidden />
        </button>
        <button type="button" onClick={handleZoomOut} className="result-map__tool" aria-label="Zoom out">
          <Minus className="result-map__icon-lg" aria-hidden />
        </button>
      </div>

      <div className="result-map__controls result-map__controls--bottom">
        <button type="button" className="result-map__tool" aria-label="Edit">
          <Edit3 className="result-map__icon-sm" aria-hidden />
        </button>
        <button type="button" className="result-map__tool" aria-label="Map layers">
          <MapIcon className="result-map__icon-sm" aria-hidden />
        </button>
        <button type="button" className="result-map__tool" aria-label="Search on map">
          <SearchIcon className="result-map__icon-sm" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const welcomeSearchHandledKey = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFloodHazardOpen, setShowFloodHazardOpen] = useState(true);
  const [showFloodHistory, setShowFloodHistory] = useState(false);
  const [showWeatherHistory, setShowWeatherHistory] = useState(false);

  const toggleFloodHazard = () => {
    setShowFloodHistory(false);
    setShowWeatherHistory(false);
    setShowFloodHazardOpen((prev) => !prev);
  };

  const toggleFloodHistory = () => {
    setShowFloodHazardOpen(false);
    setShowWeatherHistory(false);
    setShowFloodHistory((prev) => !prev);
  };

  const toggleWeatherHistory = () => {
    setShowFloodHazardOpen(false);
    setShowFloodHistory(false);
    setShowWeatherHistory((prev) => !prev);
  };

  const [floodLevel, setFloodLevel] = useState(null);

  const historyLevels = ['low', 'medium', 'high', floodLevel ?? 'medium'];
  const floodHistoryData = Array.from({ length: 4 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (3 - index));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      level: historyLevels[index],
    };
  });

  const weatherData = [
    { date: 'Mar. 30', condition: 'Sunny' },
    { date: 'Mar. 31', condition: 'Cloudy' },
    { date: 'Apr. 01', condition: 'Rainy' },
    { date: 'Apr. 02', condition: 'Sunny' },
  ];

  const [coordinates, setCoordinates] = useState(null);

  const performSearch = useCallback(async (rawQuery) => {
    const q = String(rawQuery ?? '').trim();
    if (!q) return;

    setSearchQuery(q);

    const levels = ['low', 'medium', 'high'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    setFloodLevel(randomLevel);
    setShowFloodHazardOpen(true);
    setShowFloodHistory(false);
    setShowWeatherHistory(false);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=ph&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } else {
        alert('Location not found in the Philippines. Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for location. Please try again.');
    }
  }, []);

  useEffect(() => {
    const q = location.state?.welcomeSearchQuery;
    if (!q || !String(q).trim()) return;
    if (welcomeSearchHandledKey.current === location.key) return;
    welcomeSearchHandledKey.current = location.key;
    void performSearch(String(q).trim());
  }, [location.key, location.state, performSearch]);

  const handleSearch = async () => {
    await performSearch(searchQuery);
  };

  return (
    <div className="result-page">
      <Header />

      <div className="result-page__body">
        <aside className="result-sidebar">
          <div className="result-sidebar__inner">
            <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />

            <section className="result-section">
              <button
                type="button"
                className="result-section__toggle"
                onClick={toggleFloodHazard}
              >
                <span>FLOOD HAZARD LEVEL</span>
                {showFloodHazardOpen ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showFloodHazardOpen && <FloodHazardLevel level={floodLevel} />}
            </section>

            <section className="result-section">
              <button
                type="button"
                className="result-section__toggle"
                onClick={toggleFloodHistory}
              >
                <span>FLOOD HISTORY</span>
                {showFloodHistory ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showFloodHistory && <FloodHistory data={floodHistoryData} />}
            </section>

            <section className="result-section">
              <button
                type="button"
                className="result-section__toggle"
                onClick={toggleWeatherHistory}
              >
                <span>WEATHER HISTORY</span>
                {showWeatherHistory ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
              </button>
              {showWeatherHistory && <WeatherHistory data={weatherData} />}
            </section>
          </div>
        </aside>

        <main className="result-main">
          <MapView
            latitude={coordinates?.latitude}
            longitude={coordinates?.longitude}
            locationName={searchQuery}
          />
        </main>
      </div>
    </div>
  );
}
