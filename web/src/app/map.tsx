"use client";

import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {env} from "@web/env";

const defaultZoomLevel = 7
const philippinesCentralCoordinates = {lat: 12.8797, lng: 121.7740}

export default function Map() {
    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <GMap
                className='h-dvh w-dvw'
                defaultCenter={philippinesCentralCoordinates}
                defaultZoom={defaultZoomLevel}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    )
}
