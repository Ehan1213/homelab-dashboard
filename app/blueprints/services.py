from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from sqlalchemy.exc import OperationalError
from utils.pydantic import ValidateCheck, ValidateService

from app.models import Check, Service, db

services = Blueprint("service", __name__)


@services.route("/services", methods=["GET", "POST"])
def services_list():
    if request.method == "GET":
        try:
            services = db.session.execute(db.select(Service)).scalars()
            return jsonify([service.to_dict() for service in services]), 200
        except OperationalError as err:
            return jsonify(error=str(err)), 503

    if request.method == "POST":
        data = request.get_json(silent=True)
        if data is None:
            return jsonify("Malformed JSON"), 400

        try:
            validated = ValidateService(**data)
        except ValidationError:
            return jsonify("Malformed JSON"), 400

        service = Service(
            name=validated.name,
            url=validated.url,
            check_interval_seconds=validated.check_interval_seconds,
        )
        db.session.add(service)
        db.session.commit()
        return jsonify(service.to_dict()), 201


@services.route("/services/<uuid:service_id>", methods=["GET"])
def service_by_id(service_id):
    service = db.get_or_404(Service, service_id)
    return jsonify(service.to_dict())


@services.route(
    "/services/<uuid:service_id>/checks",
    methods=["GET", "POST"],
)
def checks_by_id(service_id):
    if request.method == "GET":
        # check if service exists before further querying
        db.get_or_404(Service, service_id)
        try:
            checks = db.session.execute(
                db.select(Check)
                .where(Check.service_id == service_id)
                .order_by(Check.created_at)
            ).scalars()
            return jsonify([check.to_dict() for check in checks]), 200
        except OperationalError as err:
            return jsonify(error=str(err)), 503

    if request.method == "POST":
        data = request.get_json(silent=True)
        if data is None:
            return jsonify(ValidationError.errors()), 400

        try:
            validated = ValidateCheck(**data)
        except ValidationError:
            return jsonify(ValidationError.errors()), 400

        check = Check(
            status=validated.status,
            response_time=validated.response_time,
            service_id=service_id,
        )
        db.session.add(check)
        db.session.commit()
        return jsonify(check.to_dict()), 201
