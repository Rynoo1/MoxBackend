import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

const ConfettiEffect: React.FC = () => {
  useEffect(() => {
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0a5b', '#00b0b9', '#ffbc00']
      })
    }

    triggerConfetti()

    return () => {}
  }, [])

  return null
}

export default ConfettiEffect
