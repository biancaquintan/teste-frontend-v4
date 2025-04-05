import EquipmentStateHistory from './components/EquipmentStateHistory'
import Map from './components/Map'
import { useState } from 'react'

function App() {
  const [visible, setVisible] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const showHistory = (id: string) => {
    setSelectedId(id)
    setVisible(true)
  }

  return (
    <div className="bg-slate-300 grid grid-rows-[auto_1fr] h-screen">
      <nav className="text-blue-950 p-4 font-extralight flex items-center">
        <img src="/img/aiko.png" alt="Logo" className="h-10 w-auto mx-2" />
        <span>| Gestão de Equipamentos</span>
      </nav>
      <div className="grid grid-cols-2 grid-rows-1 p-4 mx-5 mb-5 mt-1 bg-white rounded-2xl">
        <div className="flex items-center justify-center">
          {visible && selectedId ? (
            <EquipmentStateHistory
              equipmentId={selectedId}
              clearItem={() => {
                setSelectedId(null)
                setVisible(false)
              }}
            />
          ) : (
            <div className="text-gray-500 italic">
              Selecione um Equipamento no mapa para ver o histórico.
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Map onShowHistory={showHistory} />
        </div>
      </div>
    </div>
  )
}

export default App
