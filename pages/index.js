// pages/index.js - Fixed Import Issue
import Head from 'next/head';
import SINDAAssistant from '../components/SINDAAssistant';

export default function Home() {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>SINDA Assistant - AI-Powered Community Support for Singapore Indian Community</title>
        <meta name="title" content="SINDA Assistant - AI-Powered Community Support for Singapore Indian Community" />
        <meta name="description" content="Your intelligent AI guide to Singapore Indian Development Association programs and services. Get personalized help with education, family services, youth development, and community support. Available in English, Tamil, Hindi, and Malayalam." />
        <meta name="keywords" content="SINDA, Singapore Indian Development Association, education programs, STEP tuition, family services, youth development, community support, AI assistant, financial assistance, crisis support, Tamil, Hindi, Malayalam, Singapore Indian community" />
        <meta name="author" content="Singapore Indian Development Association (SINDA)" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SINDA Assistant" />
        
        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SINDA Assistant" />
        <meta property="og:title" content="SINDA Assistant - AI-Powered Community Support" />
        <meta property="og:description" content="Your AI guide to SINDA programs and services. Supporting the Singapore Indian community since 1991 with education, family services, youth development, and community outreach." />
        <meta property="og:url" content="https://sinda-assistant.vercel.app" />
        <meta property="og:image" content="https://sinda-assistant.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SINDA Assistant - AI-powered support for Singapore Indian community" />
        <meta property="og:locale" content="en_SG" />
        <meta property="og:locale:alternate" content="ta_SG" />
        <meta property="og:locale:alternate" content="hi_IN" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SINDA_Singapore" />
        <meta name="twitter:creator" content="@SINDA_Singapore" />
        <meta name="twitter:title" content="SINDA Assistant - AI-Powered Community Support" />
        <meta name="twitter:description" content="Your AI guide to SINDA programs and services. Get personalized help with education, family services, and community support." />
        <meta name="twitter:image" content="https://sinda-assistant.vercel.app/twitter-image.png" />
        <meta name="twitter:image:alt" content="SINDA Assistant interface showing AI chat and analytics dashboard" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Theme and Brand Colors */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-navbutton-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to External Domains for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="preconnect" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://vercel.app" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/Inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://sinda-assistant.vercel.app" />
        
        {/* Alternative Language Pages */}
        <link rel="alternate" hrefLang="en-sg" href="https://sinda-assistant.vercel.app" />
        <link rel="alternate" hrefLang="ta-sg" href="https://sinda-assistant.vercel.app/ta" />
        <link rel="alternate" hrefLang="hi-in" href="https://sinda-assistant.vercel.app/hi" />
        <link rel="alternate" hrefLang="ml-in" href="https://sinda-assistant.vercel.app/ml" />
        <link rel="alternate" hrefLang="x-default" href="https://sinda-assistant.vercel.app" />
        
        {/* Contact and Organization Information */}
        <meta name="contact" content="queries@sinda.org.sg" />
        <meta name="coverage" content="Singapore" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Singapore Indian Development Association",
              "alternateName": ["SINDA", "SINDA Singapore"],
              "url": "https://sinda-assistant.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sinda-assistant.vercel.app/logo.png",
                "width": "400",
                "height": "400"
              },
              "description": "Singapore Indian Development Association (SINDA) is a self-help group for the Indian community in Singapore, providing education support, family services, youth development, and community outreach programs.",
              "foundingDate": "1991",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1 Beatty Road",
                "addressLocality": "Singapore",
                "postalCode": "209943",
                "addressCountry": "SG",
                "addressRegion": "Singapore"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+65-1800-295-3333",
                  "contactType": "customer service",
                  "areaServed": "SG",
                  "availableLanguage": ["en", "ta", "hi", "ml"],
                  "hoursAvailable": "24/7"
                },
                {
                  "@type": "ContactPoint",
                  "email": "queries@sinda.org.sg",
                  "contactType": "customer service",
                  "areaServed": "SG"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/SINDAsg",
                "https://www.instagram.com/sinda_sg",
                "https://www.linkedin.com/company/sinda-singapore"
              ],
              "knowsAbout": [
                "Education Support",
                "Family Services", 
                "Youth Development",
                "Community Outreach",
                "Financial Assistance",
                "Crisis Support",
                "STEP Tuition Program",
                "Singapore Indian Community"
              ],
              "serviceArea": {
                "@type": "Country",
                "name": "Singapore"
              }
            })
          }}
        />
        
        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is SINDA?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SINDA (Singapore Indian Development Association) is a self-help group established in 1991 to support the Indian community in Singapore through education, family services, youth development, and community outreach programs."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What is the STEP tuition program?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "STEP (SINDA Tutorials for Enhanced Performance) is SINDA's flagship tuition program for Primary and Secondary students, offering heavily subsidized classes at $10-15 per hour for eligible families."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I apply for SINDA programs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can apply by calling SINDA at 1800 295 3333, visiting their office at 1 Beatty Road, Singapore 209943, or emailing queries@sinda.org.sg. The AI assistant can also guide you through the application process."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the eligibility criteria for SINDA programs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most SINDA programs require a per capita income of ≤ $1,600 and are available to Singapore citizens and Permanent Residents of Indian descent. Specific programs may have additional criteria."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Performance Hints */}
        <link rel="prefetch" href="/api/chat" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300"
        >
          Skip to main content
        </a>
        
        {/* Main Content */}
        <div id="main-content" role="main" aria-label="SINDA Assistant Application">
          <SINDAAssistant />
        </div>
        
        {/* Screen Reader Information */}
        <div className="sr-only">
          <h1>SINDA Assistant - AI-Powered Community Support</h1>
          <p>
            An intelligent assistant to help you navigate Singapore Indian Development Association 
            programs and services. Get personalized guidance for education support, family services, 
            youth development, and community outreach programs. Available 24/7 with multilingual support.
          </p>
        </div>
        
        {/* Emergency Contact Information for Screen Readers */}
        <div className="sr-only" role="contentinfo" aria-label="Emergency Contact Information">
          <h2>Emergency Contact</h2>
          <p>For immediate assistance, call SINDA at 1-800-295-3333, available 24 hours a day, 7 days a week.</p>
          <p>Address: 1 Beatty Road, Singapore 209943</p>
          <p>Email: queries@sinda.org.sg</p>
        </div>
      </main>
    </>
  );
}
