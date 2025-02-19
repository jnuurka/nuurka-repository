const apikey = "YOURAPI"; // Bedel "YOURAPI" adigoo isticmaalaya API Key-gaaga saxda ah.

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    weatherReport(data);
                })
                .catch((err) => console.error("Network Error:", err));
        });
    }
});

function searchByCity() {
    var place = document.getElementById("input").value.trim();
    if (place === "") {
        alert("Please enter a city name");
        return;
    }

    var urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}&units=metric`;

    fetch(urlsearch)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod !== 200) {
                alert("City not found!");
                return;
            }
            weatherReport(data);
        })
        .catch((err) => console.error("Network Error:", err));

    document.getElementById("input").value = "";
}

function weatherReport(data) {
    document.getElementById("city").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${Math.floor(data.main.temp)} °C`;
    document.getElementById("clouds").innerText = data.weather[0].description;

    let icon = data.weather[0].icon;
    let iconurl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("img").src = iconurl;

    var urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}&units=metric`;

    fetch(urlcast)
        .then((res) => res.json())
        .then((forecast) => {
            hourForecast(forecast);
            dayForecast(forecast);
        });
}

function hourForecast(forecast) {
    document.querySelector(".templist").innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let date = new Date(forecast.list[i].dt * 1000);
        let timeString = date.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        let hourR = document.createElement("div");
        hourR.setAttribute("class", "next");

        let div = document.createElement("div");
        let time = document.createElement("p");
        time.setAttribute("class", "time");
        time.innerText = timeString;

        let temp = document.createElement("p");
        temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C / ${Math.floor(forecast.list[i].main.temp_min)} °C`;

        div.appendChild(time);
        div.appendChild(temp);

        let desc = document.createElement("p");
        desc.setAttribute("class", "desc");
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector(".templist").appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector(".weekF").innerHTML = "";

    for (let i = 8; i < forecast.list.length; i += 8) {
        let div = document.createElement("div");
        div.setAttribute("class", "dayF");

        let day = document.createElement("p");
        day.setAttribute("class", "date");
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString();

        let temp = document.createElement("p");
        temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C / ${Math.floor(forecast.list[i].main.temp_min)} °C`;

        let description = document.createElement("p");
        description.setAttribute("class", "desc");
        description.innerText = forecast.list[i].weather[0].description;

        div.appendChild(day);
        div.appendChild(temp);
        div.appendChild(description);

        document.querySelector(".weekF").appendChild(div);
    }
}
