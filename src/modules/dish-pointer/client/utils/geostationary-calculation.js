const radiusOfEarth = 6378.14; //km

const degToRad = (deg) => {
    return (deg * Math.PI) / 180;
};

const radToDeg = (rad) => {
    return rad * (180 / Math.PI);
};

const calcAzimuth = (esLat, esLong, satLong) => {
    const bDeg = esLong - satLong;
    const bRad = degToRad(bDeg);
    const esLatRad = degToRad(esLat);

    const azimuth = Math.PI - Math.atan(Math.tan(Math.abs(bRad)) / Math.sin(esLatRad));

    return radToDeg(azimuth);
};

const calcElevation = (esLat, esLong, satLong, orbitHeight = 35786, esHeight = 0) => {
    const bDeg = esLong - satLong;
    const bRad = degToRad(bDeg);
    const esLatRad = degToRad(esLat);

    //Cos(c) = Cos(yE)*Cos(b)
    const c = Math.acos(Math.cos(esLatRad) * Math.cos(bRad));

    //Distances relative to the earth's center
    const esDistance = radiusOfEarth + esHeight;
    const satDistance = orbitHeight + esDistance;

    const distance = Math.sqrt(
        Math.pow(esDistance, 2) + Math.pow(satDistance, 2) - 2 * esDistance * satDistance * Math.cos(c)
    );

    //Cos(E) = (Re + (h/d))*Sin(C)
    const elevation = Math.acos((satDistance / distance) * Math.sin(c));

    return radToDeg(elevation);
};

//Azimuth, Elevation = function(Satelite Offset, Satelite Direction, Earth Station Latitude, Earth Station Longitude)
const geostationaryCalculation = (satLong, position) => {
    const esLat = position.lat;
    const esLong = position.lng;
    const result = {};
    try {
        result.azimuth = calcAzimuth(esLat, esLong, satLong);
        result.elevation = calcElevation(esLat, esLong, satLong);
    } catch (error) {
        console.log(error);
        result.error = error;
    }
    return result;
};

export default geostationaryCalculation;
