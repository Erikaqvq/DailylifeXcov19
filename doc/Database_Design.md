  CREATE TABLE City (
    CityId INT PRIMARY KEY,
    City VARCHAR(255),
    lat REAL,
    lng REAL,
    Country VARCHAR(255),
    iso2 VARCHAR(255),
    iso3 VARCHAR(255),
    capital VARCHAR(255),
    population VARCHAR(255),
    uid INT
  );
  
 CREATE TABLE Article (
    ArticleId INT PRIMARY KEY,
    Date DATETIME,
    Author VARCHAR(255),
    Title VARCHAR(255),
    Year VARCHAR(255),
    Journal VARCHAR(255),
    Volume VARCHAR(255),
    Issue VARCHAR(255),
    DOI VARCHAR(255),
    URL VARCHAR(255),
    DB VARCHAR(255),
    language VARCHAR(255),
    keyword VARCHAR(255)
  );
  
  CREATE TABLE Vaccination (
    VacId INT PRIMARY KEY,
    VacName VARCHAR(255),
    ProductName VARCHAR(255),
    Company VARCHAR(255),
    AuDate VARCHAR(255),
    StDate VARCHAR(255),
    Source VARCHAR(255)
  );
  
CREATE TABLE Dailydata (
  Data_ID INT PRIMARY KEY,
  Date DATETIME,
  Country_code VARCHAR(255),
  Country VARCHAR(255),
  WHO_region VARCHAR(255),
  New_cases INT,
  Cum_cases INT,
  New_deaths INT, 
  Cum_deaths INT
);
  
  
