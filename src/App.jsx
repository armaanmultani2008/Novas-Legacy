import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbaseBot from "./components/ChatbaseBot.jsx";
import Lightbox from "./components/Lightbox.jsx";
import AuthModal from './components/AuthModal'
import { UserProvider, useUser } from './UserContext'
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
import UserProfile from './pages/UserProfile'

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
  'other-animals': OtherAnimals,
  'user-profile': UserProfile,
}

function AppInner() {
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState('home')
  const [pendingSection, setPendingSection] = useState(null)
  const [postId, setPostId] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [successBanner, setSuccessBanner] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [regBanner, setRegBanner] = useState(false)
  const regTimerRef = useRef(null)

  useEffect(() => {
    if (user) { setRegBanner(false); return }
    const first = setTimeout(() => setRegBanner(true), 30000)
    return () => clearTimeout(first)
  }, [user])

  const dismissRegBanner = () => {
    setRegBanner(false)
    clearTimeout(regTimerRef.current)
    regTimerRef.current = setTimeout(() => { if (!user) setRegBanner(true) }, 4 * 60 * 1000)
  }

  useEffect(() => {
    // Set initial history state so popstate can restore 'home'
    if (!window.history.state?.page) {
      window.history.replaceState({ page: 'home' }, '', window.location.href)
    }
    if (window.location.hash === '#admin') setCurrentPage('admin')
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      setSuccessBanner({ type: 'order', msg: "Thank you for your order! You'll receive a confirmation email shortly. Printful will ship your item directly to you." })
      window.history.replaceState({ page: 'home' }, '', '/')
    } else if (params.get('adoption') === 'success') {
      const animal = params.get('animal') || 'your animal'
      setSuccessBanner({ type: 'adoption', msg: `Welcome to ${animal}'s family! Check your email — your adoption confirmation is on its way.` })
      window.history.replaceState({ page: 'home' }, '', '/')
    } else if (params.get('payment') === 'cancel' || params.get('adoption') === 'cancel') {
      window.history.replaceState({ page: 'home' }, '', '/')
    }
  }, [])

  // Handle browser back/forward button
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {regBanner && !user && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9998, background: 'rgba(14,14,14,0.97)',
          border: '1px solid rgba(200,136,10,0.35)',
          borderRadius: '50px', padding: '0.7rem 1rem 0.7rem 1.4rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          animation: 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
            🐆 Track your adoptions & earn XP
          </span>
          <button
            onClick={() => { dismissRegBanner(); setAuthOpen(true) }}
            style={{
              background: 'var(--gold-light)', color: '#111', border: 'none',
              borderRadius: '50px', padding: '0.4rem 1rem',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Join free
          </button>
          <button
            onClick={dismissRegBanner}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.85rem', padding: '0 0.25rem' }}
          >
            ✕
          </button>
        </div>
      )}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <Navbar goTo={goTo} openAuth={() => setAuthOpen(true)} />
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

function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  )
}

export default App
