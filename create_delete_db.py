from models import *
from sqlalchemy import create_engine
from app import DATABASE_URL

engine = create_engine(DATABASE_URL)


Dropoff.__table__.drop(engine)
PickUp.__table__.drop(engine)

Dropoff.__table__.create(engine)
PickUp.__table__.create(engine)