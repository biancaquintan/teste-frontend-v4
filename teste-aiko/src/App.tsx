import Map from './components/Map'

function App() {
  return (
    <div className="bg-slate-300 grid grid-rows-[auto_1fr] h-screen">
      <nav className="text-blue-950 p-4 font-extralight flex items-center">
        <img src="/img/aiko.png" alt="Logo" className="h-10 w-auto mx-2" />
        <span>| Gestão de Equipamentos</span>
      </nav>
      <div className="grid grid-cols-2 grid-rows-1 p-4 mx-5 mb-5 mt-1 bg-amber-50 rounded-2xl">
        <div className="flex items-center justify-center"></div>
        <div className="flex items-center justify-center">
          <Map />
        </div>
      </div>
    </div>
  )
}

export default App
