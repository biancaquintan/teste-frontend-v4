import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useState, useEffect } from 'react'

function Map() {
  const gMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: gMapsApiKey
  })

  const center = {
    lat: -3.745,
    lng: -38.523
  }

  type Equipment = {
    equipmentId: string
    positions: { date: string; lat: number; lon: number }[]
  }

  const [equipments, setEquipments] = useState<Equipment[]>([])

  useEffect(() => {
    fetch('/data/equipmentPositionHistory.json')
      .then(res => res.json())
      .then((data: Equipment[]) => setEquipments(data))
      .catch(err => console.error('Erro ao carregar JSON:', err))
  }, [])

  return (
    <div className="w-full h-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ height: '100%' }}
          center={center}
          zoom={5}
        >
          {equipments.map(equipment =>
            equipment.positions.map((pos, index) => (
              <Marker
                key={`${equipment.equipmentId}-${index}`}
                position={{ lat: pos.lat, lng: pos.lon }}
                title={`Equipamento: ${equipment.equipmentId} - ${new Date(
                  pos.date
                ).toLocaleString()}`}
              />
            ))
          )}
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Map
