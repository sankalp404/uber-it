# import the Flask class from the flask module
from flask import Flask, render_template, request, jsonify,send_from_directory
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from models import PickUp, Dropoff
from sqlalchemy.sql import func
import os

DATABASE_URL = os.environ.get('DATABASE_URL')

# create the application object
app = Flask(__name__)
engine = create_engine(DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)
session = Session()


# use decorators to link the function to a url
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/public/<path:path>')
def send_public(path):
    return send_from_directory('public',path)

def get_start_time_from_args(request):
    start_date = request.args['start_day']
    start_hour = request.args['start_hour']
    start_min = request.args['start_min']

    return datetime.strptime('{0} {1}:{2}'.format(
        start_date, start_hour, start_min
    ), "%d/%m/%Y %H:%M")


def get_end_time_from_args(request):
    end_date = request.args['end_day']
    end_hour = request.args['end_hour']
    end_min = request.args['end_min']

    return datetime.strptime('{0} {1}:{2}'.format(
        end_date, end_hour, end_min
    ), "%d/%m/%Y %H:%M")


# request will contain start date, end date, start hour, end hour, start minute, end minute
# return will be JSON of the fromat { {lat:lat_value, lng:lng_value, weight:total_pickups },...,..}
# Also would want to restrict the response to a max 50,000 rows
@app.route('/allpickups', methods=['GET'])
def get_pickups():
    start_time = get_start_time_from_args(request)
    end_time = get_end_time_from_args(request)

    pickups = session.query(
        func.count(PickUp.geom).label('count'),
        func.ST_AsText(PickUp.geom)
    ).filter(
        PickUp.time.between(
            start_time, end_time
        )
    ).group_by(PickUp.geom).order_by('count').limit(30000)

    total = pickups.count()
    outputs = []
    # get total number of pickups we have in this range
    for pickup in pickups:
        lng, lat = pickup[1][6:-1].split(" ")
        avg = float(pickup[0]*1000)/float(total)
        outputs.append({
            'lat': lat, 'lng': lng, 'avg': avg
        })

    return jsonify(outputs = outputs)

@app.route('/alldropoffs', methods=['GET'])
def get_dropoffs():
    start_time = get_start_time_from_args(request)
    end_time = get_end_time_from_args(request)

    dropoffs = session.query(
        func.count(Dropoff.geom).label('count'),
        func.ST_AsText(Dropoff.geom)
    ).filter(
        Dropoff.time.between(
            start_time, end_time
        )
    ).group_by(Dropoff.geom).order_by('count').limit(30000)

    total = dropoffs.count()
    outputs = []
    # get total number of pickups we have in this range
    for dropoff in dropoffs:
        lng, lat = dropoff[1][6:-1].split(" ")
        avg = float(dropoff[0]*1000)/float(total)
        outputs.append({
            'lat': lat, 'lng': lng, 'avg': avg
        })

    return jsonify(outputs = outputs)


@app.route('/pickups', methods=['GET'])
def get_pickup_bounded():
    '''
    Get pickup from the given request
    which has coordinates of a POLYGON
    '''
    start_time = get_start_time_from_args(request)
    end_time = get_end_time_from_args(request)

    lats = request.args['lats'].split(",")
    lngs = request.args['lngs'].split(",")

    if len(lats) < 2 or len(lngs) < 2:
        placed = session.query(
            func.count(PickUp.geom).label('count'),
            func.ST_AsText(PickUp.geom)
        ).filter(
            PickUp.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).order_by('count desc').limit(50)
    elif len(lats) == 2 or len(lngs) == 2:
        placed = session.query(
            func.count(PickUp.geom).label('count'),
            func.ST_AsText(PickUp.geom)
        ).filter(
            func.ST_Within(
                PickUp.geom, func.ST_MakeEnvelope(
                    lngs[1], lats[1], lngs[0], lats[0], 4326
                )
            )
        ).filter(
            PickUp.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).order_by('count desc').limit(5)
    else:
        # Get the longitude and latitudes in a queriable format
        final = ''
        for i in range(0, len(lats)):
            final += '{0} {1},'.format(lngs[i], lats[i])

        final += '{0} {1},'.format(lngs[0], lats[0])

        fstr = 'SRID=4326; POLYGON(({0}))'.format(final[:-1])

        placed = session.query(
            func.count(PickUp.geom).label('count'),
            func.ST_AsText(PickUp.geom)
        ).filter(
            func.ST_Within(PickUp.geom, fstr)
        ).filter(
            PickUp.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).order_by('count desc').limit(50)

    outputs = []

    for plc in placed:
        lng, lat = plc[1][6:-1].split(" ")
        outputs.append({
            'lat': lat, 'lng': lng, 'count': plc[0]
        })

    return jsonify(outputs = outputs)


