import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, ArrowRight, Heart, Plus, Lightbulb, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-white border-t-4" style={{ backgroundColor: 'var(--altudo-grey)', borderTopColor: 'var(--altudo-yellow)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Section - About Migration Wizard */}
          <div className="space-y-6 lg:space-y-8 lg:pr-8 lg:border-r lg:border-gray-600">
            <div>
              <h3 className="footer-heading mb-4">About Migration Wizard</h3>
              <p className="footer-body text-gray-300 mb-6">
                We are a content migration platform focused on delivering seamless, AI-powered migration experiences 
                across all digital channels. Our services span content modeling, data transformation, automated 
                migration workflows, and intelligent content mapping, serving industries like E-commerce, 
                Healthcare, Finance, Manufacturing, and Technology.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 py-4 sm:py-6 border-t border-gray-600">
              <div className="space-y-2 sm:space-y-3">
                <Link href="/features" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  FEATURES
                </Link>
                <Link href="/contact" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  CONTACT US
                </Link>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Link href="/documentation" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  DOCUMENTATION
                </Link>
                <Link href="/support" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  SUPPORT
                </Link>
                <Link href="/pricing" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  PRICING
                </Link>
                <Link href="/terms" className="footer-link block text-gray-300 hover:text-white transition-colors py-1">
                  TERMS OF USE
                </Link>
              </div>
            </div>

          </div>

          {/* Right Section - Get Started */}
          <div className="space-y-6 lg:space-y-8 lg:pl-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="footer-heading">Get Started</h3>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" style={{ color: 'var(--altudo-yellow)' }} />
                  <Plus className="h-4 w-4" style={{ color: 'var(--altudo-yellow)' }} />
                  <Heart className="h-6 w-6" style={{ color: 'var(--altudo-yellow)' }} />
                </div>
              </div>
              <p className="footer-body text-gray-300 mb-6">
                With a focus on AI-powered migration and seamless content transformation, we create intelligent 
                solutions that align with your unique migration objectives. Start your migration journey with 
                our 9-step wizard and drive impactful results.
              </p>
                <Link href="/wizard" className="inline-block">
                  <button className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity border-2 border-transparent hover:border-gray-600 w-full sm:w-auto justify-center sm:justify-start" style={{ backgroundColor: 'var(--altudo-yellow)', color: 'var(--altudo-grey)' }}>
                    Start Migration
                    <div className="w-px h-4" style={{ backgroundColor: 'var(--altudo-grey)' }}></div>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
            </div>

            <div className="border-t-2 border-gray-600 pt-6 sm:pt-8 mt-6 sm:mt-8">
              <div className="flex items-center gap-4 mb-4">
                <Send className="h-6 w-6" style={{ color: 'var(--altudo-yellow)' }} />
                <h4 className="footer-subheading" style={{ color: 'var(--altudo-yellow)' }}>Stay Updated with Migration Tips</h4>
              </div>
              <p className="footer-body text-gray-300 mb-6">
                Our resources can help you stay on top of content migration strategies with industry-optimized 
                insights and best practices for your business.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-altudo-yellow transition-colors cursor-pointer">
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--altudo-grey)' }} />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-altudo-yellow transition-colors cursor-pointer">
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--altudo-grey)' }} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-altudo-yellow transition-colors cursor-pointer">
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--altudo-grey)' }} />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center hover:bg-altudo-yellow transition-colors cursor-pointer">
                    <Youtube className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--altudo-grey)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
