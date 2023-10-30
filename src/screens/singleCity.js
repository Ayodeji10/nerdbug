import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWeatherAndForcast, queryCities } from "../utils/requests";
import { ddmmyyyyFormat } from "../utils/utills";
import cogoToast from "cogo-toast";

function SingleCity() {
  // params
  const { city, lat, lon } = useParams();

  // navigator
  const navigate = useNavigate();

  const today = new Date();
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  const [forcast, setForcast] = useState({});
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    // clear search
    setSearchCities([]);
    setSearchParam("");
    // check previous notes
    const cityNotes = JSON.parse(localStorage.getItem("cityNotes"));
    if (cityNotes) {
      setSavedNotes(cityNotes);
      const noteForCurrentCity = cityNotes.find((note) => note.city === city);
      if (noteForCurrentCity) {
        setNote(noteForCurrentCity.note);
      }
    }
    // check previous favourites
    const cityFavorites = JSON.parse(localStorage.getItem("cityFavorites"));
    if (cityFavorites) {
      const currentCity = cityFavorites.find(
        (currentFavorite) => currentFavorite.name === city
      );
      if (currentCity) {
        setFavourite(true);
      }
    }
    // get weather and forcast
    getCityWeatherAndForcast();
  }, [city, lat, lon]);

  const getCityWeatherAndForcast = async () => {
    try {
      const res = await getWeatherAndForcast(lat, lon);
      setWeather(res[0].data);
      setForcast(res[1].data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const saveNote = () => {
    if (!note) {
      cogoToast.error("Please Type a note");
    } else if (savedNotes.length === 0) {
      const newNotes = [{ city, note }];
      localStorage.setItem("cityNotes", JSON.stringify(newNotes));
      cogoToast.success("Note Saved");
    } else {
      const oldNotes = savedNotes.filter((note) => note.city !== city);
      const newNote = { city, note };
      const newSavedNotes = [...oldNotes, newNote];
      localStorage.setItem("cityNotes", JSON.stringify(newSavedNotes));
      cogoToast.success("Note Saved");
    }
  };

  const toggleFavorite = () => {
    const cityFavorites = JSON.parse(localStorage.getItem("cityFavorites"));
    if (favourite) {
      const newFavourite = cityFavorites.filter(
        (favorite) => favorite.name !== city
      );
      localStorage.setItem("cityFavorites", JSON.stringify(newFavourite));
      setFavourite(false);
      cogoToast.success("Removed from Favorites");
    } else {
      if (cityFavorites) {
        const oldFavorites = cityFavorites.filter((city) => city.name !== city);
        const newFavourite = { name: city, lat, lon };
        const newSavedFavorite = [...oldFavorites, newFavourite];
        localStorage.setItem("cityFavorites", JSON.stringify(newSavedFavorite));
        setFavourite(true);
        cogoToast.success("Saved to Favorite!");
      } else {
        const favorite = [{ name: city, lat, lon }];
        localStorage.setItem("cityFavorites", JSON.stringify(favorite));
        setFavourite(true);
        cogoToast.success("Saved to Favorite!");
      }
    }
  };

  //   search
  const [searchParam, setSearchParam] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchCities, setSearchCities] = useState([]);

  const handleSearchParam = async (e) => {
    if (e === "") {
      setSearchCities([]);
      setSearchParam("");
    } else {
      setSearchLoading(true);
      setSearchParam(e);
      try {
        const res = await queryCities(e);
        setSearchCities(res.data.data);
        setSearchLoading(false);
      } catch (error) {
        console.log(error);
        setSearchLoading(false);
      }
    }
  };

  return (
    <>
      {!loading && (
        <div className="single-city">
          <div className="container">
            <input
              type="text"
              placeholder="search Cities"
              value={searchParam}
              onChange={(e) => handleSearchParam(e.target.value)}
            />
            {searchLoading
              ? "loading..."
              : searchCities.map((city, i) => {
                  return (
                    <p
                      key={i}
                      onClick={() =>
                        navigate(
                          `/${city.city}/${city.latitude}/${city.longitude}`
                        )
                      }
                    >
                      {city.city}, {city.country}
                    </p>
                  );
                })}
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="back">
                <i
                  className="fa-solid fa-arrow-left-long"
                  onClick={() => navigate("/")}
                />
                Home
              </h6>
              <p onClick={toggleFavorite} style={{ cursor: "pointer" }}>
                Add to Favourites
                <i
                  className={`fa-solid fa-heart ${
                    favourite ? null : "fa-beat"
                  }`}
                  title={favourite ? "Remove from favorite" : "Add to Favorite"}
                  style={{ color: favourite ? "red" : "rgba(0,0,0,0.5)" }}
                />
              </p>
            </div>
            <header>
              <div className="row">
                <div className="col-md-2 col-sm-4 col-12">
                  <h4 className="mb-4">
                    <i className="fa-solid fa-location-dot" />
                    {city}
                  </h4>
                  <h2>Today</h2>
                  <p>{today.toString().substring(0, 15)}</p>
                  <h3>
                    {Math.round(weather?.main?.temp)}
                    <sup>o</sup>C
                  </h3>
                  <p className="mb-5">{weather?.weather[0]?.description}</p>
                  <p>Details</p>
                  <div className="details">
                    <p>Wind Speed</p>
                    <h6>{weather.wind.speed} m/s</h6>
                  </div>
                  <div className="details">
                    <p>Feels Like</p>
                    <h6>
                      {Math.round(weather?.main?.feels_like)}
                      <sup>o</sup>C
                    </h6>
                  </div>
                  <div className="details">
                    <p>Humidity</p>
                    <h6>{weather.main.humidity}%</h6>
                  </div>
                  <div className="details">
                    <p>Humidity</p>
                    <h6>{weather.main.pressure} hPa</h6>
                  </div>
                </div>
                <div className="col-md-10 col-sm-8 col-12">
                  <h3 className="mb-3">Forecast</h3>
                  {[
                    ...new Set(
                      forcast.list.map((day) => day.dt_txt.substring(0, 10))
                    ),
                  ].map((day, i) => {
                    return (
                      <div key={i} className="day">
                        <p className="date">{ddmmyyyyFormat(day)}</p>
                        <div className="row">
                          {forcast.list
                            .filter(
                              (forcast) =>
                                forcast.dt_txt.substring(0, 10) === day
                            )
                            .map((forcast, i) => {
                              return (
                                <div className="col" key={i}>
                                  <div className="forcast">
                                    <h6>
                                      {forcast.dt_txt.substring(11, 19)}{" "}
                                      {Number(
                                        forcast.dt_txt.substring(11, 13)
                                      ) >= 12
                                        ? "pm"
                                        : "am"}
                                    </h6>
                                    <img
                                      src={`http://openweathermap.org/img/w/${forcast?.weather[0]?.icon}.png`}
                                      alt=""
                                    />
                                    <h3>{forcast?.weather[0]?.description}</h3>
                                    <h5>
                                      {Math.round(forcast?.main?.temp)}
                                      <sup>o</sup>C
                                    </h5>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                  <div className="note">
                    <label htmlFor="note">Add note</label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                    <button onClick={saveNote}>Save</button>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleCity;
