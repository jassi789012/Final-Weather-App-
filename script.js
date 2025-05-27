const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const cityName = document.querySelector('.country-txt');
const Temp = document.querySelector('.temp-txt');
const WeatherCondition = document.querySelector('.condition-txt');
const Humidity = document.querySelector('.humidity-value-txt');
const Windspeed = document.querySelector('.wind-value-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container');
const forecastItem = document.querySelectorAll('.forecast-item');
const forecastItemDate = document.querySelector('.forecast-item-date');

const weatherSummaryImg = document.querySelector('.weather-summary-img');

const currentDateTxt = document.querySelector('.current-date-txt');

// const apiKey = "f36ee1e8d9a68c0eaed1d50ad204ca92";
const apiKey = '955a2004811645628f433940252705';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    } 
})

cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})


async function getFetchData(city){
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`);

    if (!response.ok) {
        showDisplaySection(notFoundSection);
        return;
    }
   
    const data = await response.json();
   
    return data;
}


function getCurrentDate() {
    const currentDate = new Date();

    let day = currentDate.toLocaleString('en-US', { weekday: 'short' });
    
    let date = currentDate.toLocaleString('en-US', { day: '2-digit' });

    let month = currentDate.toLocaleString('en-US', { month: 'short' });

    return `${day}, ${date} ${month}`;

}


function getNextSixDaysArray() {
    const result = [];
    const today = new Date();

    for (let i = 1; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });

        result.push(`${day} ${month}`);
    }

    return result;
}



async function updateWeatherInfo(city){
    const weatherData = await getFetchData(city);
    
    

    console.log(weatherData);


    cityName.innerHTML = weatherData.location.name;
    Temp.innerHTML = Math.round(weatherData.current.temp_c) + ' °C';
    WeatherCondition.innerHTML = weatherData.current.condition.text;
    Humidity.innerHTML = weatherData.current.humidity + ' %';
    Windspeed.innerHTML = weatherData.current.wind_mph + ' mph';

    currentDateTxt.innerHTML = getCurrentDate();

    const iconUrl = weatherData.current.condition.icon;
    weatherSummaryImg.src = `${iconUrl}`;

    
    const sixDays = getNextSixDaysArray();


     forecastItem.forEach((day, index) => {

        const currentUrl = weatherData.forecast.forecastday[index].day.condition.icon;

        day.innerHTML = `
                <h5 class="forecast-item-date regular-txt">${sixDays[index]}</h5>
                <img src="${currentUrl}" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(weatherData.forecast.forecastday[index].day.avgtemp_c)} °C</h5>`;
        });


    showDisplaySection(weatherInfoSection);
}


function showDisplaySection(activeSection) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none');

    activeSection.style.display = 'flex';
}
