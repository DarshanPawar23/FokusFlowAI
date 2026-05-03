import React from 'react'
import VideoDisplay from './VideoDisplay'
import Features from "./Features";
function Left() {
  return (
    <div className="flex flex-col p-6 space-y-8">
      <VideoDisplay />
      <hr className="border-white/5" />
      <Features />
    </div>
  )
}

export default Left
