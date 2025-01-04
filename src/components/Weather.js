import { useState, useEffect } from 'react';
import './Weather.css';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('izmir');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [moonPhase, setMoonPhase] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hava durumu açıklamalarının Türkçe karşılıkları
  const weatherTranslations = {
    'clear sky': 'Açık',
    'few clouds': 'Az Bulutlu',
    'scattered clouds': 'Parçalı Bulutlu',
    'broken clouds': 'Çok Bulutlu',
    'shower rain': 'Sağanak Yağışlı',
    'rain': 'Yağmurlu',
    'thunderstorm': 'Gök Gürültülü',
    'snow': 'Karlı',
    'mist': 'Sisli',
    'overcast clouds': 'Kapalı'
  };

  useEffect(() => {
    // Saat güncellemesi için interval
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Gece/gündüz kontrolü
    const checkTimeOfDay = () => {
      const hour = new Date().getHours();
      setTimeOfDay(hour >= 6 && hour < 20 ? 'day' : 'night');
    };

    // Ay evresi hesaplama (0-7 arası, 0: yeni ay, 4: dolunay)
    const calculateMoonPhase = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const c = Math.floor((year - 2000) * 365.25);
      const e = Math.floor(30.6 * month);
      const jd = c + e + day - 694039.09;
      const phase = jd / 29.53;
      setMoonPhase(Math.floor((phase - Math.floor(phase)) * 8));
    };

    checkTimeOfDay();
    calculateMoonPhase();
    const interval = setInterval(checkTimeOfDay, 60000); // Her dakika kontrol et

    return () => {
      clearInterval(timeInterval);
      clearInterval(interval);
    };
  }, []);

  // Hava durumu için yeni useEffect ekleyelim
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWeather();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [city]);

  // Hava durumu sınıfını belirle
  const getWeatherClass = () => {
    if (!weather) return 'clear-' + timeOfDay;
    
    const description = weather.description?.toLowerCase() || '';
    if (description.includes('rain') || description.includes('yağmur')) return 'rainy';
    if (description.includes('cloud') || description.includes('bulut')) return 'cloudy';
    if (description.includes('snow') || description.includes('kar')) return 'snowy';
    if (description.includes('storm') || description.includes('fırtına')) return 'stormy';
    return timeOfDay === 'day' ? 'clear-day' : 'clear-night';
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://goweather.herokuapp.com/weather/${city}`
      );
      if (!response.ok) {
        throw new Error('Şehir bulunamadı');
      }
      const data = await response.json();
      const temp = parseInt(data.temperature);
      const description = weatherTranslations[data.description?.toLowerCase()] || 'Açık';
      
      setWeather({
        ...data,
        temperature: isNaN(temp) ? 'N/A' : `${temp}°C`,
        description: description,
        wind: data.wind ? `Rüzgar: ${data.wind}` : 'Rüzgar: Sakin'
      });
    } catch (error) {
      setError('Hava durumu bilgisi alınamadı');
      console.error('Hava durumu alınamadı:', error);
    }
    setLoading(false);
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className={`weather-widget ${getWeatherClass()}`}>
      <div className="weather-effects">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="effect-element" style={{
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${Math.random() * 2 + 1}s`,
            '--position': `${Math.random() * 100}%`
          }}></div>
        ))}
      </div>

      {timeOfDay === 'night' && (
        <div className={`moon phase-${moonPhase}`}></div>
      )}
      
      {timeOfDay === 'day' && getWeatherClass() === 'clear-day' && (
        <div className="sun"></div>
      )}

      <div className="widget-header">
        {isEditing ? (
          <form onSubmit={handleCitySubmit} className="city-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value.toLowerCase())}
              placeholder="Şehir adı girin..."
              autoFocus
            />
            <button type="submit">✓</button>
          </form>
        ) : (
          <div className="location-info">
            <div className="city-display" onClick={() => setIsEditing(true)}>
              <span>{city.charAt(0).toUpperCase() + city.slice(1)}</span>
              <button className="edit-button">✎</button>
            </div>
            <div className="digital-clock">
              {formatTime(currentTime)}
            </div>
          </div>
        )}
      </div>

      {loading && <div className="weather-loading">⟳</div>}
      {error && <div className="weather-error">!</div>}
      
      {weather && !loading && !error && (
        <div className="weather-content">
          <div className="temperature">
            {weather.temperature}
          </div>
          <div className="weather-details">
            <div className="description">
              {weather.description}
            </div>
            <div className="wind">
              {weather.wind}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather; 