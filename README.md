# uber-it

A web app that allows users to explore how Uber is changing the cab industry and why the New Yorkers love it!

## Requirements
- Python 2.7
- NodeJS / NPM
- virtualenv package (from pip)
- [PostgreSQL](https://www.postgresql.org)       
- [PostGIS](http://postgis.net/) add-on that comes with PostgreSQL

## Deploying Locally
- Install PostgreSQL
- While installing PostGIS you can create a spatial database.
- After creating you the database, you would want to create a PostGIS extension

```
CREATE EXTENSION postgis;
```

> virtualenv venv

> venv\Scripts\activate

> python create_delete_db.py

Now that you have initialized the database with tables, populate them using the raw data

> python db_create.py

> python app.py


Next, we will install the Node modules.

$ npm install

$ npm start

- You are now ready to explore the app at http://localhost:5000

# Features

##### Shows google map view of most common pickups and dropoffs in NYC.
##### App starts with intro shuffling through major landmarks in NYC and a tiny info window.

..

The user will then have an option to filter by date and time, pickups/dropoffs, pickup/dropoff heatmaps and common routes. Heatmaps are for the entire map and use the complete dataset in the form of a weighted table. Pickups/dropoffs and common routes are shown within the area drawn by the user. The app has 2 drawing options: rectangle and polygon. Once an overlay is drawn, the app zooms in on the area and show the 5 most common pickups and dropoffs for the area along with a single most common route within the confines. The markers with the most pickups and dropoffs have their info-windows open by default.

# Design Decisions

The app utilizes the Flask web framework. Flask is a micro-framework with little no dependencies to external libraries while being extremely extensible at the same time. Since, Flask does not include a database abstraction layer by default, the decision was left to me.

 I was initially using SQLite for my database but since Heroku supports PostgreSQL, I knew I had to change my chosen database. I also chose SQLAlchemy as the Object Relational Mapper - thus allowing the object model and database schema to develop in a clean decoupled way from the beginning.

Using this, I was able to define my model and store my csv data into the database. I  initially used the model of trips, pickups and dropoffs and was storing lat, lng in separate columns for faster queries. This was however, not very efficient for what I was trying to accomplish.

I soon realized that to do the kind of queries I was I needed something more powerful that could assist me querying data involving latitudes and longitudes. Enter PostGIS, a spatial database extender for PostgreSQL. It adds support for geographic objects allowing location queries to be run easily. Using GeoAlchemy2, an extension for SQLAlchemy, I was able to offload a lot of my work by creating a spatial database using postgis.

### My web service routes are:

/pickups: The 5 most pickups for a selected region (default: 5 most pickups for the entire area)

/dropoffs: This used the same idea as above but for dropoffs

/route: The most common route for a given selection. (default: 5 most common routes in the entire map).

This was accomplished by finding the most common pickup/dropoff pairs for an area.

/allpickups and /alldropoffs

These return a weighted table for creating heatmaps.

## Todos
- Wire up the front end for heatmaps. Backend API available to support such request.
- Change from AM/PM to sliders for time selection since the backend is designed to handle such requests.
- I had initially planned on five markers for the home screen when the app is first loaded,
  these markers will shuffle between JFK, LaGuardia, Ground Zero, Madison Square Garden and Museum of Modern Arts,
  along with a couple fun facts about these places along with using Google's street view service to make it more interactive.
- I also want to fancyify the location markers on click but restrictions in the plugin have forced me to show only text.
- Lastly, I am going to wire up my backend to googlemaps to show most popular routes for selected area.

### Special Thanks:
A special thanks to the AirBnB team for helping make a fix in their [react-dates plugin](https://github.com/airbnb/react-dates)
