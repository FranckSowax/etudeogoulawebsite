import { useState } from 'react'
import { Calendar, Clock, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  message: '',
}

export default function AppointmentForm() {
  const [appointmentForm, setAppointmentForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('appointments').insert({
      name: appointmentForm.name,
      email: appointmentForm.email || null,
      phone: appointmentForm.phone,
      service: appointmentForm.service,
      date: appointmentForm.date,
      time: appointmentForm.time,
      message: appointmentForm.message || null,
    })
    setSubmitting(false)
    if (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
      return
    }
    toast.success('Votre demande de rendez-vous a été envoyée avec succès ! Nous vous contacterons bientôt.')
    setAppointmentForm(initialForm)
  }

  return (
    <section id="rendez-vous" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-gold text-sm font-medium tracking-wider uppercase">
                Rendez-vous
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-6">
              Rendez-vous avec votre Notaire à Libreville
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Planifiez votre consultation pour un achat immobilier au Gabon ou toute
              autre démarche notariale avec Maître Suzanne Ogoula Nkondawiri.
              Nous vous recevons du lundi au vendredi de 7h30 à 15h30.
            </p>

            <div className="space-y-6">
              <InfoRow icon={<Clock className="w-6 h-6 text-gold" />} title="Horaires d'ouverture">
                Lundi au Vendredi : 7h30 - 15h30
              </InfoRow>
              <InfoRow icon={<Phone className="w-6 h-6 text-gold" />} title="Téléphone">
                011 77 37 35 / 066 15 12 20
              </InfoRow>
              <InfoRow icon={<MapPin className="w-6 h-6 text-gold" />} title="Adresse">
                Boulevard de la Nation, Immeuble Hollando, 6ème étage<br />
                Libreville, République Gabonaise
              </InfoRow>
            </div>

            <div className="mt-8 p-6 bg-cream rounded-lg">
              <h4 className="font-medium text-navy mb-2">Documents à prévoir</h4>
              <p className="text-sm text-muted-foreground">
                Selon la nature de votre demande, pensez à apporter votre pièce d'identité,
                les documents relatifs à votre dossier, et tout autre document pertinent.
              </p>
            </div>
          </div>

          <div className="bg-cream p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={appointmentForm.name}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
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
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
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
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Type de service *</Label>
                <Select
                  value={appointmentForm.service}
                  onValueChange={(value) => setAppointmentForm({ ...appointmentForm, service: value })}
                  required
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immobilier">Droit Immobilier</SelectItem>
                    <SelectItem value="successions">Successions</SelectItem>
                    <SelectItem value="famille">Droit de la Famille</SelectItem>
                    <SelectItem value="societes">Droit des Sociétés</SelectItem>
                    <SelectItem value="authentification">Authentification d'actes</SelectItem>
                    <SelectItem value="patrimoine">Conseil Patrimonial</SelectItem>
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
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure préférée *</Label>
                  <Select
                    value={appointmentForm.time}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}
                    required
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
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
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
                  className="bg-white min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold h-12"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {submitting ? 'Envoi en cours…' : 'Demander un Rendez-vous'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Champs obligatoires. Nous vous contacterons pour confirmer votre rendez-vous.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-navy mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{children}</p>
      </div>
    </div>
  )
}
