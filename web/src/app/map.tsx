"use client";

import {APIProvider, Map as GMap} from '@vis.gl/react-google-maps';
import {env} from "@web/env";

export default function Map() {
    return (
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
            <GMap
                style={{width: '100vw', height: '100vh'}}
                defaultCenter={{lat: 12.8797, lng: 121.7740}}
                defaultZoom={7}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    )
}
