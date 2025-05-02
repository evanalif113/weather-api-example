-- SQL script to create the weather database and the weather_data table

-- Create the database
CREATE DATABASE IF NOT EXISTS weather_db;

-- Use the created database
USE weather_db;

-- Create the weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    dew FLOAT NOT NULL,
    rainfall FLOAT NOT NULL,

);