# uber-it

An app that

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

# Approach

From the onset, I wanted to create an extremely intutive and user-friendly app. The goal is to keep the user engaged by keeping it a single page app and interating with the user using just the map, filters and different markers. The markers will be ideal for displaying more information about the location through geocoding. The app needed to be responsive on all device types, be able to render complex data while remaining elegant

My immediate plan of action was to write the backend using python and wire it up with React.js for the frontend. I have not worked with either professionally before and I knew that this was going to be a journey.

I began by brushing up on my python. And, to get a feel for the data I was working with, I wrote a script with sqlite3 to import the csv files into a database. I, then did a few queries in a DB visualizer and quickly found out that most pickups and dropoffs happen to be the city's two busy airports. Ahaa.. no surprise there but I could still get some interesting facts from these tables.

Next, I made myself familiar with Google Map's JS APIv3. After that, I took couple courses on react and redux on Udemy. Just as I was getting done with react, I found a neat video series by the Google Developer's team on their api. This, gave me several ideas of how I would like a person to interact with the app. I

The app would start with five custom markers, with one of them showing its info-window(The info-window will show the street view of that location using its geolocation and interesting piece of information about that place). These markers will shuffle-show their info windows till the time a person takes over. The person will have the option to filter by date and time, pickups/dropoffs, pickup/dropoff heatmaps and common routes. Heatmaps will show on the entire map for the entire dataset using a weighted table. Pickups/dropoffs and best route will be shown within the area drawn by the user. The app will have 2 drawing options: rectangle and ploygon (may be a circle?). Once an overlay is drawn, the 5 pickups and 5 dropoffs markers will appear on the screen. ...
//todo


# Design Decisions


//todo







## Todos
- Wire up the front end for heatmaps. I have a backend API available to support such request.
- Change from AM/PM to sliders for time selection since the backend is designed to handle such requests.
- I had initially planned on five markers for the home screen when the app is first loaded,
  these markers will shuffle between JFK, LaGuardia, Ground Zero, Madison Square Garden and Museum of Modern Arts,
  along with a couple fun facts about these places along with using Google's street view service to make it more interactive.
- I also want to fancyify the location markers on click but restrictions in the plugin have forced me to show only text.
- Lastly, I am going to wire up my backend to googlemaps to show most popular routes for selected area.

## What I would have done differently?
- Not relied heavily on the google maps react plugin for my the app.
- Considering the time constraint it seemed to be a great alternative at first, but as my code grew, the side-effects of a third-party  wrapper imposed considerable roadblocks.

### Special Thanks:
A special thanks to the AirBnB team for making a timely fix in their react-dates plugin and to an array of global developers online whose hair I have pulled for the last week
