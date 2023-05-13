
const kelvinToCelsius =(temp)=>{
    return (temp - 273.15).toFixed(2)
}
const kelvinToFahrenheit = (temp)=>{
    return (temp * 9/5 - 459.67).toFixed(2)
}
export const kelvinToTemp = (unit,temp)=>{
    if(unit === "C"){
        return (kelvinToCelsius(temp))
        }
        if(unit === "F"){
            return (kelvinToFahrenheit(temp))

        }

}