@app.route('/dropoffs', methods=['GET'])
def get_dropoff_bounded():
    '''
    Get pickup from the given request
    which has coordinates of a POLYGON
    '''
    start_time = get_start_time_from_args(request)
    end_time = get_end_time_from_args(request)

    lats = request.args['lats'].split(",")
    lngs = request.args['lngs'].split(",")

    if len(lats) < 2 or len(lngs) < 2:
        placed = session.query(
            func.count(Dropoff.geom).label('count'),
            func.ST_AsText(Dropoff.geom)
        ).filter(
            Dropoff.time.between(
                start_time, end_time
            )
        ).group_by(Dropoff.geom).order_by('count desc').limit(50)
            # Get the longitude and latitudes in a queriable format
    elif len(lats) == 2 or len(lngs) == 2:
        placed = session.query(
            func.count(Dropoff.geom).label('count'),
            func.ST_AsText(Dropoff.geom)
        ).filter(
            func.ST_Within(
                Dropoff.geom, func.ST_MakeEnvelope(
                    lngs[1], lats[1], lngs[0], lats[0], 4326
                )
            )
        ).filter(
            Dropoff.time.between(
                start_time, end_time
            )
        ).group_by(Dropoff.geom).order_by('count desc').limit(5)
    else:
        # Get the longitude and latitudes in a queriable format
        final = ''
        for i in range(0, len(lats)):
            final += '{0} {1},'.format(lngs[i], lats[i])

        final += '{0} {1},'.format(lngs[0], lats[0])

        fstr = 'SRID=4326; POLYGON(({0}))'.format(final[:-1])

        placed = session.query(
            func.count(Dropoff.geom).label('count'),
            func.ST_AsText(Dropoff.geom)
        ).filter(
            func.ST_Within(Dropoff.geom, fstr)
        ).filter(
            Dropoff.time.between(
                start_time, end_time
            )
        ).group_by(Dropoff.geom).order_by('count desc').limit(50)

    outputs = []

    for plc in placed:
        lng, lat = plc[1][6:-1].split(" ")
        outputs.append({
            'lat': lat, 'lng': lng, 'count': plc[0]
        })

    return jsonify(outputs = outputs)


@app.route('/route', methods=['GET'])
def get_route():
    start_time = get_start_time_from_args(request)
    end_time = get_end_time_from_args(request)

    lats = request.args['lats'].split(",")
    lngs = request.args['lngs'].split(",")

    if len(lats) < 2 or len(lngs) < 2:
        placed = session.query(
            func.ST_AsText(PickUp.geom),
            func.ST_AsText(Dropoff.geom),
            func.count(PickUp.geom).label('count')
        ).join(PickUp.dropoff).filter(
            PickUp.time.between(
                start_time, end_time
            )
        ).filter(
            Dropoff.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).group_by(Dropoff.geom).order_by(
            'count desc'
        ).limit(5)
    elif len(lats) == 2 or len(lngs) == 2:
        placed = session.query(
            func.ST_AsText(PickUp.geom),
            func.ST_AsText(Dropoff.geom),
            func.count(PickUp.geom).label('count'),
        ).join(PickUp.dropoff).filter(
            # geography filter
            func.ST_Within(
                Dropoff.geom, func.ST_MakeEnvelope(
                    lngs[1], lats[1], lngs[0], lats[0], 4326
                )
            )
        ).filter(
            # geography filter
            func.ST_Within(
                PickUp.geom, func.ST_MakeEnvelope(
                    lngs[1], lats[1], lngs[0], lats[0], 4326
                )
            )
        ).filter(
            # dropoff time filter
            Dropoff.time.between(
                start_time, end_time
            )
        ).filter(
            # pickup time filter
            PickUp.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).group_by(Dropoff.geom).order_by(
            'count desc'
        ).limit(1)
    else:
        # Get the longitude and latitudes in a queriable format
        final = ''
        for i in range(0, len(lats)):
            final += '{0} {1},'.format(lngs[i], lats[i])

        final += '{0} {1},'.format(lngs[0], lats[0])

        fstr = 'SRID=4326; POLYGON(({0}))'.format(final[:-1])

        placed = session.query(
            func.ST_AsText(PickUp.geom),
            func.ST_AsText(Dropoff.geom),
            func.count(PickUp.geom).label('count'),
        ).join(PickUp.dropoff).filter(
            # geography filter
            func.ST_Within(PickUp.geom, fstr)
        ).filter(
            # geography filter
            func.ST_Within(Dropoff.geom, fstr)
        ).filter(
            # dropoff time filter
            Dropoff.time.between(
                start_time, end_time
            )
        ).filter(
            # pickup time filter
            PickUp.time.between(
                start_time, end_time
            )
        ).group_by(PickUp.geom).group_by(Dropoff.geom).order_by(
            'count desc'
        ).limit(1)

    outputs = []
    for plc in placed:
        pickup_lng, pickup_lat = plc[0][6:-1].split(" ")
        dropoff_lng, dropoff_lat = plc[1][6:-1].split(" ")

        outputs.append({
            'pickup_lat': pickup_lat, 'pickup_lng': pickup_lng, 'count': plc[2],
            'dropoff_lat': dropoff_lat, 'dropoff_lng': dropoff_lng
        })

    return jsonify(outputs = outputs)

# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True)
