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
    key: props?.openweather_key,
    lat: props?.latitude,
    lon: props?.longitude,
    lang: 'en',
    unit: props?.units,
  });

  const isForecast = () => {
    let status = true;
    if(props.length === 'today'){
      status = false;
    }
    return status;
  }

  const getLabels = () => {
    let labels = { temperature: '°C', windSpeed: 'km/h' };
    if(props?.units === 'imperial'){
      labels = { temperature: 'F', windSpeed: 'Mph' };
    }
    else if(props?.units === 'standard'){
      labels = { temperature: 'K', windSpeed: 'km/h' };
    }
    return labels;
  }

  const renderWeather = () => (
    <ReactWeather
      theme={customStyles}
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel={ props?.label }
      unitsLabels={ getLabels() }
      showForecast={ isForecast() }
  />
  );
 
  return (
    <>
      { renderWeather() }
    </>
  );
}
