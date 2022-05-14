export default class Here {

    storage_prefix = "here_";
    autocomplete_url = "https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json";
    geocode_url = "https://geocoder.ls.hereapi.com/6.2/geocode.json";

    constructor(map_container) {

        this.platform = new H.service.Platform({
            apikey: '4Fa3h0WioC_q8rN0HCmfnL0WdVIBUei7dzyJcX2GdR0',
        });

        this.defaultLayers = this.platform.createDefaultLayers();

        this.map = new H.Map(
            map_container,
            this.defaultLayers.raster.satellite.map,
            {
                zoom: 10,
                pixelRatio: window.devicePixelRatio || 1,
            }
        );

        this.apiKey = '4Fa3h0WioC_q8rN0HCmfnL0WdVIBUei7dzyJcX2GdR0';

        this.group = new H.map.Group();

        this.map.addObject(this.group);

        this.geoService = this.platform.getSearchService();
    }

    setInteractive() {

        window.addEventListener("resize", () =>
            this.map.getViewPort().resize()
        );

        this.behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(this.map)
        );

        this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers);

        this.ui.getControl("zoom").setAlignment("bottom-left");
        this.ui.getControl("mapsettings").setAlignment("bottom-left");
        this.ui.getControl("scalebar").setAlignment("top-left");

        this.initMarkers();
    }

    initCleanMap() {

        const countryData = this.getCountryData(COUNTRY);

        this.positionMap(countryData.position);
    }

    initMarkers() {

        this.group.addEventListener("tap", (evt) => {

                var markerData = evt.target.getData();

                if (markerData.bubbleData) {

                    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                        content: markerData.bubbleData,
                    });

                    this.ui.addBubble(bubble);

                    if (markerData.bubbleEvent) {

                        bubble.getElement().addEventListener(
                            markerData.bubbleEvent.type,
                            markerData.bubbleEvent.callback
                        );
                    }
                }
        },false
        );
    }

    setPosition(coords, zoom = 10) {

        this.map.setCenter(coords);

        this.map.setZoom(zoom);
    }

    resize() {
        this.map.getViewPort().resize();
    }

    getCountryData(country) {

        const we_countries = {
            Argentina: {
                position: { lat: -34.6083, lng: -58.3712 },
                code: "ARG",
                states: "Buenos Aires,Ciudad de Buenos Aires,Ciudad Autónoma de Buenos Aires",
            },
            Chile: {
                position: { lat: -33.45694, lng: -70.64827 },
                code: "CHL",
                states: "Santiago",
            },
            Colombia: {
                position: { lat: 4.60971, lng: -74.08175 },
                code: "COL",
                states: "Bogotá,Bogota",
            },
        };

        return we_countries[country];
    }

    static currentCountryData() {

        const we_countries = {
            Argentina: {
                name: 'Argentina',
                position: { lat: -34.6083, lng: -58.3712 },
                code: "ARG",
                states: "Buenos Aires,Ciudad de Buenos Aires,Ciudad Autónoma de Buenos Aires",
            },
            Chile: {
                name: 'Chile',
                position: { lat: -33.45694, lng: -70.64827 },
                code: "CHL",
                states: "Santiago",
            },
            Colombia: {
                name: 'Colombia',
                position: { lat: 4.60971, lng: -74.08175 },
                code: "COL",
                states: "Bogotá,Bogota",
            },
        };

        return we_countries[COUNTRY];

    }

    geoSearch(params, callback) {

        return this.geoService.geocode(params, (response) =>
            callback(response)
        );
    }

    /**
     * Filtra los resulltados de una busqueda con el geocoder basandose
     * en el query score mas alto de los resultados
     * @param bool all Si se desea obtener todos los registros posibles
     */
     static filterQueryScore(result, all = false) {

        const posibles = result.items.filter(result => result.scoring.queryScore >= 0.86); 

        if (all) return posibles;

        if (!posibles || posibles.length === 0) return false;

        if (posibles.length === 1) return posibles[0];

        const mejor_resultado = posibles.reduce((acc, current) => {

            return acc = current.scoring.queryScore > acc.scoring.queryScore
                            ? current.scoring.queryScore
                            : acc

        });

        return mejor_resultado;
    }

    searchByLocationId(locationId, callback) {
        const url = this.geocode_url + `?locationid=${locationId}&jsonattributes=1&gen=9&apiKey=${this.apiKey}`;
        $.get(url, res => callback(res));
    }

    autocomplete(search, callback) {

        const queryParams = `?query=${search}&apiKey=${this.apiKey}`;

        $.get(this.autocomplete_url + queryParams, data => callback(data));
    }

    makeMarker(options) {

        if (options.domMarker) {

            var marker = new H.map.DomMarker(options.coords, {
                icon: new H.map.DomIcon(options.html_icon),
            });

        } else var marker = new H.map.Marker(options.coords);

        if (options.center) this.setPosition(options.coords, 15);

        marker.setData({
            bubbleData: options.bubbleData ? options.bubbleData : null,
            bubbleEvent: options.bubbleEvent ? options.bubbleEvent : null,
        });

        this.group.addObject(marker);
    }

    restartMap() {

        this.map.removeObjects(this.map.getObjects());

        this.group = new H.map.Group();

        this.map.addObject(this.group);

        this.initMarkers();
    }

    /***** LocalStorage Utilities *****/

    checkInStorage(key) {

        if (localStorage.getItem(this.storage_prefix + key) != null)
            return true;

        return false;
    }

    getFromStorage(key, isJson = true) {

        if (isJson) 
            return JSON.parse(localStorage.getItem(this.storage_prefix + key));

        return localStorage.getItem(this.storage_prefix + key);
    }

    setInStorage(key, data, returnJson = true) {

        localStorage.setItem(this.storage_prefix + key, data);

        if (returnJson) return this.getFromStorage(key);

        return this.getFromStorage(key, false);
    }

    deleteFromStorage(key) {
        localStorage.removeItem(this.storage_prefix + key);
    }
}
