import React from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-border mt-auto pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-lg">
              <Leaf className="h-5 w-5 text-secondary" />
              <span>CarbonWise</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">
              Your personal companion in understanding, tracking, and reducing your daily carbon footprint. Empowering individual actions for a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/assessment" className="text-slate-500 hover:text-primary transition-colors">
                  Assessment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-500 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-slate-500 hover:text-primary transition-colors">
                  What-If Simulator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Learn More</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-slate-500 hover:text-primary transition-colors">
                  Learn Hub
                </Link>
              </li>
              <li>
                <Link href="/learn#myths" className="text-slate-500 hover:text-primary transition-colors">
                  Myth Busters
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
          <span>&copy; {new Date().getFullYear()} CarbonWise. All rights reserved.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
