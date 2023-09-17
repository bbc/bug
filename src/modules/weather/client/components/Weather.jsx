import React from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";

const customStyles = {
    gradientStart: "#153550",
    gradientMid: "#153550",
    gradientEnd: "#153550",
    locationFontColor: "#FFF",
    todayTempFontColor: "#FFF",
    todayDateFontColor: "#B5DEF4",
    todayRangeFontColor: "#B5DEF4",
    todayDescFontColor: "#B5DEF4",
    todayInfoFontColor: "#B5DEF4",
    todayIconColor: "#FFF",
    forecastBackgroundColor: "#262626",
    forecastSeparatorColor: "#DDD",
    forecastDateColor: "#777",
    forecastDescColor: "#777",
    forecastRangeColor: "#777",
    forecastIconColor: "#FFF",
};

export default function Weather({ length, label, panelId, openweather_key, latitude, longitude, units }) {
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: openweather_key,
        lat: latitude,
        lon: longitude,
        lang: "en",
        unit: units,
    });

    const isForecast = () => {
        let status = true;
        if (length === "today") {
            status = false;
        }
        return status;
    };

    const getLabels = () => {
        let labels = { temperature: "°C", windSpeed: "km/h" };
        if (units === "imperial") {
            labels = { temperature: "F", windSpeed: "Mph" };
        } else if (units === "standard") {
            labels = { temperature: "K", windSpeed: "km/h" };
        }
        return labels;
    };

    if (isLoading) {
        return <BugLoading />;
    }

    if (errorMessage) {
        return (
            <BugNoData
                panelId={panelId}
                title="No weather data"
                message="Click to edit panel configuration"
                showConfigButton={true}
            />
        );
    }

    return (
        <ReactWeather
            theme={customStyles}
            isLoading={isLoading}
            errorMessage={errorMessage}
            data={data}
            lang="en"
            locationLabel={label}
            unitsLabels={getLabels()}
            showForecast={isForecast()}
        />
    );
}
