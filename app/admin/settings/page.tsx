"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Lock, Eye } from "lucide-react"

interface Settings {
  siteName: string
  siteDescription: string
  announcement: string
  features: {
    forumEnabled: boolean
    blogEnabled: boolean
    gamificationEnabled: boolean
    emailNotifications: boolean
    twoFactorAuth: boolean
  }
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<Settings>({
    siteName: "EduWarn Nepal",
    siteDescription: "Learn, Grow, Decide",
    announcement: "",
    features: {
      forumEnabled: true,
      blogEnabled: true,
      gamificationEnabled: true,
      emailNotifications: true,
      twoFactorAuth: false,
    },
  })

  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    // In production, save to database
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleFeature = (feature: keyof typeof settings.features) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [feature]: !settings.features[feature],
      },
    })
  }

  const translations = {
    title: t({ en: "System Settings", ne: "प्रणाली सेटिङहरू" }),
    description: t({
      en: "Manage platform settings, features, and announcements",
      ne: "प्ल्याटफर्म सेटिङ, सुविधाहरू र घोषणाहरू व्यवस्थापन गर्नुहोस्",
    }),
    generalSettings: t({ en: "General Settings", ne: "सामान्य सेटिङहरू" }),
    siteName: t({ en: "Site Name", ne: "साइट नाम" }),
    siteDescription: t({ en: "Site Description", ne: "साइट विवरण" }),
    announcement: t({ en: "Site Announcement", ne: "साइट घोषणा" }),
    announcementPlaceholder: t({
      en: "Add an important announcement for all users...",
      ne: "सभी प्रयोगकर्ताहरूको लागि महत्वपूर्ण घोषणा जोड्नुहोस्...",
    }),
    featureToggles: t({ en: "Feature Toggles", ne: "सुविधा टॉगल" }),
    forum: t({ en: "Forum Module", ne: "फोरम मॉड्यूल" }),
    blog: t({ en: "Blog Module", ne: "ब्लग मॉड्यूल" }),
    gamification: t({ en: "Gamification System", ne: "गेमीकरण प्रणाली" }),
    notifications: t({ en: "Email Notifications", ne: "ईमेल सूचनाएं" }),
    twoFactor: t({ en: "Two-Factor Authentication", ne: "दुई-कारक प्रमाणीकरण" }),
    security: t({ en: "Security Settings", ne: "सुरक्षा सेटिङहरू" }),
    save: t({ en: "Save Changes", ne: "परिवर्तन सहेजें" }),
    saved: t({ en: "Settings saved successfully!", ne: "सेटिङ सफलतापूर्वक सहेजे गए!" }),
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">{translations.title}</h1>
        <p className="text-muted-foreground mt-2">{translations.description}</p>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {translations.saved}
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.generalSettings}</CardTitle>
          <CardDescription>
            {t({
              en: "Basic information about your platform",
              ne: "आपके प्लेटफॉर्म के बारे में बुनियादी जानकारी",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{translations.siteName}</Label>
            <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>{translations.siteDescription}</Label>
            <Input
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>{translations.announcement}</Label>
            <Textarea
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder={translations.announcementPlaceholder}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t({
                en: "This announcement will be displayed to all users on the home page.",
                ne: "यह घोषणा होम पेज पर सभी उपयोगकर्ताओं को दिखाई देगी।",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {translations.featureToggles}
          </CardTitle>
          <CardDescription>
            {t({
              en: "Enable or disable platform features",
              ne: "प्लेटफॉर्म सुविधाओं को सक्षम या अक्षम करें",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "forumEnabled", label: translations.forum, icon: "💬" },
            { key: "blogEnabled", label: translations.blog, icon: "📝" },
            { key: "gamificationEnabled", label: translations.gamification, icon: "🎮" },
            { key: "emailNotifications", label: translations.notifications, icon: "📧" },
          ].map((feature) => (
            <div
              key={feature.key}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <Label className="cursor-pointer">{feature.label}</Label>
              </div>
              <Switch
                checked={settings.features[feature.key as keyof typeof settings.features]}
                onCheckedChange={() => toggleFeature(feature.key as keyof typeof settings.features)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {translations.security}
          </CardTitle>
          <CardDescription>
            {t({
              en: "Manage security and authentication options",
              ne: "सुरक्षा और प्रमाणीकरण विकल्प प्रबंधित करें",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" />
              <Label className="cursor-pointer">{translations.twoFactor}</Label>
            </div>
            <Switch checked={settings.features.twoFactorAuth} onCheckedChange={() => toggleFeature("twoFactorAuth")} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} size="lg" className="w-full md:w-auto">
        {translations.save}
      </Button>
    </div>
  )
}
