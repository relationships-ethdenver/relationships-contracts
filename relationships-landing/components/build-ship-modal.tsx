"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface BuildShipModalProps {
  isOpen: boolean
  onClose: () => void
  onBuild: (name: string, initialState: "ON" | "OFF") => void
}

export default function BuildShipModal({ isOpen, onClose, onBuild }: BuildShipModalProps) {
  const [name, setName] = useState("Vault1")
  const [initialState, setInitialState] = useState<"ON" | "OFF">("OFF")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <div className="flex justify-center pt-8 pb-4">
          <button className="bg-blue-600 text-white font-bold py-3 px-10 rounded-full text-xl shadow-md">
            Build Ship
          </button>
        </div>

        <div className="px-8 py-4 text-center">
          <p className="text-2xl font-bold mb-2">This will deploy a new vault to store your RWA's under your account</p>
          <p className="text-xl text-gray-500 mb-8">0x...</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-left">
              <p className="text-xl font-medium mb-2">Name:</p>
              <div className="border-b-2 border-gray-800 pb-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none text-xl"
                />
              </div>
            </div>

            <div className="text-left">
              <p className="text-xl font-medium mb-2">Initial State:</p>
              <div className="border-b-2 border-gray-800 pb-1">
                <div className="flex items-center">
                  <span className="text-xl mr-1">ON</span>
                  <span className="text-xl text-red-500">/OFF</span>
                  <div className="ml-auto">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={initialState === "ON"}
                        onChange={() => setInitialState(initialState === "ON" ? "OFF" : "ON")}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => onBuild(name, initialState)}
              className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-3 px-10 rounded-lg text-xl transition-colors"
            >
              Build
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

