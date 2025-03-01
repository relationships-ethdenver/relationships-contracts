"use client"

import { useState } from "react"
import { Info, ArrowUpRight } from "lucide-react"
import BuildShipModal from "./components/build-ship-modal"

export default function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("ships")
  const [hasShips, setHasShips] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"build" | "create">("build")

  // Sample ship data
  const ships = [
    { id: "#1", hash: "hash1", name: "RWAName1" },
    { id: "#2", hash: "hash2", name: "RWAName1" },
    { id: "#3", hash: "hash3", name: "RWAName1" },
  ]

  const handleConnectWallet = () => {
    setIsConnected(true)
  }

  const openBuildModal = () => {
    setModalType("build")
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setModalType("create")
    setIsModalOpen(true)
  }

  const handleBuild = (name: string, initialState: "ON" | "OFF") => {
    console.log("Building ship:", { name, initialState })
    setIsModalOpen(false)
    setHasShips(true)
  }

  // Update the ships tab content to show either the empty state or the ships table
  const renderShipsContent = () => {
    if (!hasShips) {
      return (
        <div className="w-full space-y-4">
          <div className="bg-white/30 backdrop-blur-sm h-12 rounded-full"></div>

          <h2 className="text-3xl font-bold text-center text-gray-900">ohhh... it seems you don't own any ships!</h2>

          <div className="flex justify-center py-6">
            <div className="relative w-32 h-32">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-700 transform rotate-45 rounded-sm"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-blue-600 transform -rotate-[10deg] rounded-tr-lg rounded-br-lg"></div>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-sm h-12 rounded-full"></div>
          <div className="bg-white/30 backdrop-blur-sm h-12 rounded-full"></div>
        </div>
      )
    }

    return (
      <div className="w-full space-y-8">
        <div className="bg-blue-300/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-400/50">
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">Vault1</th>
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">ON / OFF</th>
                <th className="text-left py-4 px-6 text-xl font-bold text-gray-900">0x</th>
                <th className="py-4 px-2"></th>
                <th className="py-4 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship, index) => (
                <tr key={index} className="hover:bg-blue-400/20 transition-colors">
                  <td className="py-4 px-6 text-lg font-medium">{ship.id}</td>
                  <td className="py-4 px-6 text-lg font-medium text-red-500">{ship.hash}</td>
                  <td className="py-4 px-6 text-lg font-medium">{ship.name}</td>
                  <td className="py-4 px-2">
                    <button className="p-2 rounded-full bg-blue-400/30 hover:bg-blue-400/50 transition-colors">
                      <Info size={20} />
                    </button>
                  </td>
                  <td className="py-4 px-2">
                    <button className="p-2 rounded-full bg-blue-400/30 hover:bg-blue-400/50 transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Do you want another Ship?</h2>

          <div className="flex justify-center">
            <button
              onClick={openBuildModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70 hover:scale-105"
            >
              Build Ship
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Update the main content section to use the renderShipsContent function
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <div className="flex items-center">
          <div className="text-blue-500 mr-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-45">
              <path d="M21,17H3V21H21V17M6.5,13L11,6.5L15.5,13H6.5Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-500">Relationships.</h1>
        </div>
        <button
          onClick={handleConnectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Connect Wallet
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
        {/* Navigation Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("inscribe")}
            className={`font-medium py-3 px-8 rounded-lg transition-colors ${
              activeTab === "inscribe" ? "bg-blue-900 text-white" : "bg-blue-300/70 hover:bg-blue-400/70 text-blue-900"
            }`}
          >
            Inscribe
          </button>
          <button
            onClick={() => setActiveTab("ships")}
            className={`font-medium py-3 px-8 rounded-lg transition-colors ${
              activeTab === "ships" ? "bg-blue-900 text-white" : "bg-blue-300/70 hover:bg-blue-400/70 text-blue-900"
            }`}
          >
            Ships
          </button>
        </div>

        {activeTab === "inscribe" ? (
          <div className="w-full space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Inscribe a RWA</h2>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">Ship</label>
                  <div className="relative">
                    <select className="w-full bg-blue-200/70 text-gray-800 rounded-lg py-3 px-4 appearance-none">
                      <option>Vault1/0x...</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">RWA Name</label>
                  <input
                    type="text"
                    placeholder="Name..."
                    className="w-full bg-blue-200/70 text-gray-800 rounded-lg py-3 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-blue-900 text-xl font-medium">Description</label>
                  <textarea
                    placeholder="..."
                    className="w-full bg-gray-100/80 text-gray-800 rounded-lg py-3 px-4 min-h-[120px] resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-start justify-center">
                <button className="w-36 h-36 bg-blue-100/80 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 4V20M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={openCreateModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg shadow-blue-500/50 transition-all hover:shadow-blue-500/70 hover:scale-105"
              >
                Create RWA
              </button>
            </div>
          </div>
        ) : (
          renderShipsContent()
        )}
      </main>

      {/* Modal */}
      <BuildShipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBuild={handleBuild} />
    </div>
  )
}

