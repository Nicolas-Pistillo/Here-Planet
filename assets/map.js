import Here from "./classes/Here.js";
import Planet from "./classes/Planet/Planet.js";

/**
 * Resumen de coneptos (Planet School)
 * @link https://developers.planet.com/docs/planetschool/geospatial-data/
 * 
 * Datos geoespaciales: Datos que tienen información de ubicación asociada con cada objeto descrito
 * 
 * Vector: Datos geoespaciales compuestos por puntos, líneas o polígonos: cada punto representa un valor
 * 
 * Ráster: Datos geoespaciales compuestos por píxeles (o celdas de cuadrícula), cada píxel representa un valor
 * 
 * Coordenada: un par de valores (X,Y) utilizados para hacer referencia a un punto en el espacio: 
 * en un GCS (Geographical coordinates system) estos son números long, lat (longitud, latitud)
 * 
 * Sistema coordinado: una forma de representar datos sobre la superficie de la Tierra en una 
 * superficie tridimensional (global), usando grados de latitud y longitud para describir puntos. 
 * También conocido como sistema de coordenadas geográficas (GCS).
 * 
 * Proyección de mapa: una forma de traducir datos tridimensionales en un espacio bidimensional: 
 * las proyecciones son la forma en que aplanamos los datos globales en la superficie de un mapa. 
 * También conocido como sistema de coordenadas proyectadas
 * 
 * Assets: Se denomina en esta api "asset" a los diferentes tipos de opciones de 
 * presentacion de imagenes para sus diferentes casos de uso, entre estas opciones 
 * tenemos algunas con correccion de color para mostrar en la web, y tambien 
 * otras opciones como datos de imagenes sin procesar para fines cientificos
 */

const map = new Here(document.getElementById('map'));

map.setInteractive();

map.setPosition({lat: 19.246536, lng: 32.346987}, 1);

/**
 * Ver qué ItemTypes están disponibles para nuestra clave API:
 */
//Planet.getItemTypes((items) => console.log(items));

/**
 * Obtener área de un punto de interés basado en GeoJSON
 */
const urug_geometry = {
    "type": "Polygon",
        "coordinates": [
          [
            [
              -55.83251953125,
              -34.17999758688083
            ],
            [
              -54.404296875,
              -33.99802726234876
            ],
            [
              -55.39306640625,
              -33.174341551002065
            ],
            [
              -55.83251953125,
              -34.17999758688083
            ]
          ]
        ]
}

/**
 * Filtrar elementos que se superponen con nuestra geometría elegida
 */
const flt_geometria = {
  "type": "GeometryFilter",
  "field_name": "geometry",
  "config": urug_geometry
}

/**
 * filtrar imagenes adquiridas en un rango de fechas determinado
 */ 
const flt_rango_fechas = {
  "type": "DateRangeFilter",
  "field_name": "acquired",
  "config": {
    "gte": "2019-07-01T00:00:00.000Z",
    "lte": "2019-08-01T00:00:00.000Z"
  }
}

/**
 * Filtrar cualquier imagen que tenga mas del 50% de nubosidad
 */ 
const flt_nubosidad = {
  "type": "RangeFilter",
  "field_name": "cloud_cover",
  "config": {
    "lte": 0.5
  }
}

/**
 * Crear el filtro final que combine nuestras configuraciones realizadas,
 * tambien se puede usar un "OrFilter"
 */
const filtros = {
  "type": "AndFilter",
  "config": [flt_geometria, flt_rango_fechas, flt_nubosidad]
}

/**
 * Setear el objecto de parametros que recibira la API de Planet
 */
const api_params = {
  //"interval": "day",
  "item_types": ["REOrthoTile"],
  "filter": filtros
}

/*
console.log("PARAMETROS: ");
console.log(api_params)
*/

/**
 * Enviar la solicitud de estadisticas segun los filtros creados
 */
//Planet.getStats(api_params, (data) => console.log(data));

/**
 * Obtener objetos de metadatos segun los filtros creados
 */
Planet.quickSearch(api_params, (data) => {

  const features = data.features;

  console.log(features[0]);
  console.log('Asset de este resultado: ' + features[0]._links.assets)

  fetch(features[0]._links.assets, {
    headers: new Headers({
      'Authorization': 'api-key ' + "PLAK5618af7990944f8ea0424c242f75d9fb"
    })
  })
  .then(res => res.json())
  .then(data => console.log(data));

});