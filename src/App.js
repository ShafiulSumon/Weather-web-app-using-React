import hotBg from './assets/hot.jpg';
import coldBg from './assets/cold.jpg';
import Descriptions from './components/Descriptions';
import { useEffect, useState } from 'react';
import { getFormattedWeatherData } from './Api';

function App() {

  const [weather, setWeather] = useState(null);
  const [units, setUnit] = useState('metric');
  const [city, setCity] = useState('dhaka');
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      const threshold = units === 'metric' ? 20 : 60;
      if(data.temp <= threshold) {
        setBg(coldBg);
      }
      else {
        setBg(hotBg);
      }
    };

    fetchWeatherData();
  }, [units, city]);


  function handleUnitClick(e) {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === 'C';

    button.innerText = isCelsius ? '°F' : '°C';
    setUnit(isCelsius ? 'metric' : 'imperial')
  }


  function enterKeyPressed(e) {
    if(e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  }


  return (
    <div className="App" style={{backgroundImage: `url(${bg})`}}>
      <div className="overlay">
        {weather && (
          <div className="container">
          <div className="section section__input">
            <input onKeyDown={enterKeyPressed} type='text' name='city' placeholder='Choose City...' />
            <button onClick={(e) => {handleUnitClick(e)}}>°F</button>
          </div>

          <div className="section section__temperature">
            <div className="icon">
              <h3>{`${weather.name}, ${weather.country}`}</h3>
              <img src={weather.iconURL} alt='weatherIcon' />
              <h3>{weather.description}</h3>
            </div>
            <div className="temperature">
              <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? 'C' : 'F'}`}</h1>
            </div>
          </div>

          <Descriptions weather={weather} units={units}/>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
