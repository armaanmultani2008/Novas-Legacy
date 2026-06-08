import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cheetah from './pages/Cheetah'
import Conservation from './pages/Conservation'
import Horses from './pages/Horses'
import Volunteer from './pages/Volunteer'
import Internship from './pages/Internship'
import Visit from './pages/Visit'
import Blog from './pages/Blog'
import Adopt from './pages/Adopt'
import Merch from './pages/Merch'

const pages = {
  home: Home,
  cheetah: Cheetah,
  conservation: Conservation,
  horses: Horses,
  volunteer: Volunteer,
  internship: Internship,
  visit: Visit,
  blog: Blog,
  adopt: Adopt,
  merch: Merch,
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [pendingSection, setPendingSection] = useState(null)

  const goTo = (page, section = null) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (section) setPendingSection(section)
  }

  useEffect(() => {
    if (!pendingSection) return
    const timer = setTimeout(() => {
      const el = document.getElementById(pendingSection)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setPendingSection(null)
    }, 200)
    return () => clearTimeout(timer)
  }, [pendingSection, currentPage])

  const PageComponent = pages[currentPage] || Home

  return (
    <>
      <Navbar goTo={goTo} />
      <PageComponent key={currentPage} goTo={goTo} />
      <Footer goTo={goTo} />
    </>
  )
}

export default App
