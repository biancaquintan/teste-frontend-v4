import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStateLegend } from '@/store/stateLegendSlice'
import type { AppDispatch, RootState } from '@/store'

type Equipment = {
  equipmentId: string
  positions: { date: string; lat: number; lon: number }[]
}

type MapProps = {
  onShowHistory: (id: string) => void
}

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
}

function Map({ onShowHistory }: MapProps) {
  const gMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: gMapsApiKey
  })

  const [equipments, setEquipments] = useState<Equipment[]>([])

  const dispatch = useDispatch<AppDispatch>()
  const loadingLegend = useSelector(
    (state: RootState) => state.stateLegend.loading
  )

  useEffect(() => {
    dispatch(fetchStateLegend())
  }, [dispatch])

  useEffect(() => {
    fetch('/data/equipmentPositionHistory.json')
      .then(res => res.json())
      .then((data: Equipment[]) => setEquipments(data))
      .catch(err => console.error('Erro ao carregar JSON:', err))
  }, [])

  return (
    <div className="w-full h-full">
      {loadingLegend && <div>Carregando legenda de estados...</div>}

      {!loadingLegend && isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ height: '100%' }}
          center={defaultCenter}
          zoom={5}
        >
          {equipments.map(equipment => {
            const latestPos = equipment.positions.reduce((a, b) =>
              new Date(a.date) > new Date(b.date) ? a : b
            )

            return (
              <Marker
                key={equipment.equipmentId}
                position={{ lat: latestPos.lat, lng: latestPos.lon }}
                onClick={() => onShowHistory(equipment.equipmentId)}
                title={`Equipamento: ${equipment.equipmentId} - ${new Date(
                  latestPos.date
                ).toLocaleString()}`}
              />
            )
          })}
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Map
