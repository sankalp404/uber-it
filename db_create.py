from models import *
from datetime import datetime
import os
import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import DATABASE_URL

engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)
session = Session()

# Insert Trip details into model trips for a given file.
def insert_trips(file_name):
    line_num = 0
    pick_up = True
    created = None
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

                point = "SRID=4326; POINT({0} {1})".format(pickup_lng, pickup_lat)
                created = PickUp(geom=point, time=date_object, dropoff=created)
            else:
                pick_up = True
                date_object = datetime.strptime(row[0], '%m/%d/%Y %H:%M:%S')
                drop_off_lat = float(row[1])
                drop_off_lng = float(row[2])

                point = "SRID=4326; POINT({0} {1})".format(drop_off_lng, drop_off_lat)
                created = Dropoff(geom=point, time=date_object)

            session.add(created)
            session.commit()
        print("Done iterating over file contents - the file has been closed now!")

# Iterate through all the csv files in the directory and insert that data into our database
localExtractFilePath = "./rawData/"
for file in os.listdir(localExtractFilePath):
    if file.endswith(".csv"):
        # For each CSV file, call the function insertTrips to store its data to the table trips.
        insert_trips(localExtractFilePath + file)