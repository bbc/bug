import React, { useEffect, useRef } from "react";
import ReactWeather, { useOpenWeather } from 'react-open-weather';

const customStyles = {
	fontFamily:  'ReithSans, sans-serif',
	gradientStart:  '#153550',
	gradientMid:  '#153550',
	gradientEnd:  '#153550',
	locationFontColor:  '#FFF',
	todayTempFontColor:  '#FFF',
	todayDateFontColor:  '#B5DEF4',
	todayRangeFontColor:  '#B5DEF4',
	todayDescFontColor:  '#B5DEF4',
	todayInfoFontColor:  '#B5DEF4',
	todayIconColor:  '#FFF',
	forecastBackgroundColor:  '#262626',
	forecastSeparatorColor:  '#DDD',
	forecastDateColor:  '#777',
	forecastDescColor:  '#777',
	forecastRangeColor:  '#777',
	forecastIconColor:  '#FFF',
};

export default function Weather(props) {

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: '06f09531f033e4a3a1852f81641826ba',
    lat: '48.137154',
    lon: '0',
    lang: 'en',
    unit: 'metric',
  });

  return (
    <ReactWeather
      theme={customStyles}
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel="London"
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
    />
  );
}
