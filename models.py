from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship


Base = declarative_base()

class Dropoff(Base):
    __tablename__ = "dropoff"
    id = Column(Integer, primary_key=True)
    geom = Column(
        Geometry(geometry_type='POINT', srid=4326)
    )
    time = Column(DateTime)
    total_dropoffs = Column(Integer)

    def __repr__(self):
        return '<total_dropoffs %r>' % self.total_dropoffs


# PickUp model that contains the location and the number of pickups
class PickUp(Base):
    __tablename__ = "pickup"
    id = Column(Integer, primary_key=True)
    geom = Column(
        Geometry(geometry_type='POINT', srid=4326)
    )
    time = Column(DateTime)
    total_pickups = Column(Integer)
    dropoff_id = Column(Integer, ForeignKey('dropoff.id'))
    dropoff = relationship(Dropoff, backref="pickup")

    def __repr__(self):
        return '<total_pickups %r>' % self.total_pickups


## to set up the tables
# python
# from models import *
# from sqlalchemy import create_engine
# engine = create_engine('postgresql://postgres:postgres@localhost/uber')
# Dropoff.__table__.create(engine)
# PickUp.__table__.create(engine)
# python db_Create.py
# python app.py

# heroku run python
# execfile("create_delete_db.py")
# execfile("db_create.py")
