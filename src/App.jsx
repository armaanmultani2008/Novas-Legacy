import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbaseBot from "./components/ChatbaseBot.jsx";
import Lightbox from "./components/Lightbox.jsx";
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
import BlogPost from './pages/BlogPost'
import Adopt from './pages/Adopt'
import Merch from './pages/Merch'
import Donate from './pages/Donate'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'
import FAQ from './pages/FAQ'
import OtherAnimals from './pages/OtherAnimals'

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
  'blog-post': BlogPost,
  adopt: Adopt,
  merch: Merch,
  donate: Donate,
  wishlist: Wishlist,
  faq: FAQ,
  'other-animals': OtherAnimals
}

function App() {
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page')
    if (pageParam && pages[pageParam]) return pageParam

    const hash = window.location.hash.replace('#', '').split('?')[0]
    if (hash && pages[hash]) return hash
    if (window.location.hash === '#admin') return 'admin'
    return 'home'
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage)
  const [pendingSection, setPendingSection] = useState(null)
  const [postId, setPostId] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [successBanner, setSuccessBanner] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page')

    if (pageParam === 'merch' || params.get('payment')) {
      if (params.get('payment') === 'success') {
        setSuccessBanner({ type: 'order', msg: "Thank you for your order! You'll receive a confirmation email shortly. Printful will ship your item directly to you." })
      }
      window.history.replaceState({ page: 'merch' }, '', '/#merch')
      setCurrentPage('merch')
    }
    else if (pageParam === 'adopt' || params.get('adoption')) {
      if (params.get('adoption') === 'success') {
        const animal = params.get('animal') || 'your animal'
        setSuccessBanner({ type: 'adoption', msg: `Welcome to ${animal}'s family! Check your email — your adoption confirmation is on its way.` })
      }
      window.history.replaceState({ page: 'adopt' }, '', '/#adopt')
      setCurrentPage('adopt')
    }
    else {
      const hash = window.location.hash.replace('#', '')
      if (hash && pages[hash]) {
        setCurrentPage(hash)
      }
    }

    if (!window.history.state?.page) {
      window.history.replaceState({ page: getInitialPage() }, '', window.location.href)
    }
  }, [])

  useEffect(() => {
    const handlePopState = (e) => {
      const page = e.state?.page || 'home'
      const savedPostId = e.state?.postId
      if (savedPostId != null) setPostId(savedPostId)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const goTo = (page, section = null, data = null) => {
    const hash = page === 'home' ? '' : `#${page}`
    window.history.pushState({ page, postId: data ?? null }, '', hash || '/')
    setTransitioning(true)
    setTimeout(() => {
      if (page === 'blog-post' && data !== null) setPostId(data)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (section) setPendingSection(section)
      setTransitioning(false)
    }, 220)
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
        {successBanner && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
              background: successBanner.type === 'adoption' ? '#1a6b3a' : '#1a4b6b',
              color: '#fff', padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}>
          <span style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
            {successBanner.type === 'adoption' ? '🐆 ' : '✓ '}{successBanner.msg}
          </span>
              <button
                  onClick={() => setSuccessBanner(null)}
                  style={{ background: 'none', border: '1px solid rgba(255,255,255,0.5)', color: '#fff',
                    borderRadius: 4, padding: '0.2rem 0.6rem', cursor: 'pointer', flexShrink: 0, fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
        )}
        <div className={`page-wrap ${transitioning ? 'page-wrap--out' : 'page-wrap--in'}`}
             style={successBanner ? { paddingTop: '3.5rem' } : {}}>
          <PageComponent key={currentPage} goTo={goTo} postId={postId} />
        </div>
        <Footer goTo={goTo} />
        <ChatbaseBot />
      </>
  )
}

export default App