import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'
import Navbar from './Navbar.jsx'

const Hero = () => {
  const heroRef = useRef(null)
  const revealRef = useRef(null)
  const monstersLayerRef = useRef(null)
  const activeMonstersRef = useRef({})

  useEffect(() => {
    const hero = heroRef.current
    const reveal = revealRef.current

    if (!hero || !reveal) return

    let mouseX = 0
    let mouseY = 0
    let x = 0
    let y = 0
    let visible = false

    const animate = () => {
      x += (mouseX - x) * 0.06
      y += (mouseY - y) * 0.06

      reveal.style.setProperty('--x', `${x}px`)
      reveal.style.setProperty('--y', `${y}px`)

      requestAnimationFrame(animate)
    }

    animate()

    const move = (e) => {
      const rect = hero.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      if (!visible) {
        visible = true
        reveal.classList.add('fire-reveal--active')
      }
    }

    const leave = () => {
      visible = false
      reveal.classList.remove('fire-reveal--active')
    }

    hero.addEventListener('mousemove', move)
    hero.addEventListener('mouseleave', leave)

    return () => {
      hero.removeEventListener('mousemove', move)
      hero.removeEventListener('mouseleave', leave)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const monstersLayer = monstersLayerRef.current
    if (!hero || !monstersLayer) return

    const handlePointerDown = (event) => {
      const rect = hero.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const monster = document.createElement('div')
      monster.className = 'hero-monster hero-monster--spawning'
      monster.style.left = `${x}px`
      monster.style.top = `${y}px`

      const img = document.createElement('img')
      img.src = '/demogorgon.png'
      img.alt = 'Demogorgon emerging from the Upside Down'
      img.className = 'hero-monster__image'

      monster.appendChild(img)
      monstersLayer.appendChild(monster)

      activeMonstersRef.current[event.pointerId] = monster

      setTimeout(() => {
        monster.classList.remove('hero-monster--spawning')
      }, 600)

      hero.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event) => {
      const monster = activeMonstersRef.current[event.pointerId]
      if (!monster) return

      const rect = hero.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      monster.style.left = `${x}px`
      monster.style.top = `${y}px`
      monster.classList.add('hero-monster--dragging')
    }

    const releaseMonster = (event) => {
      const monster = activeMonstersRef.current[event.pointerId]
      if (!monster) return

      monster.classList.remove('hero-monster--dragging')
      monster.classList.add('hero-monster--fading')

      monster.addEventListener(
        'transitionend',
        () => {
          monster.remove()
        },
        { once: true },
      )

      delete activeMonstersRef.current[event.pointerId]
    }

    hero.addEventListener('pointerdown', handlePointerDown)
    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerup', releaseMonster)
    hero.addEventListener('pointercancel', releaseMonster)

    return () => {
      hero.removeEventListener('pointerdown', handlePointerDown)
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerup', releaseMonster)
      hero.removeEventListener('pointercancel', releaseMonster)
    }
  }, [])

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 12 },
    },
  }

  const navbarVariant = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 14 },
    },
  }

  return (
    <div className="hero" ref={heroRef}>
      <motion.div variants={navbarVariant} initial="hidden" animate="visible">
        <Navbar />
      </motion.div>

      <motion.div className="hero-content" variants={container} initial="hidden" animate="visible">
        <motion.div className="hero-left" variants={item}>
          <h1 className="hero-title">
            STRANGER
            <br />
            THINGS
          </h1>
          <motion.p className="hero-desc" variants={item}>
            When the fire lights up the sky and the air turns to ash, a door between worlds
            tears open over Hawkins. Every click, every touch, brings the creature closer.
          </motion.p>
          <motion.button className="hero-btn" variants={item}>
            Open the Gate
          </motion.button>
        </motion.div>

        <motion.div className="hero-right" variants={item}>
          <h2 className="hero-right-title">The Demogorgon</h2>
          <motion.p className="hero-right-text" variants={item}>
            Click or drag across the flames to wake the shadow. Watch as it spawns from the
            dark, tracking your every move across the screen.
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="fire-reveal" ref={revealRef} />
      <div className="hero-monsters-layer" ref={monstersLayerRef} />
    </div>
  )
}

export default Hero

