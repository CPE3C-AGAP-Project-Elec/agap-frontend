import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import api from '../../services/api';
import './FloodRiskWidget.css';

export default function FloodRiskWidget({ location, coordinates }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiskData();
  }, [location, coordinates]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (coordinates?.lat && coordinates?.lon) {
        params.append('lat', coordinates.lat);
        params.append('lon', coordinates.lon);
      }
      if (location) {
        params.append('location', location);
      }
      
      const response = await api.get(`/risk/predict?${params}`);
      setRiskData(response.data.data);
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setError('Failed to load flood risk prediction');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="risk-widget loading">
        <div className="risk-spinner"></div>
        <p>Analyzing flood risk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="risk-widget error">
        <AlertTriangle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  if (!riskData) return null;

  const { currentRisk, predictions, alert, factors, recommendations } = riskData;
  const riskPercentage = currentRisk.percentage || 0;

  return (
    <div className="risk-widget">
      {/* Alert Banner */}
      <div className={`risk-alert risk-alert-${currentRisk.level}`} style={{ backgroundColor: alert.color + '20', borderColor: alert.color }}>
        <div className="risk-alert-icon">
          <AlertTriangle size={28} color={alert.color} />
        </div>
        <div className="risk-alert-content">
          <h3>{alert.title}</h3>
          <p>{alert.message}</p>
        </div>
      </div>

      {/* Current Risk Meter */}
      <div className="risk-meter">
        <h3>Current Flood Risk</h3>
        <div className="risk-gauge">
          <div className="risk-gauge-fill" style={{ width: `${riskPercentage}%`, backgroundColor: currentRisk.color }}></div>
        </div>
        <div className="risk-stats">
          <span className="risk-percentage">{Math.round(riskPercentage)}%</span>
          <span className="risk-level" style={{ color: currentRisk.color }}>
            {currentRisk.level.toUpperCase()} RISK
          </span>
        </div>
        <p className="risk-message">{currentRisk.message}</p>
      </div>

      {/* Risk Factors */}
      <div className="risk-factors">
        <h4>Risk Factors</h4>
        <div className="factors-grid">
          <div className="factor">
            <span className="factor-label">Current Rainfall</span>
            <span className="factor-value">{factors.currentRainfall?.toFixed(1)} mm</span>
          </div>
          <div className="factor">
            <span className="factor-label">Forecast Rainfall</span>
            <span className="factor-value">{factors.forecastRainfall?.toFixed(1)} mm</span>
          </div>
          <div className="factor">
            <span className="factor-label">Soil Moisture</span>
            <span className="factor-value">{Math.round(factors.soilMoisture || 0)}%</span>
          </div>
          <div className="factor">
            <span className="factor-label">Historical Risk</span>
            <span className="factor-value">{Math.round((factors.historicalRisk || 0) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* 7-Day Prediction */}
      <div className="risk-predictions">
        <h4>7-Day Risk Forecast</h4>
        <div className="predictions-chart">
          {predictions.map((pred, idx) => (
            <div key={idx} className="prediction-bar">
              <div className="prediction-label">{pred.date}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${pred.riskPercentage}%`,
                    backgroundColor: pred.riskLevel === 'critical' ? '#ef4444' :
                                   pred.riskLevel === 'high' ? '#f97316' :
                                   pred.riskLevel === 'medium' ? '#eab308' : '#22c55e'
                  }}
                ></div>
              </div>
              <div className="prediction-value">{pred.riskPercentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="risk-recommendations">
        <h4>Safety Recommendations</h4>
        <div className="recommendations-list">
          {alert.actions.map((action, idx) => (
            <div key={idx} className="recommendation">
              <span className="rec-icon">→</span>
              <span>{action}</span>
            </div>
          ))}
          <div className="recommendation">
            <span className="rec-icon">ℹ️</span>
            <span>{recommendations}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
