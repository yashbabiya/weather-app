import axios from "axios";
import { useEffect, useState } from "react";
import { kelvinToTemp } from "./helpers/kelvinToTemp";
import logo from "./imgs/logo.png";

function App() {
  const [city, setCity] = useState();
  const [data, setData] = useState();
  const [history, setHistory] = useState([]);
  const [unit, setUnit] = useState("C");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const pushHistory = (inputCity) => {
    const cities = history?.map((c) => c.toLowerCase());
    if (cities?.includes(inputCity.toLowerCase())) return;
    if (history?.length < 6) setHistory((prev) => [inputCity, ...prev]);
    else {
      setHistory((prev) => [inputCity, ...prev.slice(0, 5)]);
    }
  };
  const getDeatils = async (sCity) => {
    const cityname = sCity || city;
    setIsLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${"40cf08cf8e973f181621ec0e786822dd"}`
      )
      .then((res) => {
        setData(res.data);
        if (!sCity) pushHistory(cityname);
        setCity(null);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(() => {
        setCity(null);
        setIsLoading(false);
        setIsError(true);
      });
  };
  useEffect(() => {
    getDeatils("surat");
  }, []);
  return (
    <div className="App">
      <div className="logo">
        <img src={logo} alt="" />
        <h2>How's the Weather</h2>
      </div>

      <div className="grid">
        <div className="cell1 ">
          <div className="location">
            <i class="fa-solid fa-location-dot high"></i>
            <h2>
              {data?.name}, {data?.sys?.country}
            </h2>
          </div>
          <div className="temp">
            <div className="main">
              <img
                src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`}
                alt=""
              />
              <p>{data?.weather?.[0]?.description}</p>
            </div>
            <div className="start">
              <h1>
                {data?.main?.temp
                  ? kelvinToTemp(unit, data?.main?.temp)
                  : "Temp"}{" "}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setUnit(unit === "C" ? "F" : "C")}
                >
                  °{unit}
                </span>
              </h1>
              <p>Feels like {kelvinToTemp(unit, data?.main?.feels_like)}</p>
            </div>
          </div>
        </div>
        <div className="cell2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
            placeholder="Enter City"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                getDeatils();
                setCity("");
              }
            }}
          />
          {isError && <p>* No matching Results</p>}
          <div className="histories">
            {history.map((city) => {
              return <p onClick={() => getDeatils(city)}>{city}</p>;
            })}
          </div>
        </div>
        <div className="cell3">
          <div className="card">
            <i class="fa-solid fa-temperature-arrow-down low"></i>
            <p>
              {data?.main?.temp_min && kelvinToTemp(unit, data?.main?.temp_min)}
            </p>
          </div>
          <div className="card">
            <i class="fa-solid fa-temperature-arrow-up high"></i>
            <p>
              {data?.main?.temp_max && kelvinToTemp(unit, data?.main?.temp_max)}
            </p>
          </div>
          <div className="card">
            <i class="fa-solid fa-droplet humid"></i>
            <p>{data?.main?.humidity}</p>
          </div>
          <div className="card">
            <i class="fa-solid fa-wind wind"></i>
            <p>{data?.wind.speed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
