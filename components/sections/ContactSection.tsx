'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { contactFormSchema, ContactFormData } from '@/lib/validation'
import { Section, Input, Textarea, Button, Card, CardContent } from '@/components/ui'

interface ContactSectionProps {
  locale: Locale
  dictionary: Dictionary
  fullPage?: boolean
}

const contactInfo = [
  { icon: Mail, label: 'toalhussein@gmail.com', href: 'mailto:toalhussein@gmail.com' },
  { icon: Phone, label: '01020379916', href: 'https://wa.me/201020379916' },
  { icon: MapPin, label: 'Egypt', href: '#' },
]

export function ContactSection({ locale, dictionary, fullPage = false }: ContactSectionProps) {
  const t = dictionary.contact
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })
      
      if (!response.ok) throw new Error('Failed to send message')
      
      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: locale === 'ar' ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t.subtitle}
          </h3>
          <p className="text-foreground-secondary leading-relaxed">
            {t.description}
          </p>
        </div>
        
        <div className="space-y-4">
          {contactInfo.map((info, index) => (
            <motion.a
              key={index}
              href={info.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: locale === 'ar' ? -5 : 5 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border hover:border-primary/50 hover:shadow-glow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <info.icon size={24} className="text-primary" />
              </div>
              <span className="text-foreground">{info.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
      
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: locale === 'ar' ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Card variant="glow">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="name"
                label={t.form.name}
                placeholder={t.form.namePlaceholder}
                error={errors.name?.message}
                {...register('name')}
              />
              
              <Input
                id="email"
                type="email"
                label={t.form.email}
                placeholder={t.form.emailPlaceholder}
                error={errors.email?.message}
                {...register('email')}
              />
              
              <Input
                id="subject"
                label={t.form.subject}
                placeholder={t.form.subjectPlaceholder}
                error={errors.subject?.message}
                {...register('subject')}
              />
              
              <Textarea
                id="message"
                label={t.form.message}
                placeholder={t.form.messagePlaceholder}
                error={errors.message?.message}
                rows={5}
                {...register('message')}
              />
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                <Send size={20} />
                {t.form.send}
              </Button>
              
              {/* Status messages */}
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500 text-center"
                >
                  {t.form.success}
                </motion.p>
              )}
              
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-center"
                >
                  {t.form.error}
                </motion.p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
  
  if (fullPage) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </motion.div>
          {content}
        </div>
      </div>
    )
  }
  
  return (
    <Section id="contact" title={t.title} subtitle="">
      {content}
    </Section>
  )
}
