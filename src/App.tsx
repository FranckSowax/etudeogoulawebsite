import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import Home from '@/pages/Home'
import Etude from '@/pages/Etude'
import Expertises from '@/pages/Expertises'
import ExpertiseDetail from '@/pages/ExpertiseDetail'
import Honoraires from '@/pages/Honoraires'
import Blog from '@/pages/Blog'
import Faq from '@/pages/Faq'
import Contact from '@/pages/Contact'
import RendezVous from '@/pages/RendezVous'
import NotFound from '@/pages/NotFound'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="etude" element={<Etude />} />
          <Route path="expertises" element={<Expertises />} />
          <Route path="expertises/:slug" element={<ExpertiseDetail />} />
          <Route path="honoraires" element={<Honoraires />} />
          <Route path="blog" element={<Blog />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="rendez-vous" element={<RendezVous />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
