document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-search');

    searchBtn.addEventListener('click', handleSearch);
    addCityButtonListeners();

    function addCityButtonListeners() {
        const cityButtons = document.querySelectorAll('.city-btn');
        console.log(cityButtons);

        cityButtons.forEach(button => {
            button.onclick = function() {
                const cityName = this.textContent.trim();
                console.log('City Button Clicked:', cityName);

                cityInput.value = cityName;
                handleSearch();
            };
        });
    }

    function handleSearch() {
        const cityName = cityInput.value.trim();
        if (cityName) {
            getCityCoordinates(cityName).then(coords => {
                if (coords) {
                    getWeatherForecast(coords.lat, coords.lon).then(forecast => {
                        if (forecast) {
                            displayForecast(forecast);
                        } else {
                            console.error('Unable to fetch forecast.');
                        }
                    });

                    getCurrentWeather(cityName).then(data => {
                        if (data) {
                            updateCurrentWeather(data);
                            const currentWeatherHeading = document.querySelector('#current-weather h2');
                            currentWeatherHeading.textContent = cityName;
                        } else {
                            console.error('Unable to fetch current weather.');
                        }
                    });
                } else {
                    console.error('Unable to fetch city coordinates.');
                }
            });
        }
    }

    function getCityCoordinates(cityName) {
        const apiKey = '8e8dc44538d92545f5a0bf0be16a3fbc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(data => {
                if (data.coord) {
                    return data.coord;
                } else {
                    throw new Error(data.message || 'Error fetching city coordinates.');
                }
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    function getWeatherForecast(lat, lon) {
        const apiKey = '8e8dc44538d92545f5a0bf0be16a3fbc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`;

        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.list) {
                    return data.list;
                } else {
                    throw new Error(data.message || 'Error fetching forecast.');
                }
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    function getCurrentWeather(cityName) {
        const apiKey = '8e8dc44538d92545f5a0bf0be16a3fbc';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(data => {
                if (data) {
                    return data;
                } else {
                    throw new Error(data.message || 'Error fetching current weather.');
                }
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    }

    function updateCurrentWeather(data) {
        document.getElementById('current-city').textContent = ` ${data.name}`;
        document.getElementById('current-temp').textContent = ` ${data.main.temp}°F`;
        document.getElementById('current-condition').textContent = ` ${data.weather[0].main}`; 
        document.getElementById('current-wind').textContent = ` ${data.wind.speed} mph`;
        document.getElementById('current-humidity').textContent = ` ${data.main.humidity}%`;
    }

    function displayForecast(forecastData) {
        const forecastDivs = document.querySelectorAll('.forecast-day');
    
        const dailyForecasts = forecastData.filter(entry => new Date(entry.dt_txt).getUTCHours() === 12);
    
        dailyForecasts.forEach((dailyForecast, index) => {
            if (index < forecastDivs.length) {
                const forecastDiv = forecastDivs[index];

                const date = new Date(dailyForecast.dt_txt).toLocaleDateString();
                const day = new Date(dailyForecast.dt_txt).toLocaleDateString(undefined, { weekday: 'long' });
                const temperature = dailyForecast.main.temp;
                const wind = dailyForecast.wind.speed;
                const humidity = dailyForecast.main.humidity;

                forecastDiv.querySelector('.forecast-date').textContent = date;
                forecastDiv.querySelector('h3').textContent = day;
                forecastDiv.querySelector('.forecast-temp').textContent = `${temperature}°F`;
                forecastDiv.querySelector('.forecast-condition').textContent = `${wind} mph`; 
                forecastDiv.querySelector('.forecast-humidity').textContent = `${humidity}%`;

                const iconCode = dailyForecast.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
                const emojiElem = forecastDiv.querySelector('.forecast-emoji');
                emojiElem.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;
            }
        });
    }
});
