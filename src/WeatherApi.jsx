import React, { useState, useEffect } from 'react';
import D3Graph from './D3Graph';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, useMediaQuery, withStyles } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@emotion/react';


const CustomInputLabel = styled('label')({
  color: 'transparent',
  backgroundImage: 'linear-gradient(135deg, #FFA500, #FF8C00, #FF7F50, #FF6347)',
  WebkitBackgroundClip: 'text',
});


const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [cityName, setCityName] = useState("");

  const theme = useTheme()
  const isMd= useMediaQuery(theme.breakpoints.up('md'));

  const fetchData = async (city) => {
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=7&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
      );

      if (response.ok) {
        setWeatherData([])
        const data = await response.json();
        const maxTempArray = data.list.map(item => item.main.temp_max);
        const dtTxtArray = data.list.map(item => new Date(item.dt_txt));
        const formattedTimes = dtTxtArray.map(timestamp => {
          const date = new Date(timestamp);
          const hours = date.getUTCHours().toString().padStart(2, '0');
          const minutes = date.getUTCMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        });
        setWeatherData(maxTempArray);
        setTimeData(formattedTimes)
      } else {
        console.error('Failed to fetch weather data');
        setTimeData([])
        setWeatherData([]); // Reset weather data in case of an error
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData([]); // Reset weather data in case of an error
    }
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  const callFetch = () => {
    fetchData(cityName)
  }


  return (
    <Container style={{ marginTop: 50, display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Daily weather forecast
      </Typography>
      <TextField
        label={<CustomInputLabel>Enter city name</CustomInputLabel>}
        variant="outlined"
        value={cityName}
        onChange={handleInputChange}
        style={{ marginBottom: 20 }}
      />
      <Button onClick={callFetch} className="bg-orange" variant="contained" sx={{mb:5}}>Get Data</Button>
      {weatherData.length > 0 ? (
        <D3Graph weatherData={weatherData} timeData={timeData} cityName={cityName}/>
      ) : (
        <Typography variant="body1" align="center">
          No data available for the selected city.
        </Typography>
      )}
    </Container>
  );
};

export default WeatherComponent;
