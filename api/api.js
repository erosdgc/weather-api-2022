function getData() {
    city = document.getElementById('city_name').value;
    if (city){
        let request = new XMLHttpRequest()

        request.open('GET', `${api_url}current.json?key=${api_key}&q=${city}&aqi=no&lang=en`)

        request.onload = function () {
            let data = JSON.parse(this.response)
            console.log(data)
            if (request.status === 200) {
                set_data_to_div(data);
            } else {
                show_error(data.error.code,data.error.message);
            }
        }
        request.send()
    } else {

    }
    
}
function set_data_to_div(data) {
    clean_error_div()
    clearTimeout(inicializarReloj)
    location_name = data.location.name;
    let location_time = data.location.localtime;
    inicializarReloj(location_time);
    location_region = data.location.region;
    location_tz_id = data.location.tz_id;
    location_wind_kph = data.current.wind_kph;
    location_wind_dir = data.current.wind_dir;
    location_humidity = data.current.humidity;
    location_temp = data.current.temp_c;
    condition = data.current.condition;
    condition_text = condition.text;
    condition_icon = get_icon_name(condition.icon, data.location.localtime);
    
    document.getElementById('response_location_name').innerHTML = location_name;
    document.getElementById('response_location_region').innerHTML = location_region;
    document.getElementById('response_location_tz_id').innerHTML = location_tz_id;
    document.getElementById('response_location_wind_kph').innerHTML = location_wind_kph;
    document.getElementById('response_location_wind_dir').innerHTML = location_wind_dir;
    document.getElementById('response_location_humidity').innerHTML = location_humidity;
    document.getElementById('response_location_temp').innerHTML = location_temp;
    document.getElementById('response_condition_text').innerHTML = condition_text;
    document.getElementById('response_condition_icon').src = condition_icon;
    set_location_of_city_to_map(data.location.lat, data.location.lon);
}

function get_icon_name(icon_url, time) {
    let date_time = new Date(time)
    let hour = date_time.getHours()
    let time_text = (hour > 7 && hour < 20) ? "day" : "night" 

    //icon_url = cdn.weatherapi.com/weather/64x64/night/113.png
    icon = `icons/${time_text}/${icon_url.slice(-7)}`
    return icon;
}


function inicializarReloj(location_time){
    document.getElementById('response_location_time_second').style.display = "inline"
    local_time = new Date(location_time)
    hora = local_time.getHours()
    minuto = local_time.getMinutes()
    document.getElementById('response_location_time_hour').innerHTML =  (hora.toString().length === 1) ? `0${hora}` : hora;
    document.getElementById('response_location_time_minute').innerHTML = (minuto.toString().length === 1) ? `0${minuto}` : minuto;
}
set_seconds()
function set_seconds(){
    segundo = new Date().getSeconds();
    segundo_text = document.getElementById('response_location_time_second').text
    segundo_int = parseInt(segundo_text)
    if (segundo_int === 59) {
        minuto = document.getElementById('response_location_time_minute').text
        if (minuto) {
            minuto_int = parseInt(minuto) + 1
            document.getElementById('response_location_time_minute').innerHTML = (minuto_int.toString().length === 1) ? `0${minuto_int}` : minuto_int;
        }
    }
    document.getElementById('response_location_time_second').innerHTML = (segundo.toString().length === 1) ? `0${segundo}` : segundo;
    setTimeout(`set_seconds()`,1000)
}

function show_error(code,message) {
    error_message = (code === 1006) ? "City not found" : message
    document.getElementById('error_div').innerHTML = error_message;
}

function clean_error_div() {
    document.getElementById('error_div').innerHTML = "";
}

function set_location_of_city_to_map(lat,lon){
    document.getElementById('city_geolocation').src = `https://maps.google.com/maps?q=${lat},${lon}&hl=es&z=5&output=embed`;
}