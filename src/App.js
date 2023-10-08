import './App.css';
import D3Graph from './D3Graph';
import WeatherComponent from './WeatherApi';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';


const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },
  palette: {
    primary: {
      main: '#FF0000', // Red color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WeatherComponent/>
    </ThemeProvider>
  );
}

export default App;
