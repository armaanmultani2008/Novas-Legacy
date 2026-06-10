import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cheetah from './pages/Cheetah'
import CheetahRun from './pages/CheetahRun'
import NovaStory from './pages/NovaStory'
import KimStory from './pages/KimStory'
import Conservation from './pages/Conservation'
import Horses from './pages/Horses'
import Volunteer from './pages/Volunteer'
import Internship from './pages/Internship'
import Visit from './pages/Visit'
import Blog from './pages/Blog'
import Adopt from './pages/Adopt'
import Merch from './pages/Merch'
import Donate from './pages/Donate'
import Admin from './pages/Admin'
import FAQ from './pages/FAQ'

const pages = {
  home: Home,
  cheetah: Cheetah,
  'cheetah-run': CheetahRun,
  'nova-story': NovaStory,
  'kim-story': KimStory,
  conservation: Conservation,
  horses: Horses,
  volunteer: Volunteer,
  internship: Internship,
  visit: Visit,
  blog: Blog,
  adopt: Adopt,
  merch: Merch,
  donate: Donate,
  faq: FAQ
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [pendingSection, setPendingSection] = useState(null)

  useEffect(() => {
    if (window.location.hash === '#admin') setCurrentPage('admin')
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      alert('Pagamento completato! Grazie per il tuo acquisto da Nova\'s Legacy.')
      window.history.replaceState({}, '', '/')
    } else if (params.get('adoption') === 'success') {
      const animal = params.get('animal') || 'animale'
      alert(`Benvenuto nella famiglia di ${animal}! Controlla la tua email — riceverai presto il certificato di adozione.`)
      window.history.replaceState({}, '', '/')
    } else if (params.get('payment') === 'cancel' || params.get('adoption') === 'cancel') {
      window.history.replaceState({}, '', '/')
    }
  }, [])

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

  if (currentPage === 'admin') {
    return <Admin goTo={goTo} />
  }

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
