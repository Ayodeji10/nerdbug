import axios from "axios";

export const queryCities = async (param) => {
  const res = await axios.get(process.env.REACT_APP_GEO_CITY_BASE_URL, {
    params: {
      limit: "10",
      namePrefix: param,
    },
    headers: {
      "X-RapidAPI-Key": "a488e187d5msh9c0b07aa677c571p1bdf3fjsn950776e3c761",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  });
  return res;
};

export const getWeather = async (lon, lat) => {
  const res = await axios.get(
    `${process.env.REACT_APP_OPEN_WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}&units=metric`
  );
  return res;
};

export const getWeatherAndForcast = async (lon, lat) => {
  const currentWeather = axios.get(
    `${process.env.REACT_APP_OPEN_WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}&units=metric`
  );
  const currentForcast = axios.get(
    `${process.env.REACT_APP_OPEN_WEATHER_FORCAST_KEY}?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}&units=metric`
  );

  const res = await Promise.all([currentWeather, currentForcast]);
  return res;
};
