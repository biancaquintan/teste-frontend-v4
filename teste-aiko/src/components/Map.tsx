import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStateLegend } from '@/store/stateLegendSlice'
import type { AppDispatch, RootState } from '@/store'

type Equipment = {
  equipmentId: string
  positions: { date: string; lat: number; lon: number }[]
}

type EquipmentStateHistoryItem = {
  equipmentId: string
  states: { date: string; equipmentStateId: string }[]
}

type MapProps = {
  onShowHistory: (id: string) => void
  selectedEquipmentId: string | null
}

const defaultCenter = {
  lat: -19.0047,
  lng: -45.9622
}

function Map({ onShowHistory, selectedEquipmentId }: MapProps) {
  const gMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [latestStates, setLatestStates] = useState<Record<string, string>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: gMapsApiKey
  })

  const [equipments, setEquipments] = useState<Equipment[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const loadingLegend = useSelector((state: RootState) => state.stateLegend.loading)
  const stateLegend = useSelector((state: RootState) => state.stateLegend.data)

  useEffect(() => {
    dispatch(fetchStateLegend())
  }, [dispatch])

  useEffect(() => {
    fetch('/data/equipmentPositionHistory.json')
      .then(res => res.json())
      .then((data: Equipment[]) => setEquipments(data))
      .catch(err => console.error('Erro ao carregar JSON:', err))
  }, [])

  useEffect(() => {
    fetch('/data/equipmentStateHistory.json')
      .then(res => res.json())
      .then((data: EquipmentStateHistoryItem[]) => {
        const latest: Record<string, string> = {}
        data.forEach(item => {
          if (item.states.length === 0) return
          const last = item.states.reduce((a, b) =>
            new Date(a.date) > new Date(b.date) ? a : b
          )
          latest[item.equipmentId] = last.equipmentStateId
        })
        setLatestStates(latest)
      })
      .catch(err => console.error('Erro ao carregar estados:', err))
  }, [])

  function getDropPinSvgIcon(
    color: string,
    showBorder = false
  ): google.maps.Icon {
    const circleStroke = showBorder ? 'white' : 'none'
    const circleStrokeWidth = showBorder ? 3 : 0

    const svg = `
      <svg width="32" height="48" viewBox="0 -10 50 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="black" flood-opacity="0.4"/>
          </filter>
        </defs>
        <path
          d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48C16 48 32 28 32 16C32 7.16 24.84 0 16 0Z"
          fill="#333"
          filter="url(#dropShadow)"
        />
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="${color}"
          stroke="${circleStroke}"
          stroke-width="${circleStrokeWidth}"
        />
      </svg>
    `.trim()

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(32, 48),
      anchor: new google.maps.Point(16, 48)
    }
  }

  return (
    <div className="w-full h-full relative">
      {loadingLegend && <div>Carregando legenda de estados...</div>}

      {!loadingLegend && isLoaded ? (
        <>
          <GoogleMap
            mapContainerStyle={{ height: '100%' }}
            center={defaultCenter}
            zoom={10}
          >
            {equipments.map(equipment => {
              const latestPos = equipment.positions.reduce((a, b) =>
                new Date(a.date) > new Date(b.date) ? a : b
              )

              const stateId = latestStates[equipment.equipmentId]
              const color = stateId && stateLegend[stateId]?.color

              const isHovered = hoveredId === equipment.equipmentId
              const isSelected = selectedEquipmentId === equipment.equipmentId
              const showBorder = isHovered || isSelected

              const icon = color ? getDropPinSvgIcon(color, showBorder) : undefined
              const animation = isSelected ? google.maps.Animation.BOUNCE : undefined

              return (
                <Marker
                  key={equipment.equipmentId}
                  position={{ lat: latestPos.lat, lng: latestPos.lon }}
                  onClick={() => onShowHistory(equipment.equipmentId)}
                  onMouseOver={() => setHoveredId(equipment.equipmentId)}
                  onMouseOut={() => setHoveredId(null)}
                  icon={icon}
                  animation={animation}
                  title={`Equipamento: ${equipment.equipmentId}`}
                />
              )
            })}
          </GoogleMap>
          {!loadingLegend && (
            <div className="absolute top-22 left-3 bg-white p-5 rounded-xl shadow-lg z-10 w-40 text-sm">
              <h2 className="font-semibold text-gray-700 mb-3">Legenda</h2>
              <ul className="space-y-2">
                {Object.values(stateLegend).map(legend => (
                  <li key={legend.id} className="flex items-center">
                    <span
                      className="w-4 h-4 rounded-full mr-2 border"
                      style={{ backgroundColor: legend.color }}
                    ></span>
                    <span className="text-gray-800">{legend.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

export default Map
