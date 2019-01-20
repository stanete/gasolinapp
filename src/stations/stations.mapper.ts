import { Injectable } from "@nestjs/common";
import { UuidService } from "../uuid/uuid.service";
import { Fuel } from "../fuels/fuels.entity";
import { Station } from "./stations.entity";
import { Type } from "../types/types.entity";

@Injectable()
export class StationsMapper {
  constructor(private readonly uuidService: UuidService) {}

  toStations(json: any, types: Array<Type>): Array<Station> {
    let jsonArray: Array<any> = json["ListaEESSPrecio"];
    return jsonArray.slice(0, 30).map(json => this.toStation(json, types));
  }

  toStation(json: any, types: Array<Type>): Station {
    let station: Station = new Station();

    station.uuid = this.uuidService.create(json["IDEESS"]);
    station.name = json["Rótulo"];
    station.schedule = json["Horario"];
    station.postalCode = json["C.P."];
    station.address = json["Dirección"];
    station.city = json["Municipio"];
    station.state = json["Provincia"];
    station.latitude = json["Latitud"].replace(",", ".");
    station.longitude = json["Longitud (WGS84)"].replace(",", ".");
    station.point = `POINT(${Number(station.latitude)} ${Number(
      station.longitude
    )})`;
    station.fuels = new Array<Fuel>();

    for (let type of types) {
      if (json["Precio " + type.name]) {
        let fuel = new Fuel();
        fuel.price = Number(json["Precio " + type.name].replace(",", "."));
        fuel.station = station;
        fuel.type = type;
        station.fuels.push(fuel);
      }
    }

    return station;
  }
}
