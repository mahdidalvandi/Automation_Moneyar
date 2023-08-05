import React, { useState, useEffect } from "react";
import Image from 'next/image';
import styled from 'styled-components';

const WeatherWidgetWrapper = styled.div`
 
`

const WidgetTitle = styled.div`
    font-size: 16px;
    color: #1f2937;
    margin-top:15px;
`

const IconArea = styled.div`
    padding: 0 0px;
`

const TempText = styled.div`
    font-size: 30px;
    font-weight: bold;
    color: #666;

`

export default function WeatherWidget_Ip() {
    const [weather, setWeather] = useState({});
    useEffect(() => {
        const fetchWeather = async (ip) => {
            try {
                const weatherReq = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=Tehran&appid=85ff03942a87f5498d5cf0822fdb4888`);
                const weatherData = await weatherReq.json();
                setWeather({ icon: <Image src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} width={60} height={60} />, 
                temperature: ('' + weatherData.main.temp).split('.')[0] + "º C" });
            }
            catch {
            }
        };
        fetchWeather('81.29.250.66');
    }, []);
    return (
        <>
            <div className="rcol">
                <WidgetTitle>{weather.temperature}</WidgetTitle>
            </div>
            <div title="تهران" className="col">
                <IconArea>{weather.icon}</IconArea>
            </div>
        </>
    )
}