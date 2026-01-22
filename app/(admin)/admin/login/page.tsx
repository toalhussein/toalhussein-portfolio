'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase'
import { loginSchema, LoginFormData } from '@/lib/validation'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { Profile } from '@/types'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .single()
      
      const profile = profileData as Profile | null
      
      if (profileError || profile?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('غير مصرح لك بالدخول')
        return
      }
      
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 start-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 end-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glow">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                toalhussein
              </h1>
              <p className="text-foreground-secondary">
                لوحة تحكم المدير
              </p>
            </div>
            
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="email"
                type="email"
                label="البريد الإلكتروني"
                placeholder="admin@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              
              <Input
                id="password"
                type="password"
                label="كلمة المرور"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                <LogIn size={20} />
                تسجيل الدخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
