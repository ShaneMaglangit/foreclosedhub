"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function Page() {
  return (
    <div className="flex-1 flex items-stretch">
      <div className="w-[500px] min-w-0 border-r border-border-primary p-4 flex flex-col gap-4">
        <div>
          <h2 className="font-bold">
            Lot 10-A Blk. 4, Bellet St., Greenview Village, Pamplona Tres
          </h2>
          <h3 className="text-sm">Las Piñas City</h3>
        </div>
        <img src="https://cdn.prod.website-files.com/66f0087ae13342fcc8dfc72f/66f2c8c5b7da5e33d42efb43_Property%20Thumbnail.webp" />
      </div>
      <div className="flex-1 min-w-0 ">
        <APIProvider apiKey="AIzaSyBQ8qZrNZoHLMRzjG6PUvZwJTkxw8T9kCc">
          <Map
            defaultZoom={10}
            defaultCenter={{ lat: 14.60005, lng: 120.98281 }}
            mapTypeId="hybrid"
            fullscreenControl={false}
            mapTypeControl={false}
            streetViewControl={false}
          />
        </APIProvider>
      </div>
    </div>
  );
}
