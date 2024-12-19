var app = angular.module('weatherApp', []);

app.controller('WeatherController', function($scope, $http) {
    const apiKey = 'ae8294105091afcb9de1696044938a12'; // Replace with your actual OpenWeatherMap API key
    const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    $scope.getWeather = function() {
        if (!$scope.city) {
            $scope.error = "Please enter a city name.";
            $scope.currentWeather = null;
            $scope.forecastWeather = null;
            return;
        }

        // Get current weather
        $http.get(`${currentWeatherUrl}?q=${$scope.city}&units=metric&appid=${'ae8294105091afcb9de1696044938a12'}`)
            .then(function(response) {
                $scope.currentWeather = response.data;
                $scope.error = null;
            })
            .catch(function() {
                $scope.error = "City not found. Please try again.";
                $scope.currentWeather = null;
                $scope.forecastWeather = null;
            });

        // Get 5-day forecast
        $http.get(`${forecastUrl}?q=${$scope.city}&units=metric&appid=${'ae8294105091afcb9de1696044938a12'}`)
            .then(function(response) {
                const forecastList = response.data.list;

                // Filter data to get one entry per day (every 24 hours)
                $scope.forecastWeather = forecastList.filter((item, index) => index % 8 === 0)
                    .map(item => ({
                        date: new Date(item.dt_txt).toLocaleDateString(),
                        temp: item.main.temp,
                        description: item.weather[0].description,
                        icon: item.weather[0].icon
                    }));

                $scope.error = null;
            })
            .catch(function() {
                $scope.error = "Unable to fetch forecast data.";
                $scope.forecastWeather = null;
            });
    };
});
