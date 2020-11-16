// const { default: Axios } = require('axios');
const express = require('express');
const app = express();

const axios = require('axios');

const PORT = process.env.PORT || '9000';

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



app.get('/weatherplace', async function(req, res){
    console.log(`ENV : ${process.env.ENV}`);
    const location = req.query.location;
    try {
        const nextDays = [];
        const weatherWoeid = await axios.get(`https://www.metaweather.com/api/location/search/?query=${location}`);
        const data = weatherWoeid.data;
        
        // if(data === undefined || data === null) res.status(500).json({ok : false, data : 'no-data'});
        const woeid = data[0]['woeid'];
        
        const weatherData = await axios.get(`https://www.metaweather.com/api/location/${woeid}`);
        
        //DayLetter, DayNumber MonthLetter
        const today = {
            'img_abbr' : weatherData.data['consolidated_weather'][0]['weather_state_abbr'],
            'the_temp' : Math.round(weatherData.data['consolidated_weather'][0]['the_temp']),
            'min_temp' : Math.round(weatherData.data['consolidated_weather'][0]['min_temp']),
            'max_temp' : Math.round(weatherData.data['consolidated_weather'][0]['max_temp']),
            'place' : weatherData.data['title'],
            'weather_state_name' : weatherData.data['consolidated_weather'][0]['weather_state_name'],
            'wind_speed' : Math.round(weatherData.data['consolidated_weather'][0]['wind_speed']),
            'wind_direction_compass' : weatherData.data['consolidated_weather'][0]['wind_direction_compass'],
            'humidity' : Math.round(weatherData.data['consolidated_weather'][0]['humidity']),
            'visibility' : Math.round(weatherData.data['consolidated_weather'][0]['visibility']),
            'air_pressure' : Math.round(weatherData.data['consolidated_weather'][0]['air_pressure'])
        };

        

        for (let index = 0; index < 5; index++) {
            
            nextDays.push({
                'img_abbr' : weatherData.data['consolidated_weather'][index]['weather_state_abbr'],
                'the_temp' : Math.round(weatherData.data['consolidated_weather'][index]['the_temp']),
                'min_temp' : Math.round(weatherData.data['consolidated_weather'][index]['min_temp']),
                'max_temp' : Math.round(weatherData.data['consolidated_weather'][index]['max_temp'])
            });
            
        }
    
        res.status(200).json({
            ok : true,
            data : {dataToday : today, dataNextDays : nextDays}
        });

    } catch (error) {
        res.status(500).json({
            ok : false,
            data : 'no-res'
        });
    }
    
});



app.listen(PORT, ()=>{
    console.log(`Running...`);
});