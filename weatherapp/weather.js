const apikey = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=628f2dc2c1d81d9b1020f5dff19c745e"; // API Key-gaaga ku dar halkaan

window.addEventListener("load", async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            let { longitude: lon, latitude: lat } = position.coords;
            await fetchWeatherByCoords(lat, lon);
        });
    }
});

async function fetchWeatherByCoords(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
        let res = await fetch(url);
        let data = await res.json();
        weatherReport(data);
    } catch (err) {
        console.error("Network Error:", err);
    }
}

async function searchByCity() {
    let place = document.getElementById("input").value.trim();
    if (!place) {
        showError("Please enter a city name");
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}&units=metric`;
        let res = await fetch(url);
        let data = await res.json();

        if (data.cod !== 200) {
            showError("City not found!");
            return;
        }

        weatherReport(data);
    } catch (err) {
        console.error("Network Error:", err);
    }

    document.getElementById("input").value = "";
}

function showError(message) {
    let errorDiv = document.getElementById("error-message");
    if (!errorDiv) {
        errorDiv = document.createElement("p");
        errorDiv.id = "error-message";
        errorDiv.style.color = "red";
        document.querySelector(".header").appendChild(errorDiv);
    }
    errorDiv.innerText = message;
}

async function weatherReport(data) {
    document.getElementById("city").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${roundTemp(data.main.temp)} °C`;
    document.getElementById("clouds").innerText = data.weather[0].description;

    document.getElementById("img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}&units=metric`;
    let res = await fetch(urlcast);
    let forecast = await res.json();

    hourForecast(forecast);
    dayForecast(forecast);
}

function hourForecast(forecast) {
    const tempList = document.querySelector(".templist");
    tempList.innerHTML = "";

    forecast.list.slice(0, 5).forEach((item) => {
        let date = new Date(item.dt * 1000);
        let timeString = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        let hourR = document.createElement("div");
        hourR.className = "next";

        let div = document.createElement("div");
        div.innerHTML = `<p class="time">${timeString}</p><p>${roundTemp(item.main.temp_max)} °C / ${roundTemp(item.main.temp_min)} °C</p>`;

        let desc = document.createElement("p");
        desc.className = "desc";
        desc.innerText = item.weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        tempList.appendChild(hourR);
    });
}

function dayForecast(forecast) {
    const weekF = document.querySelector(".weekF");
    weekF.innerHTML = "";

    for (let i = 8; i < forecast.list.length; i += 8) {
        let div = document.createElement("div");
        div.className = "dayF";

        div.innerHTML = `
            <p class="date">${new Date(forecast.list[i].dt * 1000).toDateString()}</p>
            <p>${roundTemp(forecast.list[i].main.temp_max)} °C / ${roundTemp(forecast.list[i].main.temp_min)} °C</p>
            <p class="desc">${forecast.list[i].weather[0].description}</p>
        `;

        weekF.appendChild(div);
    }
}

function roundTemp(temp) {
    return Math.round(temp);
}
