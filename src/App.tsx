import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import Home from '@/pages/Home'
import './App.css'

const Etude = lazy(() => import('@/pages/Etude'))
const Expertises = lazy(() => import('@/pages/Expertises'))
const ExpertiseDetail = lazy(() => import('@/pages/ExpertiseDetail'))
const Honoraires = lazy(() => import('@/pages/Honoraires'))
const Blog = lazy(() => import('@/pages/Blog'))
const Faq = lazy(() => import('@/pages/Faq'))
const Contact = lazy(() => import('@/pages/Contact'))
const RendezVous = lazy(() => import('@/pages/RendezVous'))
const Confirmation = lazy(() => import('@/pages/Confirmation'))
const Annulation = lazy(() => import('@/pages/Annulation'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route
            path="etude"
            element={
              <Suspense fallback={<PageFallback />}>
                <Etude />
              </Suspense>
            }
          />
          <Route
            path="expertises"
            element={
              <Suspense fallback={<PageFallback />}>
                <Expertises />
              </Suspense>
            }
          />
          <Route
            path="expertises/:slug"
            element={
              <Suspense fallback={<PageFallback />}>
                <ExpertiseDetail />
              </Suspense>
            }
          />
          <Route
            path="honoraires"
            element={
              <Suspense fallback={<PageFallback />}>
                <Honoraires />
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense fallback={<PageFallback />}>
                <Blog />
              </Suspense>
            }
          />
          <Route
            path="faq"
            element={
              <Suspense fallback={<PageFallback />}>
                <Faq />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<PageFallback />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="rendez-vous"
            element={
              <Suspense fallback={<PageFallback />}>
                <RendezVous />
              </Suspense>
            }
          />
          <Route
            path="rendez-vous/confirmation/:token"
            element={
              <Suspense fallback={<PageFallback />}>
                <Confirmation />
              </Suspense>
            }
          />
          <Route
            path="rendez-vous/annuler/:token"
            element={
              <Suspense fallback={<PageFallback />}>
                <Annulation />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
