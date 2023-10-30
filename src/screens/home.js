import React from "react";
import { useEffect, useState } from "react";
import { getWeather } from "../utils/requests";
import { landingCities } from "../utils/data";
import { sort } from "../utils/utills";
import { useNavigate } from "react-router-dom";

function Home() {
  const [cities, setCities] = useState(landingCities);
  const [favorites, setFavourites] = useState([]);

  useEffect(() => {
    const cityFavorites = JSON.parse(localStorage.getItem("cityFavorites"));
    if (cityFavorites) {
      setFavourites(cityFavorites);
    }
  }, []);

  return (
    <div className="home">
      <div className="container">
        <h2>Favorite Cities</h2>
        {favorites.length === 0 ? (
          <p className="mb-5">Your favorite Cities will appear here</p>
        ) : (
          <div className="row">
            {sort(favorites).map((city, i) => {
              return (
                <div key={i} className="col-md-4 col-sm-6 col-12">
                  <City city={city} favorite={true} />
                </div>
              );
            })}
          </div>
        )}
        <div className="row">
          <h2>15 largest cities</h2>
          {sort(cities).map((city, i) => {
            return (
              <div key={i} className="col-md-4 col-sm-6 col-12">
                <City
                  city={city}
                  cities={cities}
                  setCities={setCities}
                  favorite={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;

const City = ({ city, cities, setCities, favorite }) => {
  // navigator
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cityWeather, setCityWeather] = useState({});

  useEffect(() => {
    getCityWeather();
  }, []);

  const getCityWeather = async () => {
    try {
      const res = await getWeather(city.lon, city.lat);
      //   console.log(res.data);
      setCityWeather(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removeCity = () => {
    const newCities = cities.filter(
      (currentCity) => currentCity.name !== city.name
    );
    // console.log(newCities);
    setCities(newCities);
  };

  return (
    <>
      {!loading && (
        <div
          className="city-card"
          onClick={() => navigate(`/${city.name}/${city.lon}/${city.lat}`)}
        >
          {!favorite && (
            <div className="d-flex justify-content-end mb-3">
              <button
                className="d-flex justify-content-center align-items-center"
                title="remove city"
                onClick={removeCity}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-start mb-5">
            <div>
              <h2>{city.name}</h2>
              <h3>{cityWeather?.weather[0]?.description}</h3>
            </div>
            <img
              src={`http://openweathermap.org/img/w/${cityWeather?.weather[0]?.icon}.png`}
              alt=""
            />
          </div>
          <div className="row">
            <div className="col-5">
              <h4>
                {Math.round(cityWeather?.main?.temp)}
                <sup>o</sup>C
              </h4>
            </div>
            <div className="col-7">
              <h5>Details</h5>
              <div className="d-flex justify-content-between">
                <p>Wind Speed: </p>
                <p>{cityWeather.wind.speed} m/s</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Feels Like: </p>
                <p>
                  {Math.round(cityWeather?.main?.feels_like)}
                  <sup>o</sup>C
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Humidity: </p>
                <p>{cityWeather.main.humidity}%</p>
              </div>
              <div className="d-flex justify-content-between">
                <p>Pressure: </p>
                <p>{cityWeather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
