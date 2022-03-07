var searchBtn = document.querySelector("#searchBtn");
var input = document.getElementById("input");
var wrongInput = document.getElementById("wrongInput");

var search = function(){
    // run fetchweather function
    // this will paste information on page too
    fetchWeather(input.value); 
    console.log(input.value);
    saveRecents();
   
}

// "https://api.openweathermap.org/data/2.5/weather?q=denver&units=imperial&appid=05c329d588ef79eaaf88463aa20fdd70")
//  lon: -104.9847
//  lat: 39.7392
//  dt: 1631058227
// https://api.openweathermap.org/data/2.5/onecall?lat=39.7392&lon=-104.9847&dt=1631058227&units=imperial&appid=05c329d588ef79eaaf88463aa20fdd70

var apiKey = "05c329d588ef79eaaf88463aa20fdd70";
    
var fetchWeather = function(city){

    // formating our url 
    // using other variables to insert the city searched and for the apikey 
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey)
    // this requests the url 
    .then(function(response){

        if (response.ok) {
            // turn our information into readable content
            response.json().then(function(data){
                // reads our results 
                grabCoordsAndName(data);
                // if a valid input the wrong input message will hide 
                wrongInput.setAttribute("hidden", true)
            })

        } else {
           // display the message of please insert a valif input 
            wrongInput.removeAttribute("hidden");
            return;
        }   
    })
}



// this grabs the coordinates and uses them to fetch more information 
var grabCoordsAndName = function(data){
    // our grabbed variables from our weather api
    var { lon, lat } = data.coord;
    var { dt, name } = data;
   
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&dt=" + dt + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl).then(function(response){

        response.json().then(function(data){
            // this function will call the rest of our information that we need 
            weatherInformation(data, name);
            forecastSection(data);
        })
    })
}

// uses the coordinates to grab all of our data that we want 
var weatherInformation = function(data, name) {
    // grabs our variables from the API
    var { icon } = data.current.weather[0]
    var { temp, humidity, uvi, wind_speed} = data.current
    var date = moment.unix(1631383200).format("MM/DD/YYYY");
    
    console.log(icon, temp, humidity, uvi, wind_speed, name);

    // conects to the empty div on html
     var currentWeatherEl = document.querySelector("#currentWeather")

    // This replaces our current weather section before pasting new content in it
    currentWeatherEl.innerHTML = "";

     // paste <h2> city name with <span> of date
     var weatherIcon = document.createElement("img")
     weatherIcon.src = "http://openweathermap.org/img/wn/" + icon + ".png";;
     //moment to get daily weather as a <span>

     var cityName = document.createElement("h2")
    cityName.textContent = name + " " + date + " ";
     // do the word temp with tempature
     var cityTemp = document.createElement("h4")
     cityTemp.textContent = "Temp: " + temp + "°F";
     // do the word wind with wind speed 
     var cityWind = document.createElement("h4")
     cityWind.textContent = "Wind: " + wind_speed + " MPH";
     // do the word humidity with huidity 
     var cityHumidity = document.createElement("h4")
     cityHumidity.textContent = "Humidity: " + humidity +"%";

     // uv ray 
     var cityUV = document.createElement("h4")
     cityUV.textContent = "UV index: " + uvi;
     

    // color for the uvi based on uvi number
    if (uvi < 2){
        cityUV.className = "low"
    } else if (uvi === 3 || uvi < 5){
        cityUV.className = "mild"
    } else if (uvi === 6 || uvi === 7){
        cityUV.className = "middle"
    } else if (uvi === 8 || uvi < 10){
        cityUV.className = "bad"
    } else {
        cityUV.className = "hurtfull"
    }
    
    // attacts information to the daily section
    currentWeatherEl.appendChild(cityName)
    currentWeatherEl.appendChild(weatherIcon)
    currentWeatherEl.appendChild(cityTemp);
    currentWeatherEl.appendChild(cityWind);
    currentWeatherEl.appendChild(cityHumidity);
    currentWeatherEl.appendChild(cityUV);

    // calls the forcast function 
    //forecastSection();
}



// Displays the forecast on the page 
var forecastSection = function (data){
    var date = moment.unix(1631383200).format("MM/DD/YYYY")

    // for loops throught the classes
    for(i = 1; i < 6 ; i++){
        console.log(data.daily)
        var { icon } = data.daily[i].weather[0]
        var { temp, humidity, wind_speed, dt} = data.daily[i]

        // moves through our dives with ids Day1 - Day5
        var forecast = document.querySelector("#day" + i )

        // resets out forcast before pasting a new one
        forecast.innerHTML = "";

        // paste for the date
        var weeklyDate = document.createElement("span")
        weeklyDate.textContent = date;
        // paste icon 
        var weatherIcon = document.createElement("img")
        weatherIcon.src = "http://openweathermap.org/img/wn/" + icon + ".png";
        // do the word temp with tempature
        var cityTemp = document.createElement("span")
        cityTemp.textContent = "Temp: " + temp.day + "°F";
        // do the word wind with wind speed 
        var cityWind = document.createElement("span")
        cityWind.textContent = "Wind: " + wind_speed + " MPH";
        // do the word humidity with huidity 
        var cityHumidity = document.createElement("span")
        cityHumidity.textContent = "Humidity: " + humidity +"%";

        // appending our new DOM elements to current days section
        forecast.appendChild(weeklyDate)
        forecast.appendChild(weatherIcon)
        forecast.appendChild(cityTemp)
        forecast.appendChild(cityWind)
        forecast.appendChild(cityHumidity)

    }
}


// array for recent searches 
var recents = JSON.parse(localStorage.getItem("recents")) || [];

// on search click this saves our information into the local storage
var saveRecents = function(){
    // pushing our inputs value to local storage
    recents.push(input.value)
    localStorage.setItem("recents", JSON.stringify(recents));
    console.log(recents)

    // paste our local storage after a search 
    pasteHistory();
}

// paste the local storage to the page 
var pasteHistory = function(){
    // connects to the saved values in array
    var storedRecents = JSON.parse(localStorage.getItem("recents"));
    
    // variable to connect to the page 
    var history = document.getElementById("history")
    history.innerHTML = "";
    // holds our information of the local storage 
    // goes through our local storage
    for (i = 0; i < storedRecents.length; i++){
        //console.log(storedRecents.length[i].name) 
        console.log(storedRecents[i])
        // creates the button that our city name and information will go 
        var recentlyViewed = document.createElement("button");

        // set viewing value 
        recentlyViewed.innerHTML = storedRecents[i];
        recentlyViewed.className = "historyBtn";
        console.log(recentlyViewed.innerHTML)
        
        // puts our local storage on the page 
        history.appendChild(recentlyViewed);
    }
}

var historyDiv = document.getElementById("history")
var RecentBtn = function(event){
    // based on the targeted button click it will run the name inside the button into the fetchweather function
    fetchWeather(event.target.innerHTML)
    input.value = ""
}



// event for the search button 
searchBtn.addEventListener("click", search);
historyDiv.addEventListener("click", RecentBtn);
// want our pasted history to be there when the page loads 
pasteHistory();