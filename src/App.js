import axios from 'axios';
import { useEffect, useState } from 'react';
import { kelvinToTemp } from './helpers/kelvinToTemp';
import arrow from './imgs/arrow.png'
import { weatherImg } from './helpers/imgMapper';
import loaderGIF from "./imgs/loader.gif"

function App() {
  const [city,setCity] = useState();
  const [data,setData] = useState();
  const [history,setHistory] = useState([]);
  const [unit,setUnit] = useState("C");
  const [isLoading,setIsLoading] = useState(false)
  const [isError,setIsError] = useState(false)

  const pushHistory = (inputCity) =>{
    const cities = history?.map((c)=>c.toLowerCase())
    if(cities?.includes(inputCity.toLowerCase())) return
    if(history?.length < 4)
    setHistory((prev) => [inputCity,...prev])
    else{
      setHistory((prev) => [inputCity,...prev.slice(0,3)])
    }
  }
  const getDeatils = async(sCity) =>{
    const cityname = sCity || city;
    setIsLoading(true)
     axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${"40cf08cf8e973f181621ec0e786822dd"}`)
    .then((res)=>{
      setData(res.data)
      if(!sCity)
      pushHistory(cityname)
      setCity(null)
      setIsLoading(false)
      setIsError(false)
    }).catch(()=>{
      setCity(null)
      setIsLoading(false)
      setIsError(true)
    })
  }
  useEffect(()=>{
    getDeatils("surat")
  },[])
  return (
    data ? <div className="App">
      <div className="top">
        <div className="left">
        <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} className='input'
          placeholder='Enter City'
          onKeyPress={(e)=>{
            if(e.key === "Enter"){
              getDeatils()
              setCity("")
            }
          }}
          />
        {isError && <p>* No matching Results</p>}
        <div className="histories">
          {history.map((city)=>{
            return <p onClick={()=>getDeatils(city)}>{city}</p>
          })}
        </div>
        </div>
      </div>
      <div className="mid">
        {data ? data.name : "Enter any city"}
        {data?.weather?.[0].main && <img src={weatherImg[data?.weather?.[0].main]} alt="" style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:-1, opacity:.4,width:500,height:500,objectFit:"cover"}}/>}
      </div>
      <div className="bottom">
        <div className="card">
          <div className="left">
          <div className="up">

<img src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`} alt="" />
<span>{data?.weather?.[0]?.main}</span>
</div>
          </div>
          <div className="right">

          <div className="center">
            <h1>{data?.main?.temp ? kelvinToTemp(unit, data?.main?.temp) : "Temp"} <span style={{cursor:'pointer'}} onClick={()=>setUnit(unit==="C" ? "F" : "C")}>°{unit}</span></h1>
            <div className="more">
            <div className="temp">
              Min : {data?.main?.temp_min && kelvinToTemp(unit, data?.main?.temp)}
            </div>
            <div className="temp">
              Max : {data?.main?.temp_max && kelvinToTemp(unit, data?.main?.temp)}
            </div>
            <div className="temp">
              Feels Like : {data?.main?.feels_like && kelvinToTemp(unit, data?.main?.feels_like)}
            </div> 
            </div>
          </div>
          <div className="info">
            <div className="app">
                <span className='num'>{data?.main?.pressure}</span>
                <span>Pressure</span>
            </div> 
            <div className="app">
                <span className='num'>{data?.main?.humidity}</span>
                <span>Humidity</span>
            </div> 
            <div className="app">
                <span className='flex num'><img src={arrow} width={20} style={{transform:`rotate(${data?.wind.deg}deg)`}}/> {data?.wind.speed}</span>
                <span>Wind (km/h)</span>
            </div> 
          </div>
          </div>

        </div>
      </div>
    </div> :<div className='App'><img src={loaderGIF} alt="" style={{width:"100vw", height:"100vh", objectFit:"cover"}}/></div>
  );
}

export default App;
