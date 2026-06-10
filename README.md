Utility Application - Sean Salehin

A full-stack web application for searching utility tickets by area and filters.
It uses React, NestJS, PostgreSQL, PostGIS, Docker, and Leaflet.

Table of Contents

---

## 1. How to Setup and Requirements

## 2. How to Use the App

## 3. Screenshot

## 4. How to Run Tests

## 5. What Was Tested

## 6. Assumptions

## 7. Edge Cases Handled

## 8. Tools Used

## 9. Contact Me


1. How to Setup and Requirements

---

There are three parts to run Utility Application:

A) Using Docker for Database

* Make sure Docker is installed and running.
* Open the main project folder in VS Code or terminal.
* Run docker compose up -d.
* This will start PostgreSQL with PostGIS.
* The database tables and sample data are inside database/data.sql.

B) Using the Backend Server

* Open the server folder in VS Code or another IDE.
* Make sure Node.js is installed.
* Create the local .env file from .env.example.
* Run npm install.
* Run npm run start:dev.
* The backend server will run on http://localhost:3000.

C) Using the Frontend Client

* Open the client folder in VS Code or another IDE.
* Create the local .env file from .env.example.
* Run npm install.
* Run npm run dev.
* The frontend will run on http://localhost:5173.


2. How to Use the App

---

* Open the frontend in the browser.
* Enter a bbox value.
* The bbox format is minLng,minLat,maxLng,maxLat.
* Select status, station code, or utility type if needed.
* Click Search.
* Tickets will show in the table.
* Ticket locations will also show on the map.
* Moving the map updates the bbox input.


3. Screenshot

---

<p align="center">
  <img src="https://i.ibb.co/LXnXDX3P/Screenshot-2026-06-10-110454.jpg" alt="Utility Application" width="850">
</p>


4. How to Run Tests

---

Open the `server` folder and run:

```bash
cd server
npm test
```



5. What Was Tested

---

* Ticket search service.
* Normal bbox search.
* Missing bbox.
* Bad bbox values.
* Frontend search.
* Filters.
* Table results.
* Map markers.
* Bbox update from moving the map.


6. Assumptions

---

* Coordinates use longitude first and latitude second.
* Bbox uses minLng,minLat,maxLng,maxLat.
* Ticket locations are stored as PostGIS points.
* SRID 4326 is used.
* The backend handles the main filtering.
* The frontend only sends the search values and shows the results.


7. Edge Cases Handled

---

* Missing bbox.
* Wrong bbox format.
* Non numeric bbox values.
* Invalid coordinate range.
* Empty search result.
* API error.
* Loading state while searching.


8. Tools Used

---

* React
* TypeScript
* NestJS
* PostgreSQL
* PostGIS
* Docker
* Leaflet


9. Contact Me

---


[sean.salehin@gmail.com](mailto:sean.salehin@gmail.com)

Thank you for your time and feedback. I appreciate your consideration.
