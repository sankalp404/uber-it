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
>>> virtualenv venv
>>> venv\Scripts\activate
>>> python create_delete_db.py

## Now that you have initialized the database with tables populate it using the raw data
>>> python db_create.py
>>> python app.py

## Next we will install the Node modules.

$ npm install
$ npm start

##  You are now ready to explore the app at http://localhost:5000
