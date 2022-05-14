/**
 * Clase principal para administrar peticiones y datos de la API de Planet
 */
 export default class Planet {

    static api_key = "PLAK5618af7990944f8ea0424c242f75d9fb";
    static url_base = 'https://api.planet.com/data/v1/'

    /**
    * Devuelve los ItemTypes que están disponibles para nuestra clave API:
    */
    static getItemTypes(callback) {

        fetch(Planet.url_base + "item-types", {
            headers: new Headers({
                'Authorization': 'api-key ' + Planet.api_key,
            })
        })
        .then(res => res.json())
        .then(data => callback(data));
    }

    /**
     * Retorna un histograma de fechas para mostrar cuantos elementos coinciden
     * con los filtros de busqueda de imagenes
     */
    static getStats(filters, callback) {

        fetch(Planet.url_base + 'stats', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'api-key ' + Planet.api_key,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(filters)
        })
        .then(res => res.json())
        .then(data => callback(data));
    }

    /**
     * Retorna objetos de metadatos completos sobre los resultados de 
     * una busqueda basada en filtros (mismos filtros que en getStats excepto interval)
     */
    static quickSearch(filters, callback) {

        fetch(Planet.url_base + 'quick-search', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'api-key ' + Planet.api_key,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(filters)
        })
        .then(res => res.json())
        .then(data => callback(data));
    }

}