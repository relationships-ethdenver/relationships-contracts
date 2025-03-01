"use client"

import { useState } from "react"
import { X, Info, ArrowUpRight } from "lucide-react"

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("landing")
  const [hasShips, setHasShips] = useState(false)
  const [isRwaModalOpen, setIsRwaModalOpen] = useState(false)
  const [isRwaDetailsModalOpen, setIsRwaDetailsModalOpen] = useState(false)
  const [isRwaInfoModalOpen, setIsRwaInfoModalOpen] = useState(false)
  const [isRwaTransferModalOpen, setIsRwaTransferModalOpen] = useState(false)
  // Add a new state for the RWA sent successfully modal
  const [isRwaSentModalOpen, setIsRwaSentModalOpen] = useState(false)
  const [selectedShipIndex, setSelectedShipIndex] = useState(0)

  const resetPage = () => {
    setActiveSection("landing")
    setIsModalOpen(false)
    setHasShips(false)
  }

  // Sample ship data
  const ships = [
    { name: "House1", state: "OFF", ox: "Hash Ox" },
    { name: "House1", state: "OFF", ox: "Hash Ox" },
    { name: "House1", state: "OFF", ox: "Hash Ox" },
  ]

  // Handle the Create RWA button click
  const handleCreateRwa = () => {
    // Simulate a brief loading period
    setTimeout(() => {
      setIsRwaModalOpen(true)
    }, 500)
  }

  // Handle the Check button click in the first modal
  const handleCheckRwa = () => {
    setIsRwaModalOpen(false)
    // Show the second modal with details
    setIsRwaDetailsModalOpen(true)
  }

  // Handle the Create another RWA button click
  const handleCreateAnotherRwa = () => {
    setIsRwaDetailsModalOpen(false)
    // Reset the form or do other necessary actions
    // For now, we'll just close the modal
  }

  // Handle the info icon click in the ships table
  const handleInfoClick = (index) => {
    setSelectedShipIndex(index)
    setIsRwaInfoModalOpen(true)
  }

  // Handle the arrow icon click in the ships table
  const handleTransferClick = (index) => {
    setSelectedShipIndex(index)
    setIsRwaTransferModalOpen(true)
  }

  // Handle the Send RWA button click
  const handleSendRwa = () => {
    setIsRwaTransferModalOpen(false)
    // Show the RWA sent successfully modal
    setIsRwaSentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center px-4 font-sans antialiased">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <div className="flex items-center cursor-pointer" onClick={resetPage}>
          <div className="text-blue-600 flex items-center">
            <svg
              width="40"
              height="30"
              viewBox="0 0 40 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path d="M20 0L40 30H0L20 0Z" fill="#6366F1" transform="rotate(270 20 15)" />
            </svg>
            <span className="text-4xl font-bold">
              <span className="text-blue-500">Relation</span>
              <span className="text-blue-800">ships.</span>
            </span>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors">
          Connect Wallet
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center py-12">
        {/* Navigation Buttons */}
        {activeSection !== "landing" && (
          <div className="flex gap-4 mb-12">
            <button
              className={`${activeSection === "inscribe" ? "bg-blue-900 text-white" : "bg-blue-200 bg-opacity-70 text-blue-800"} hover:bg-blue-300 font-medium py-3 px-10 rounded-lg transition-colors`}
              onClick={() => setActiveSection("inscribe")}
            >
              Inscribe
            </button>
            <button
              className={`${activeSection === "ships" ? "bg-blue-900 text-white" : "bg-blue-200 bg-opacity-70 text-blue-800"} hover:bg-blue-300 font-medium py-3 px-10 rounded-lg transition-colors`}
              onClick={() => {
                setActiveSection("ships")
                setHasShips(true)
              }}
            >
              Ships
            </button>
          </div>
        )}

        {/* Landing Page */}
        {activeSection === "landing" && (
          <div className="w-full space-y-8 text-center">
            <h1 className="text-5xl font-bold text-blue-900">Welcome to Relationships</h1>
            <p className="text-2xl text-blue-800">Manage your ships and RWAs with ease</p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all"
                onClick={() => setActiveSection("ships")}
              >
                View Ships
              </button>
              <button
                className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold py-3 px-8 rounded-lg text-xl transition-all"
                onClick={() => setActiveSection("inscribe")}
              >
                Inscribe RWA
              </button>
            </div>
          </div>
        )}

        {/* Ships Table */}
        {activeSection === "ships" && hasShips && (
          <div className="w-full mb-12">
            <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 px-6 py-4 border-b border-gray-700 border-opacity-30">
                <div className="text-2xl font-bold text-gray-900">Name</div>
                <div className="text-2xl font-bold text-gray-900">State</div>
                <div className="text-2xl font-bold text-gray-900">Ox</div>
                <div></div>
              </div>

              {/* Table Rows */}
              {ships.map((ship, index) => (
                <div key={index} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 px-6 py-5 items-center">
                  <div className="text-2xl font-medium text-gray-900 italic">{ship.name}</div>
                  <div className="text-2xl font-medium text-red-500 italic">{ship.state}</div>
                  <div className="text-2xl font-medium text-gray-900 italic">{ship.ox}</div>
                  <div className="flex gap-3">
                    <button
                      className="w-10 h-10 bg-blue-200 bg-opacity-70 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                      onClick={() => handleInfoClick(index)}
                    >
                      <Info size={20} className="text-blue-900" />
                    </button>
                    <button
                      className="w-10 h-10 bg-blue-200 bg-opacity-70 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                      onClick={() => handleTransferClick(index)}
                    >
                      <ArrowUpRight size={20} className="text-blue-900" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeSection === "ships" && !hasShips && (
          <div className="w-full space-y-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 h-12"></div>

            <h2 className="text-center text-3xl font-bold text-gray-900 my-8">
              ohhh... it seems you don&apos;t own any ships!
            </h2>

            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full"></div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-20 h-20">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M0 0L100 0L50 100L0 0Z" fill="#3B4FD1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-4 h-12 mb-4"></div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 h-12 mb-4"></div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 h-12"></div>
          </div>
        )}

        {/* Inscribe Section */}
        {activeSection === "inscribe" && (
          <div className="w-full max-w-2xl mx-auto space-y-8">
            <h1 className="text-center text-4xl font-black text-gray-900 mb-12">Inscribe a RWA</h1>

            <div className="grid grid-cols-[1fr,auto] gap-8 items-start">
              <div className="space-y-8">
                <div>
                  <label className="block text-blue-700 text-2xl font-semibold mb-3">Ship</label>
                  <div className="relative">
                    <select className="w-full bg-white bg-opacity-20 text-gray-800 py-4 px-5 rounded-lg appearance-none focus:outline-none text-xl font-medium italic">
                      <option>House1 / 0x...</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-blue-700 text-2xl font-semibold mb-3">RWA Name</label>
                  <input
                    type="text"
                    placeholder="Name..."
                    className="w-full bg-white bg-opacity-20 text-gray-800 py-4 px-5 rounded-lg focus:outline-none text-xl font-medium italic"
                  />
                </div>

                <div>
                  <label className="block text-blue-700 text-2xl font-semibold mb-3">Description</label>
                  <textarea
                    placeholder="..."
                    className="w-full bg-white bg-opacity-20 text-gray-800 py-4 px-5 rounded-lg h-40 focus:outline-none resize-none text-xl font-medium italic"
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="mt-14">
                  <button
                    className="w-32 h-32 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                    onClick={handleCreateRwa}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Create RWA Button */}
            <div className="flex justify-center mt-12">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-16 rounded-xl text-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105 shadow-blue-400/30"
                onClick={handleCreateRwa}
              >
                Create RWA
              </button>
            </div>
          </div>
        )}

        {/* Build Ship Button */}
        {activeSection === "ships" && (
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg transition-all hover:shadow-xl shadow-blue-400/30"
              onClick={() => setIsModalOpen(true)}
            >
              Build Ship
            </button>
          </div>
        )}
      </main>

      {/* Build Ship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center p-8">
              {/* Build Ship Header */}
              <div className="bg-blue-600 text-white font-bold text-2xl py-3 px-10 rounded-lg mb-8">Build Ship</div>

              {/* Description */}
              <div className="text-center mb-4">
                <p className="text-2xl font-bold mb-2">
                  This will deploy a new vault to store your RWA&apos;s under your account
                </p>
                <p className="text-gray-500 text-xl">0x...</p>
              </div>

              {/* Form Fields */}
              <div className="w-full grid grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-xl font-bold mb-2">Name:</label>
                  <input
                    type="text"
                    defaultValue="House1"
                    className="w-full border-b-2 border-gray-800 pb-1 text-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-2">Initial State:</label>
                  <div className="border-b-2 border-gray-800 pb-1">
                    <span className="text-xl">ON/</span>
                    <span className="text-xl text-red-500 font-bold">OFF</span>
                  </div>
                </div>
              </div>

              {/* Build Button */}
              <div className="flex justify-end w-full">
                <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-10 rounded-lg text-xl transition-colors">
                  Build
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RWA Success Modal */}
      {isRwaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsRwaModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center p-8">
              <h2 className="text-blue-600 text-2xl font-bold text-center mb-6">RWA inscribed successfully!</h2>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-full text-lg transition-colors"
                onClick={handleCheckRwa}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RWA Details Modal */}
      {isRwaDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsRwaDetailsModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col p-8">
              {/* Success Label */}
              <div className="flex justify-center mb-6">
                <div className="bg-blue-900 text-white font-bold text-xl py-2 px-8 rounded-lg">Success!</div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-6">RWA Created in "Ship"</h2>

              {/* Details */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="font-bold">RWA Name:</span>
                  <span className="italic">House1</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Token ID:</span>
                  <span className="italic">####</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Hash:</span>
                  <span className="italic">0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Description:</span>
                  <span className="italic">...</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">File URL:</span>
                  <span className="italic">IPFS://</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Tx Id:</span>
                  <span className="italic">0x...</span>
                </div>
              </div>

              {/* Create Another RWA Button */}
              <div className="flex justify-center">
                <button
                  className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  onClick={handleCreateAnotherRwa}
                >
                  Create another RWA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RWA Info Modal */}
      {isRwaInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsRwaInfoModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col p-8">
              {/* RWA Information Header */}
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 text-white font-bold text-xl py-2 px-8 rounded-lg">RWA Information</div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="font-bold">Current Ship:</span>
                  <span className="italic">0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">RWA Name:</span>
                  <span className="italic">House1</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Token ID:</span>
                  <span className="italic">####</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Hash:</span>
                  <span className="italic">0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Description:</span>
                  <span className="italic">...</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">File URL:</span>
                  <span className="italic">IPFS://</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Past Owners:</span>
                </div>
                <div className="flex justify-between">
                  <span className="italic">dd/mm/yy</span>
                  <span className="italic">0x...</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                  Share Info
                </button>
                <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RWA Transfer Modal */}
      {isRwaTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsRwaTransferModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col p-8">
              {/* RWA Transfer Header */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-500 text-white font-bold text-xl py-2 px-8 rounded-lg">RWA Transfer</div>
              </div>

              {/* Warning */}
              <p className="text-xl font-bold text-center mb-6">
                Careful: You&apos;re going to transfer out this token from your Ship
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold">RWA Name:</span>
                  <span className="italic">House1</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Token ID:</span>
                  <span className="italic">####</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Hash:</span>
                  <span className="italic">0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Description:</span>
                  <span className="italic">...</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">File URL:</span>
                  <span className="italic">IPFS://</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Tx Id:</span>
                  <span className="italic">0x...</span>
                </div>
              </div>

              {/* Destination Field */}
              <div className="bg-gray-200 rounded-lg p-3 mb-6 flex justify-between">
                <span className="font-bold">Destination:</span>
                <span className="italic">0x...</span>
              </div>

              {/* Permanent Warning */}
              <p className="text-center font-bold text-lg mb-6">This is permanent and can&apos;t be undone!!</p>

              {/* Send RWA Button */}
              <div className="flex justify-center">
                <button
                  className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  onClick={handleSendRwa}
                >
                  Send RWA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RWA Sent Successfully Modal */}
      {isRwaSentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsRwaSentModalOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col p-6">
              <h2 className="text-blue-600 text-2xl font-bold text-center mb-4">RWA sent successfully!</h2>

              <div className="flex justify-between">
                <span className="font-bold">Tx Id:</span>
                <span className="italic">0x...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

