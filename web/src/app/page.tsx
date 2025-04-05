import Image from "next/image";

export default async function Page() {
    const resp = await fetch(process.env.GQL_ENDPOINT ?? '', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                {
                    listings {
                        id
                        source
                        externalId
                        address
                        floorArea
                        price
                    }
                } 
            `
        })
    })

    const jsonData = await resp.json()
    const listings = jsonData['data']['listings']
    return (
        <ul>
            {listings.map((listing) => (
                <li key={listing.id}>{listing.address}</li>
            ))}
        </ul>
    )
}