import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProductsList } from './components/ProductsList';
import { StructureSection } from './components/StructureSection';
import { HowItWorks } from './components/HowItWorks';
import { GuaranteeSection } from './components/GuaranteeSection';
import { CentralTimer } from './components/CentralTimer';
import { Footer } from './components/Footer';
import { SalesPopup } from './components/SalesPopup';
import { CheckoutModal } from './components/CheckoutModal';
import { TermsModal } from './components/TermsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ComboProduct } from './types';

export default function App() {
  const [userCity, setUserCity] = useState<string>('sua região');
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [selectedProduct, setSelectedProduct] = useState<ComboProduct | null>(null);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  // Fetch geolocation city like the original script
  useEffect(() => {
    async function fetchUserLocation() {
      try {
        const res = await fetch('https://ipwho.is/');
        const data = await res.json();
        if (data && data.success && data.city) {
          setUserCity(data.city);
          return;
        }
      } catch (e) {
        // Fallback to secondary IP geolocation
      }

      try {
        const res2 = await fetch('https://ipapi.co/json/');
        const data2 = await res2.json();
        if (data2 && data2.city) {
          setUserCity(data2.city);
        }
      } catch (e) {
        // Keep fallback
      }
    }

    fetchUserLocation();
  }, []);

  // 25 min countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format MM:SS
  const formatTimer = (totalSec: number) => {
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mStr}:${sStr}`;
  };

  const timerFormatted = formatTimer(timerSeconds);

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-slate-800 pb-28 relative">
      {/* HEADER WITH TOP STICKY BANNER */}
      <Header timerText={timerFormatted} userCity={userCity} />

      {/* MAIN PRODUCTS GRID (#packs) */}
      <main>
        <ProductsList onSelectProduct={(prod) => setSelectedProduct(prod)} />

        {/* NOSSA ESTRUTURA BANNER */}
        <StructureSection />

        {/* COMO FUNCIONA */}
        <HowItWorks />

        {/* GARANTIA TOTAL E SEGURANÇA */}
        <GuaranteeSection />

        {/* TIMER CENTRAL E CTA FINAL */}
        <CentralTimer timerText={timerFormatted} />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenTerms={() => setShowTerms(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />

      {/* FLOATING SALES NOTIFICATION POPUP */}
      <SalesPopup userCity={userCity} />

      {/* CHECKOUT / BRAND SELECTION MODAL */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          userCity={userCity}
        />
      )}

      {/* TERMS OF USE MODAL */}
      {showTerms && (
        <TermsModal onClose={() => setShowTerms(false)} />
      )}

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <PrivacyModal onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  );
}
