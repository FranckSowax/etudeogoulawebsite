import { useState } from 'react'
import { 
  BookOpen,
  FileText,
  Home, 
  Users, 
  Building2, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  Mail,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Gavel,
  Shield,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  })

  // Navigation is not sticky - removed scroll effect

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('appointments').insert({
      name: appointmentForm.name,
      email: appointmentForm.email || null,
      phone: appointmentForm.phone,
      service: appointmentForm.service,
      date: appointmentForm.date,
      time: appointmentForm.time,
      message: appointmentForm.message || null,
    })
    if (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
      return
    }
    toast.success('Votre demande de rendez-vous a été envoyée avec succès ! Nous vous contacterons bientôt.')
    setAppointmentForm({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      message: ''
    })
  }

  const services = [
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Achat & Vente Immobilier au Gabon',
      description: 'Notaire spécialisé en achat immobilier au Gabon : actes de vente, donation, partage, hypothèques et baux. Sécurisez vos transactions immobilières à Libreville.',
      items: ['Achat immobilier au Gabon', 'Vente et cession immobilière', 'Donation et partage de biens', 'Hypothèques et cautions']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Droit de la Famille',
      description: 'Mariage, divorce, succession, adoption, filiation. Nous accompagnons les familles dans toutes les étapes importantes de leur vie.',
      items: ['Contrats de mariage', 'Successions et libéralités', 'Adoption', 'Pension alimentaire']
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Droit des Affaires',
      description: 'Création de sociétés, cession de fonds de commerce, baux commerciaux, contrats. Conseil et sécurité juridique pour les entreprises.',
      items: ['Constitution de sociétés', 'Cession de fonds', 'Baux commerciaux', 'Contrats commerciaux']
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Actes Authentiques',
      description: 'Rédaction et authentification de tous actes notariés. Authenticité et sécurité juridique garanties pour vos documents importants.',
      items: ['Testaments et codicilles', 'Procurations', 'Reconnaissance de dette', 'Déclarations diverses']
    },
    {
      icon: <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />,
      title: 'Conseil Juridique',
      description: 'Consultations personnalisées pour tous vos projets. Analyse juridique approfondie et solutions adaptées à votre situation.',
      items: ['Consultation notariale', 'Planification successorale', 'Optimisation fiscale', 'Médiation familiale']
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Formalités Légales',
      description: 'Enregistrement des actes, publications légales, conservation des archives. Gestion administrative complète de vos documents.',
      items: ['Enregistrement fiscal', 'Publications légales', 'Conservation d\'actes', 'Copies authentiques']
    }
  ]

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#a-propos', label: 'À Propos' },
    { href: '#services', label: 'Services' },
    { href: '#rendez-vous', label: 'Rendez-vous' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header>
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent" aria-label="Navigation principale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#accueil" className="flex items-center gap-3">
              <img src="/logo.png" alt="Cabinet Notarial S.O. Nkondawiri" className="h-14 w-auto" />
              <div className="hidden sm:block">
                <p className="font-serif font-semibold text-lg leading-tight text-white">
                  Cabinet Notarial
                </p>
                <p className="text-xs text-[#e8d5a3]">
                  S.O. Nkondawiri
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-[#c9a227] text-white"
                >
                  {link.label}
                </a>
              ))}
              <a href="#rendez-vous">
                <Button className="bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold">
                  Prendre RDV
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-[#1a2a4a] hover:text-[#c9a227] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="#rendez-vous" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold">
                  Prendre RDV
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
      </header>

      <main>
      {/* Hero Section */}
      <section id="accueil" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="/hero-notary.jpg"
            alt="Cabinet notarial pour achat immobilier au Gabon - Notaire Ogoula Nkondawiri à Libreville"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a4a]/95 via-[#1a2a4a]/80 to-[#1a2a4a]/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-[2px] bg-[#c9a227]" />
              <span className="text-[#e8d5a3] text-sm font-medium tracking-wider uppercase">
                République Gabonaise
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Notaire au Gabon<br />
              <span className="text-[#c9a227]">Suzanne Ogoula</span><br />
              Nkondawiri
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
              Votre notaire pour l'achat immobilier au Gabon. Sécurité juridique,
              conseil personnalisé et accompagnement dans toutes vos démarches
              notariales à Libreville.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#rendez-vous">
                <Button size="lg" className="bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Prendre Rendez-vous
                </Button>
              </a>
              <a href="#services">
                <Button size="lg" className="bg-white text-[#1a2a4a] hover:bg-gray-100 px-8 font-semibold">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Nos Services
                </Button>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#c9a227]" />
                <span className="text-sm">Sécurité Juridique</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#c9a227]" />
                <span className="text-sm">Expertise Reconnue</span>
              </div>
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#c9a227]" />
                <span className="text-sm">Authenticité Garantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="a-propos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/notary-portrait.jpg"
                  alt="Maître Suzanne Ogoula Nkondawiri - Notaire à Libreville, Gabon"
                  className="w-full max-w-md mx-auto rounded-lg shadow-elegant"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#c9a227]/10 rounded-lg -z-0" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-[#c9a227]/30 rounded-lg -z-0" />
              
              <div className="absolute bottom-8 -right-4 bg-white p-4 rounded-lg shadow-elegant">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-navy rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#1a2a4a]">Notaire</p>
                    <p className="text-sm text-muted-foreground">Depuis 2005</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] bg-[#c9a227]" />
                <span className="text-[#c9a227] text-sm font-medium tracking-wider uppercase">
                  À Propos de Nous
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a2a4a] mb-6">
                Votre Notaire de Confiance pour l'Achat Immobilier au Gabon
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Le Cabinet Notarial Suzanne Ogoula Nkondawiri est une étude de notariat
                établie à Libreville, capitale de la République Gabonaise. Spécialisé dans
                l'achat et la vente immobilière au Gabon, notre cabinet accompagne
                particuliers et entreprises dans toutes leurs transactions notariales.
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                Que vous souhaitiez acheter un bien immobilier au Gabon, constituer une
                société, régler une succession ou préparer un contrat de mariage, notre
                notaire vous garantit la sécurité juridique de chaque acte.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9a227] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1a2a4a]">Professionnalisme</p>
                    <p className="text-sm text-muted-foreground">Rigueur et excellence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9a227] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1a2a4a]">Confidentialité</p>
                    <p className="text-sm text-muted-foreground">Discrétion absolue</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9a227] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1a2a4a]">Réactivité</p>
                    <p className="text-sm text-muted-foreground">Réponse rapide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9a227] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1a2a4a]">Accessibilité</p>
                    <p className="text-sm text-muted-foreground">À votre écoute</p>
                  </div>
                </div>
              </div>

              <a href="#contact">
                <Button className="bg-[#1a2a4a] hover:bg-[#2d3e5f] text-white">
                  Nous Contacter
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#f8f6f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-[#c9a227]" />
              <span className="text-[#c9a227] text-sm font-medium tracking-wider uppercase">
                Nos Services
              </span>
              <div className="w-8 h-[2px] bg-[#c9a227]" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a2a4a] mb-4">
              Services Notariaux au Gabon : Achat, Vente et Conseil Juridique
            </h2>

            <p className="text-muted-foreground">
              Notre cabinet notarial à Libreville offre une gamme complète de services :
              achat immobilier, vente, succession, droit des affaires et actes authentiques au Gabon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer hover:shadow-elegant transition-all duration-300 border-0 bg-white">
                    <CardHeader className="pb-4">
                      <div className="w-14 h-14 gradient-navy rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <div className="text-[#c9a227]">{service.icon}</div>
                      </div>
                      <CardTitle className="font-serif text-xl text-[#1a2a4a]">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center text-[#c9a227] text-sm font-medium">
                        En savoir plus
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-[#1a2a4a] flex items-center gap-3">
                      <div className="w-10 h-10 gradient-navy rounded-lg flex items-center justify-center">
                        <div className="text-[#c9a227]">{service.icon}</div>
                      </div>
                      {service.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <h4 className="font-medium text-[#1a2a4a] mb-3">Nos prestations :</h4>
                    <ul className="space-y-2">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#c9a227] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <a href="#rendez-vous">
                        <Button className="w-full bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold">
                          <Calendar className="w-4 h-4 mr-2" />
                          Prendre Rendez-vous
                        </Button>
                      </a>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="rendez-vous" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] bg-[#c9a227]" />
                <span className="text-[#c9a227] text-sm font-medium tracking-wider uppercase">
                  Rendez-vous
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a2a4a] mb-6">
                Rendez-vous avec votre Notaire à Libreville
              </h2>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                Planifiez votre consultation pour un achat immobilier au Gabon ou toute
                autre démarche notariale avec Maître Suzanne Ogoula Nkondawiri.
                Nous vous recevons du lundi au vendredi de 7h30 à 15h30.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a2a4a] mb-1">Horaires d'ouverture</h4>
                    <p className="text-muted-foreground text-sm">
                      Lundi au Vendredi : 7h30 - 15h30
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a2a4a] mb-1">Téléphone</h4>
                    <p className="text-muted-foreground text-sm">
                      011 77 37 35 / 066 15 12 20
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1a2a4a] mb-1">Adresse</h4>
                    <p className="text-muted-foreground text-sm">
                      Boulevard de la Nation, Immeuble Hollando, 6ème étage<br />
                      Libreville, République Gabonaise
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#f8f6f1] rounded-lg">
                <h4 className="font-medium text-[#1a2a4a] mb-2">Documents à prévoir</h4>
                <p className="text-sm text-muted-foreground">
                  Selon la nature de votre demande, pensez à apporter votre pièce d'identité, 
                  les documents relatifs à votre dossier, et tout autre document pertinent.
                </p>
              </div>
            </div>

            <div className="bg-[#f8f6f1] p-8 rounded-lg">
              <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={appointmentForm.name}
                      onChange={(e) => setAppointmentForm({...appointmentForm, name: e.target.value})}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      placeholder="Votre numéro"
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={appointmentForm.email}
                    onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Type de service *</Label>
                  <Select
                    value={appointmentForm.service}
                    onValueChange={(value) => setAppointmentForm({...appointmentForm, service: value})}
                    required
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immobilier">Droit Immobilier</SelectItem>
                      <SelectItem value="famille">Droit de la Famille</SelectItem>
                      <SelectItem value="affaires">Droit des Affaires</SelectItem>
                      <SelectItem value="actes">Actes Authentiques</SelectItem>
                      <SelectItem value="conseil">Conseil Juridique</SelectItem>
                      <SelectItem value="formalites">Formalités Légales</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date souhaitée *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure préférée *</Label>
                    <Select
                      value={appointmentForm.time}
                      onValueChange={(value) => setAppointmentForm({...appointmentForm, time: value})}
                      required
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez brièvement votre demande..."
                    value={appointmentForm.message}
                    onChange={(e) => setAppointmentForm({...appointmentForm, message: e.target.value})}
                    className="bg-white min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold h-12"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Demander un Rendez-vous
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Champs obligatoires. Nous vous contacterons pour confirmer votre rendez-vous.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#1a2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] bg-[#c9a227]" />
                <span className="text-[#c9a227] text-sm font-medium tracking-wider uppercase">
                  Contact
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
                Contactez votre Notaire au Gabon
              </h2>

              <p className="text-gray-300 mb-8 leading-relaxed">
                Notre cabinet notarial à Libreville est à votre disposition pour tout
                achat immobilier au Gabon, conseil juridique et démarches notariales.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Adresse</h4>
                    <p className="text-gray-300 text-sm">
                      Boulevard de la Nation<br />
                      Immeuble Hollando, 6ème étage<br />
                      Libreville, République Gabonaise<br />
                      BP 8350
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Téléphone</h4>
                    <p className="text-gray-300 text-sm">
                      011 77 37 35<br />
                      066 15 12 20
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Horaires</h4>
                    <p className="text-gray-300 text-sm">
                      Lundi au Vendredi<br />
                      7h30 - 15h30
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a227]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#c9a227]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Email</h4>
                    <p className="text-gray-300 text-sm">
                      contact@notaire-nkondawiri.ga
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="font-serif text-xl text-white mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const { error } = await supabase.from('messages').insert({
                  name: formData.get('contact-name') as string,
                  email: formData.get('contact-email') as string,
                  subject: formData.get('contact-subject') as string,
                  message: formData.get('contact-message') as string,
                })
                if (error) {
                  toast.error('Une erreur est survenue. Veuillez réessayer.')
                  return
                }
                toast.success('Message envoyé avec succès !')
                form.reset()
              }}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-white">Nom</Label>
                    <Input id="contact-name" name="contact-name" placeholder="Votre nom" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-white">Email</Label>
                    <Input id="contact-email" name="contact-email" type="email" placeholder="votre@email.com" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-white">Sujet</Label>
                  <Input id="contact-subject" name="contact-subject" placeholder="Objet de votre message" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-white">Message</Label>
                  <Textarea id="contact-message" name="contact-message" placeholder="Votre message..." required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full bg-[#c9a227] hover:bg-[#b8941f] text-[#1a2a4a] font-semibold">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer le Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f1a2e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Cabinet Notarial S.O. Nkondawiri" className="h-12 w-auto" />
                <div>
                  <p className="font-serif font-semibold text-white">Cabinet Notarial</p>
                  <p className="text-xs text-[#c9a227]">S.O. Nkondawiri</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-sm">
                Expertise notariale au service de vos projets. Sécurité juridique, 
                conseil personnalisé et accompagnement dans toutes vos démarches.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Award className="w-4 h-4 text-[#c9a227]" />
                <span>République Gabonaise</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-400 hover:text-[#c9a227] text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>011 77 37 35</li>
                <li>066 15 12 20</li>
                <li>BP 8350 Libreville</li>
                <li>Immeuble Hollando, 6ème étage</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Cabinet Notarial Suzanne Ogoula Nkondawiri. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm">
              Notaire achat immobilier Gabon — Libreville, République Gabonaise
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
