"use client";

import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-900">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Skolrank
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Sök</Link>
            <Link href="/topplistan" className="hover:text-blue-600 transition-colors">Topplistan 🏆</Link>
            <Link href="/jamfor" className="hover:text-blue-600 transition-colors">Jämför</Link>
            
            {/* NY LÄNK */}
            <Link href="/huvudman" className="hover:text-blue-600 transition-colors">Huvudmän</Link>
            
            <Link href="/metod" className="hover:text-blue-600 transition-colors">Metod</Link>
            <Link href="/om" className="hover:text-blue-600 transition-colors">Om</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 p-4 border-t border-gray-100">
          <div className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <Link href="/" onClick={() => setIsOpen(false)}>Sök</Link>
            <Link href="/topplistan" onClick={() => setIsOpen(false)}>Topplistan</Link>
            <Link href="/jamfor" onClick={() => setIsOpen(false)}>Jämför</Link>
            
            {/* NY LÄNK */}
            <Link href="/huvudman" onClick={() => setIsOpen(false)}>Huvudmän</Link>
            
            <Link href="/metod" onClick={() => setIsOpen(false)}>Metod</Link>
            <Link href="/om" onClick={() => setIsOpen(false)}>Om</Link>
          </div>
        </div>
      )}
    </nav>
  );
}