
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = mapToken;
   
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:'mapbox://styles/mapbox/streets-v12',
        center: coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    const Marker=new mapboxgl.Marker({color:"red"})
    .setLngtLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}))
    .setHTML("<h4>Exact location provided after booking</h4>")
    .addTo(map);

