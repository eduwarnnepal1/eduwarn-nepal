import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/images/logo.jpg" alt="EduWarn Logo" className="h-10 w-auto mr-2 invert brightness-0" />
          EduWarn Nepal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "EduWarn has completely transformed how I learn and share knowledge with my peers in Nepal. The community
              is incredibly supportive."
            </p>
            <footer className="text-sm font-semibold">Anjali Sharma, Computer Science Student</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
