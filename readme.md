# uber-it

An app that

## Requirements
- Python 2.7
- NodeJS / NPM
- virtualenv package (from pip)
- [PostgreSQL](https://www.postgresql.org))
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
=======
>> virtualenv venv

>> venv\Scripts\activate

>> python create_delete_db.py

Now that you have initialized the database with tables, populate them using the raw data

>> python db_create.py

>> python app.py


Next we will install the Node modules.

$ npm install

$ npm start

- You are now ready to explore the app at http://localhost:5000

# Approach

From the onset, I wanted to create an extremely intutive and user-friendly app. I wanted to keep the user engaged by keep it a single page app and make the interation with the user using just the map, filters and different markers. I would have ideally liked markers would more information about the location using reverse geocoding. The app had to be responsive on all device types, simple and not just puke out data.

# Design Decisions

## Todos
- Wire up the front end for heatmaps. I have a backend API available to support such request.
- Change from AM/PM to sliders for time selection since the backend is designed to handle such requests.
- I had initially planned on five markers for the home screen when the app is first loaded,
  these markers will shuffle between JFK, LaGuardia, Ground Zero, Madison Square Garden and Museum of Modern Arts,
  along with a couple fun facts about these places along with using Google's street view service to make it more interactive.
- I also want to fancyify the location markers on click but restrictions in the plugin has forced me to show only text.
- Lastly, I am going to wire up my backend to googlemaps to show most popular routes for selected area.

## What I would have done differently?
- Not relied heavily on the google maps react plugin for my the app.
- Considering the time constraint it seemed to be a great alternative at first, but as my code grew, the side-effects of a third-party  wrapper imposed considerable roadblocks.

### Special Thanks:
A special thanks to the AirBnB team for making a timely fix in their react-dates plugin and to an array of global developers online whose hair I have pulled for the last week

