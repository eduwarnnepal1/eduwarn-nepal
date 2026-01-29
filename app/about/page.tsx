"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Heart, Target, BookOpen, Globe, Facebook, Phone } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { images } from "@/lib/images"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">About EduWarn Nepal</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're building Nepal's largest free education platform, connecting students with quality learning
              opportunities regardless of their background or location.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  EduWarn Nepal started with a simple belief: every student deserves access to quality education,
                  regardless of their financial situation or where they live. What began as a small initiative to help
                  local students has grown into a comprehensive platform serving thousands across Nepal and beyond.
                </p>
                <p className="text-gray-600 mb-4">
                  We focus on Science, Computer Science, Technology, Mathematics, and Logic because these subjects form
                  the foundation for innovation and critical thinking in today's world. Our interactive approach
                  combines traditional teaching methods with modern technology to create an engaging learning
                  experience.
                </p>
                <p className="text-gray-600">
                  Our motto "Learn, Grow, Decide" reflects our commitment to not just sharing information, but helping
                  students develop the skills they need to think critically and make informed decisions throughout their
                  lives.
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src={images.hero.home || "/placeholder.svg"}
                  alt="Students collaborating in a modern learning environment"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Drives Us</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quality First</h3>
                  <p className="text-gray-600">
                    We maintain high educational standards while making content accessible and engaging for students at
                    all levels.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Open Access</h3>
                  <p className="text-gray-600">
                    Education should never be limited by financial barriers. That's why all our core content remains
                    completely free.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Inclusive Learning</h3>
                  <p className="text-gray-600">
                    We create content that welcomes students from all backgrounds and learning styles, fostering an
                    inclusive environment.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We constantly explore new ways to make learning more effective, engaging, and accessible through
                    technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-600">
                    Learning happens best in community. We foster connections between students, teachers, and mentors.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    We strive for excellence in everything we do, from content creation to student support and platform
                    development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Meet Our Team</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="overflow-hidden hover:shadow-md transition-all">
                <Image
                  src={images.founders.sabin || "/placeholder.svg"}
                  alt="Sabin Budhathoki - Educational Visionary"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-1">Sabin Budhathoki</h3>
                  <p className="text-blue-600 text-sm mb-3">Educational Visionary</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Passionate about making quality education accessible to everyone, Sabin leads our vision and
                    strategic direction.
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      href="https://www.facebook.com/share/158rCUDWBS/"
                      target="_blank"
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      Facebook
                    </Link>
                    <Link
                      href="https://wa.me/9840034153"
                      target="_blank"
                      className="flex items-center text-sm text-green-600 hover:underline"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-all">
                <Image
                  src="/images/design-mode/IMG_20250418_095043_879.jpg"
                  alt="Samir Ghimire - Content Strategist"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-1">Samir Ghimire</h3>
                  <p className="text-blue-600 text-sm mb-3">Content Strategist</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Technology expert focused on creating innovative learning solutions that engage and inspire
                    students.
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      href="https://www.facebook.com/share/15tMWsuH76/"
                      target="_blank"
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      Facebook
                    </Link>
                    <Link
                      href="https://wa.me/9766908406"
                      target="_blank"
                      className="flex items-center text-sm text-green-600 hover:underline"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-all">
                <Image
                  src="/images/design-mode/IMG_20250418_095100_827.jpg"
                  alt="Samraj Budhathoki - Creative Designer"
                  width={300}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-1">Samraj Budhathoki</h3>
                  <p className="text-blue-600 text-sm mb-3">Creative Designer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Specializes in creating visual designs that make complex topics easier to understand and remember.
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      href="https://www.facebook.com/samraz.budathoki.1"
                      target="_blank"
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <Facebook className="h-4 w-4 mr-1" />
                      Facebook
                    </Link>
                    <Link
                      href="https://wa.me/9865438982"
                      target="_blank"
                      className="flex items-center text-sm text-green-600 hover:underline"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Partners</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                We work with trusted educational partners to expand learning opportunities and provide comprehensive
                support to our students.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300">
                <Link
                  href="https://sajilotuition.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center group"
                >
                  <Image
                    src={images.partners.sajiloTuition || "/placeholder.svg"}
                    alt="Sajilo Tuition - Personalized Online Learning"
                    width={200}
                    height={200}
                    className="mx-auto mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Sajilo Tuition
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Personalized online tutoring platform offering one-on-one learning support
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-16 bg-blue-700 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Growing Impact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <p className="text-blue-100">Active Students</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-blue-100">Free Lessons</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <p className="text-blue-100">Districts Reached</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <p className="text-blue-100">Student Satisfaction</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xl mb-6 max-w-3xl mx-auto">
                These numbers represent real students whose lives have been touched by education. But we're just getting
                started - with your support, we can reach even more communities across Nepal and beyond.
              </p>
              <Button
                className="bg-white text-blue-700 hover:bg-gray-100"
                onClick={() => {
                  window.location.href = "/contact"
                }}
              >
                Join Our Mission
              </Button>
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Get Involved</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a student, educator, or supporter, there are many ways to be part of the EduWarn Nepal
              community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  window.location.href = "/volunteer"
                }}
              >
                Become a Volunteer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/partnership"
                }}
              >
                Partner With Us
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/contact"
                }}
              >
                Support Our Work
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
