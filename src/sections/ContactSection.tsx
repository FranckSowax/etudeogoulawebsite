import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import Reveal from '@/components/Reveal'

export default function ContactSection() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  }

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gold" />
              <span className="text-gold text-sm font-medium tracking-wider uppercase">
                Contact
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-5 sm:mb-6">
              Contactez votre Notaire au Gabon
            </h2>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Notre cabinet notarial à Libreville est à votre disposition pour tout
              achat immobilier au Gabon, conseil juridique et démarches notariales.
            </p>

            <div className="space-y-6">
              <DarkInfoRow icon={<MapPin className="w-6 h-6 text-gold" />} title="Adresse">
                Boulevard de la Nation<br />
                Immeuble Hollando, 6ème étage<br />
                Libreville, République Gabonaise<br />
                BP 8350
              </DarkInfoRow>
              <DarkInfoRow icon={<Phone className="w-6 h-6 text-gold" />} title="Téléphone">
                011 77 37 35<br />
                066 15 12 20
              </DarkInfoRow>
              <DarkInfoRow icon={<Clock className="w-6 h-6 text-gold" />} title="Horaires">
                Lundi au Vendredi<br />
                7h30 - 15h30
              </DarkInfoRow>
              <DarkInfoRow icon={<Mail className="w-6 h-6 text-gold" />} title="Email">
                contact@notaire-nkondawiri.ga
              </DarkInfoRow>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-white/10">
            <h3 className="font-serif text-xl text-white mb-6">Envoyez-nous un message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer le Message
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function DarkInfoRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-gray-300 text-sm">{children}</p>
      </div>
    </div>
  )
}
