##################################################################################
# Step 1: Create tables in our database to hold trip info, pickups and dropoffs
#
# DEPRECATED: Initially wrote this to setup the backend. However, quickly found out that 
#             Heroku uses Postgresql so used this to play with data using the SQLite browser.  
#
###################################################################################

import os
import csv
import sqlite3
from datetime import datetime

conn = sqlite3.connect('rides.db')
c = conn.cursor()

# Create table
c.execute('CREATE TABLE trips (TIMESTAMP datetime, MONTH integer, DAY integer, HOUR integer, MINUTE integer, PICKUP_LAT real, PICKUP_LNG real, DROPOFF_LAT real, DROPOFF_LNG real, PICKUP_LOCATION varchar(25), DROPOFF_LOCATION varchar(25))')
c.execute('CREATE TABLE pickups (TIMESTAMP datetime, MONTH integer, DAY integer, HOUR integer, MINUTE integer, PICKUP_LAT real, PICKUP_LNG real, PICKUP_LOCATION varchar(25), TOTAL_PICKUPS integer, PRIMARY KEY (PICKUP_LAT, PICKUP_LNG))')
c.execute('CREATE TABLE dropoffs (TIMESTAMP datetime, MONTH integer, DAY integer, HOUR integer, MINUTE integer, DROPOFF_LAT real, DROPOFF_LNG real, DROPOFF_LOCATION varchar(25), TOTAL_PICKUPS integer, PRIMARY KEY (DROPOFF_LAT, DROPOFF_LNG))')
conn.commit()


# Insert Trip details into Table trips for a given file.
def insert_trips(file_name, conn):
    c = conn.cursor()
    line_num = 0
    pick_up = True
    with open(file_name, 'r') as csv_file:
        reader = csv.reader(csv_file, delimiter=',')

        for row in reader:
            line_num += 1
            # Skip header
            if line_num == 1:
                print("Header row, skipping")
                continue

            if pick_up:
                pick_up = False
                date_object = datetime.strptime(row[0], '%m/%d/%Y %H:%M:%S')
                pickup_lat = float(row[1])
                pickup_lng = float(row[2])
                pickup_location = str(pickup_lat) + ',' + str(pickup_lng)
            else:
                pick_up = True
                drop_off_lat = float(row[1])
                drop_off_lng = float(row[2])
                drop_off_location = str(drop_off_lat) + ',' + str(drop_off_lng)
                trip_tuple = [date_object, date_object.month, date_object.day, date_object.hour, date_object.minute, pickup_lat, pickup_lng, drop_off_lat, drop_off_lng, pickup_location, drop_off_location]

                # This statement will actually insert a single row into the table called trips
                c.execute("INSERT INTO trips VALUES (?,?,?,?,?,?,?,?,?,?,?)", trip_tuple)

        conn.commit()
        print("Done iterating over file contents - the file has been closed now!")

# Iterate through all the csv files in the directory and insert that data into our database
localExtractFilePath = "./RawData/"
for file in os.listdir(localExtractFilePath):
    if file.endswith(".csv"):
        # For each CSV file, call the function insertTrips to store its data to the table trips.
        insert_trips(localExtractFilePath + file, conn)


c = conn.cursor()
cursor = c.execute('INSERT INTO pickups SELECT timestamp, month, day, hour, minute, pickup_lat, pickup_lng, pickup_location, COUNT(pickup_location) as total_pickups FROM Trips GROUP BY pickup_location ORDER BY COUNT(pickup_location) DESC')
cursor = c.execute('INSERT INTO dropoffs SELECT timestamp, month, day, hour, minute, dropoff_lat, dropoff_lng, dropoff_location, COUNT(dropoff_location) as total_dropoffs FROM Trips GROUP BY dropoff_location ORDER BY COUNT(dropoff_location) DESC')
conn.commit()
