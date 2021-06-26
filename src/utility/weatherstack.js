const request = require("request");

const weathercode = (lat, long, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=ee23806064cce02d8b6712d3a8dbdee6&query=" +
    encodeURIComponent(lat) +
    "," +
    encodeURIComponent(long) +
    "&units=m";

    request({url, json:true},(error,{body})=>{
        if(error){
            callback('Unable  to connect internet',undefined);
        }else if(body.error){
            callback('Unable to find location! try again',undefined);
        }else{
            callback(undefined, {
                temperature: body.current.temperature,
                feelLike: body.current.feelslike
            })
        }
    })
};

module.exports ={
    weathercode: weathercode
}
