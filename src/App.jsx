import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Dumbbell, Calendar, CreditCard, QrCode, 
  Bell, TrendingUp, AlertTriangle, CheckCircle, XCircle, Search, 
  Plus, Trash2, Shield, User, DollarSign, Activity, FileText, Download, 
  Phone, ArrowRight, LogOut, Check, Sparkles, MapPin, Clock, Award,
  ChevronRight, ArrowLeft, Utensils
} from 'lucide-react';

// Hardcoded Master Admin Credentials (Hidden from UI)
const ADMIN_CREDENTIALS = {
  identifier: 'admin@ironpulse.gym',
  username: 'admin',
  password: 'admin123',
  name: 'Vikram Singh (Gym Owner)'
};

// Owner Profile Data
const GYM_OWNER_PROFILE = {
  name: 'Vikram Singh',
  role: 'Founder & Head Strength Coach',
  phone: '+91 98765 43210',
  email: 'vikram.owner@ironpulse.gym',
  experience: '14+ Years in Bodybuilding & Strength Conditioning',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  bio: 'Certified CSCS coach and former national powerlifting athlete. Dedicated to building world-class fitness culture with scientific training methodologies, personalized nutrition, and discipline.'
};

// Gym Showcase Facilities & Timings
const GYM_INFO = {
  name: 'IRON PULSE FITNESS CLUB',
  tagline: 'Forge Your Elite Physique • Unmatched Strength & Guidance',
  address: 'Plot 42, Olympia Sports Complex, Sector 18, City Centre',
  phone: '+91 98765 43210',
  email: 'contact@ironpulse.gym',
  timings: 'Monday - Saturday: 5:30 AM - 10:30 PM | Sunday: 7:00 AM - 1:00 PM',
  photos: [
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
  ],
  about: 'Iron Pulse Fitness is a premier single-facility training center equipped with certified competition-grade barbells, calibrated plates, ergonomic pin-loaded and plate-loaded machines, Olympic platforms, and high-performance cardio suites. We offer dedicated physical conditioning, verified body-metric tracking, and diet planning.'
};

// Member duration tier pricing (₹700/month rate calculation)
const DURATION_RATES = {
  1: { price: 700, label: '1 Month (₹700/mo)' },
  3: { price: 2100, label: '3 Months (₹700/mo)' },
  6: { price: 4200, label: '6 Months (₹700/mo)' },
  12: { price: 8400, label: '12 Months (₹700/mo)' }
};

const TRAINER_MONTHLY_FEE = 2500; // ₹2,500/month per trainer

export default function App() {
  // Navigation Screens: 'splash' | 'showcase' | 'auth' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [splashProgress, setSplashProgress] = useState(0);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // null or { role, id, ... }
  const [authRole, setAuthRole] = useState('admin'); // 'admin' | 'trainer' | 'member'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Auth Inputs
  const [authInput, setAuthInput] = useState({
    identifier: '',
    password: '',
    fullName: '',
    phone: '',
    gender: 'Male',
    specialty: 'Strength & Conditioning',
    experience: '3 Years',
    months: 1 // Default duration in months
  });

  // App Data (Clean Start: zero dummy members, zero fake transactions)
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([
    {
      id: 't-1',
      name: 'Rohan Sharma',
      specialty: 'Hypertrophy & Weight Loss',
      phone: '+91 98111 22334',
      email: 'rohan.coach@ironpulse.gym',
      experience: '6 Years',
      photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
      bio: 'ACSM Certified Personal Trainer specialized in functional hypertrophy and metabolic conditioning.',
      active: true,
      password: '123'
    },
    {
      id: 't-2',
      name: 'Ananya Verma',
      specialty: 'Mobility, HIIT & Sports Rehab',
      phone: '+91 98222 33445',
      email: 'ananya.coach@ironpulse.gym',
      experience: '5 Years',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Rehabilitation specialist and strength coach focusing on posture correction and athletic endurance.',
      active: true,
      password: '123'
    }
  ]);

  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notices, setNotices] = useState([
    {
      id: 'n-1',
      title: 'Welcome to Iron Pulse Fitness Portal',
      content: 'Members can access their digital QR pass for turnstile entry, view custom workout programs, and review meal plans.',
      author: 'Vikram Singh (Owner)',
      date: new Date().toISOString().split('T')[0],
      pinned: true,
      tag: 'Announcement'
    }
  ]);
  const [workoutPlans, setWorkoutPlans] = useState({});
  const [dietPlans, setDietPlans] = useState({});
  const [progressRecords, setProgressRecords] = useState({});

  // Active Tab for dashboard
  const [activeTab, setActiveTab] = useState('overview');

  // Modals & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Search & Filter
  const [searchMember, setSearchMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Splash Screen Timer
  useEffect(() => {
    if (currentScreen === 'splash') {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setCurrentScreen('showcase');
            return 100;
          }
          return prev + 20;
        });
      }, 350);
      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  // =============================================================
  // 1. SPLASH SCREEN
  // =============================================================
  if (currentScreen === 'splash') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden font-sans">
        <div className="absolute w-96 h-96 bg-lime-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-lime-400 via-emerald-400 to-teal-300 flex items-center justify-center shadow-2xl shadow-lime-500/30 transform hover:scale-105 transition-transform duration-300">
              <Dumbbell className="w-12 h-12 text-black stroke-[2.5]" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-3xl blur-md opacity-40 -z-10 animate-pulse"></div>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-wider text-white uppercase">
              IRON<span className="text-lime-400">PULSE</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mt-1 font-semibold">
              FITNESS CLUB & ATHLETICS
            </p>
            <p className="text-xs text-zinc-500 mt-2 italic">
              "Strength, Conditioning & Scientific Performance"
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Initializing Experience • {splashProgress}%
            </span>
          </div>

          <button
            onClick={() => setCurrentScreen('showcase')}
            className="text-xs font-semibold text-zinc-400 hover:text-lime-400 flex items-center gap-1 transition-colors pt-4"
          >
            Skip to Gym Showcase <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // =============================================================
  // 2. PUBLIC SHOWCASE & GYM LANDING PAGE
  // =============================================================
  if (currentScreen === 'showcase') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-500 selection:text-black">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-2xl shadow-2xl">
            {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <CheckCircle className="w-5 h-5 text-lime-400" />}
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        )}

        {/* Top Header with Corner Login Button */}
        <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-lg shadow-lime-500/20">
              <Dumbbell className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-lg md:text-xl tracking-wider text-white uppercase">
                IRON<span className="text-lime-400">PULSE</span>
              </span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:block">Fitness Club</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#about-gym"
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 hidden md:block transition-colors"
            >
              About Gym
            </a>
            <a
              href="#owner-section"
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 hidden md:block transition-colors"
            >
              Owner
            </a>
            <a
              href="#trainers-section"
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 hidden md:block transition-colors"
            >
              Trainers
            </a>
            <a
              href="#plans-section"
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 hidden md:block transition-colors"
            >
              Memberships
            </a>

            {/* Corner Portal Button */}
            <button
              onClick={() => {
                setAuthRole('member');
                setAuthMode('login');
                setCurrentScreen('auth');
              }}
              className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-lime-400/20 transition-transform active:scale-95"
            >
              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Login / Portal</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8 border-b border-zinc-900 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-lime-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> High-Performance Strength & Physique Club
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
                Transform Your <span className="text-lime-400">Body</span> & Elevate Your <span className="text-emerald-400">Power</span>
              </h1>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
                {GYM_INFO.about}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    setAuthRole('member');
                    setAuthMode('register');
                    setCurrentScreen('auth');
                  }}
                  className="bg-lime-400 hover:bg-lime-300 text-black px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl shadow-lime-400/20"
                >
                  Join as Member <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setAuthRole('admin');
                    setAuthMode('login');
                    setCurrentScreen('auth');
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-lime-400" /> Admin / Staff Portal
                </button>
              </div>

              {/* Quick Facility Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900">
                <div>
                  <span className="text-xl font-black text-white">100%</span>
                  <p className="text-[11px] text-zinc-500">Commercial Grade</p>
                </div>
                <div>
                  <span className="text-xl font-black text-lime-400">QR Code</span>
                  <p className="text-[11px] text-zinc-500">Digital Check-In</p>
                </div>
                <div>
                  <span className="text-xl font-black text-emerald-400">Custom</span>
                  <p className="text-[11px] text-zinc-500">Diets & Workouts</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
                <img
                  src={GYM_INFO.photos[0]}
                  alt="Gym Interior"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-zinc-900/95 border border-zinc-800 p-4 rounded-2xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-lime-400/10 text-lime-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Open 7 Days</p>
                  <p className="text-[10px] text-zinc-400">5:30 AM – 10:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facility Gallery & About Gym */}
        <section id="about-gym" className="py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20">
              The Facility
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">World-Class Equipment & Space</h2>
            <p className="text-xs md:text-sm text-zinc-400">{GYM_INFO.address}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GYM_INFO.photos.map((src, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900">
                <img src={src} alt="Gym Space" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
                  <p className="text-xs font-bold text-zinc-200">
                    {i === 0 ? 'Free Weights & Olympic Platforms' : i === 1 ? 'Plate-Loaded & Cable Resistance' : 'Conditioning & Cardio Deck'}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">High hygiene standards and certified trainers always on floor.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OWNER PROFILE SECTION */}
        <section id="owner-section" className="py-16 px-4 md:px-8 bg-zinc-900/40 border-y border-zinc-900">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Leadership
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">About The Gym Owner</h2>
              <p className="text-xs text-zinc-400">Direct mentorship and vision from the gym founder.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-lime-400/40 shadow-xl mb-4 bg-zinc-950">
                  <img
                    src={GYM_OWNER_PROFILE.photo}
                    alt={GYM_OWNER_PROFILE.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-black text-white">{GYM_OWNER_PROFILE.name}</h3>
                <p className="text-xs font-bold text-lime-400">{GYM_OWNER_PROFILE.role}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 font-mono bg-zinc-950 px-3 py-1 rounded-xl border border-zinc-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {GYM_OWNER_PROFILE.phone}
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-xs md:text-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-950 text-zinc-300 font-semibold border border-zinc-800">
                  <Award className="w-4 h-4 text-lime-400" /> {GYM_OWNER_PROFILE.experience}
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {GYM_OWNER_PROFILE.bio}
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  "At Iron Pulse, we do not believe in cookie-cutter workouts. Every client who walks through our doors is evaluated, guided with proper biomechanics, and supported to prevent injury and maximize strength."
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-zinc-500">
                  <span>Email: <strong className="text-zinc-300">{GYM_OWNER_PROFILE.email}</strong></span>
                  <span>Facility: <strong className="text-zinc-300">Iron Pulse Single-Center Gym</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRAINERS SHOWCASE SECTION */}
        <section id="trainers-section" className="py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              Expert Coaches
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Meet Our Certified Trainers</h2>
            <p className="text-xs text-zinc-400">Professional coaches ready to prepare your custom workout & nutrition splits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainers.map((t) => (
              <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div>
                    <h3 className="text-lg font-black text-white">{t.name}</h3>
                    <p className="text-xs font-bold text-cyan-400">{t.specialty}</p>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{t.bio}</p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-lime-400" /> {t.phone}
                    </span>
                    <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {t.experience} Exp
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MEMBERSHIP PLANS / DURATION SHOWCASE */}
        <section id="plans-section" className="py-16 px-4 md:px-8 bg-zinc-900/30 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20">
                Simple Pricing
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Standard Fees: ₹700 / Month</h2>
              <p className="text-xs text-zinc-400">Transparent cash & UPI QR fees. Dedicated trainer support (₹2,500/mo). Choose your training tenure.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(DURATION_RATES).map(([months, info]) => (
                <div
                  key={months}
                  className={`bg-zinc-900 border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all hover:border-lime-400/40 ${
                    months === '12' ? 'border-lime-500/50 shadow-xl shadow-lime-500/10' : 'border-zinc-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-black text-zinc-400">{months} Month{months > 1 ? 's' : ''}</span>
                      {months === '12' && (
                        <span className="text-[10px] font-black uppercase bg-lime-400 text-black px-2 py-0.5 rounded">Popular</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">₹{info.price}</span>
                      <span className="text-xs text-zinc-500">total (₹700/mo)</span>
                    </div>
                    <p className="text-xs text-zinc-400">{info.label}</p>
                    <ul className="text-xs text-zinc-400 space-y-1.5 pt-2">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> Full gym floor access</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> Personal QR attendance pass</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-lime-400" /> Workout & diet tracking</li>
                      {parseInt(months) >= 3 && (
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Coach review</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setAuthInput({ ...authInput, months: parseInt(months) });
                      setAuthRole('member');
                      setAuthMode('register');
                      setCurrentScreen('auth');
                    }}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-lime-400 hover:text-black font-black text-xs transition-colors text-white"
                  >
                    Enroll {months} Mo (₹{info.price})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-xs text-zinc-500 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-lime-400" />
            <span className="font-bold text-zinc-300">IRON PULSE FITNESS CLUB</span>
          </div>
          <p>© {new Date().getFullYear()} Single Gym Facility. Strict Cash & UPI Desk Verification.</p>
        </footer>
      </div>
    );
  }

  // =============================================================
  // 3. AUTHENTICATION GATEWAY (LOGIN & REGISTER)
  // =============================================================
  if (currentScreen === 'auth') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between font-sans selection:bg-lime-500 selection:text-black">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-2xl shadow-2xl">
            {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <CheckCircle className="w-5 h-5 text-lime-400" />}
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        )}

        {/* Header with Back to Showcase Button */}
        <header className="p-4 md:p-6 border-b border-zinc-900 flex items-center justify-between max-w-5xl mx-auto w-full">
          <button
            onClick={() => setCurrentScreen('showcase')}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Gym Home
          </button>

          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-lime-400" />
            <span className="font-black text-sm uppercase tracking-wider text-white">IRON<span className="text-lime-400">PULSE</span></span>
          </div>
        </header>

        {/* Center Auth Card */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Role Switcher */}
            <div>
              <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider text-center mb-3">Select Login Dashboard</p>
              <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setAuthRole('admin'); setAuthMode('login'); }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authRole === 'admin' ? 'bg-lime-400 text-black shadow-md shadow-lime-400/20' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole('trainer')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authRole === 'trainer' ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/20' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" /> Trainer
                </button>
                <button
                  type="button"
                  onClick={() => setAuthRole('member')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    authRole === 'member' ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Member
                </button>
              </div>
            </div>

            {/* Mode Switcher: Login or Register (Admin can only login) */}
            {authRole !== 'admin' ? (
              <div className="flex border-b border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 pb-2.5 font-bold transition-colors ${authMode === 'login' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-zinc-400'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 pb-2.5 font-bold transition-colors ${authMode === 'register' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-zinc-400'}`}
                >
                  Register New {authRole === 'trainer' ? 'Trainer' : 'Member'}
                </button>
              </div>
            ) : (
              <div className="border-b border-zinc-800 pb-2 text-center">
                <span className="text-xs font-bold text-zinc-300">Gym Owner Security Portal</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4 text-xs">
              {/* Extra registration inputs */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={authInput.fullName}
                      onChange={(e) => setAuthInput({ ...authInput, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-lime-400 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-semibold block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={authInput.phone}
                      onChange={(e) => setAuthInput({ ...authInput, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-lime-400 text-xs"
                    />
                  </div>

                  {authRole === 'trainer' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">Specialty</label>
                        <input
                          type="text"
                          placeholder="e.g. Strength / Crossfit"
                          value={authInput.specialty}
                          onChange={(e) => setAuthInput({ ...authInput, specialty: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 3 Years"
                          value={authInput.experience}
                          onChange={(e) => setAuthInput({ ...authInput, experience: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {authRole === 'member' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">Gender</label>
                        <select
                          value={authInput.gender}
                          onChange={(e) => setAuthInput({ ...authInput, gender: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Desired Duration (Months) */}
                      <div>
                        <label className="text-zinc-400 font-semibold block mb-1">Desired Duration (₹700/Month)</label>
                        <select
                          value={authInput.months}
                          onChange={(e) => setAuthInput({ ...authInput, months: parseInt(e.target.value) })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-xs font-semibold"
                        >
                          <option value={1}>1 Month (₹700)</option>
                          <option value={3}>3 Months (₹2,100)</option>
                          <option value={6}>6 Months (₹4,200)</option>
                          <option value={12}>12 Months (₹8,400)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Identifier (Email / Username / Phone) */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">
                  {authRole === 'admin'
                    ? 'Admin Username or Email'
                    : authRole === 'member'
                    ? 'Email, Phone or Member ID'
                    : 'Email or Phone'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    authRole === 'admin'
                      ? 'Enter admin username or email'
                      : authRole === 'member'
                      ? 'e.g. phone or IP-1001'
                      : 'coach@ironpulse.gym'
                  }
                  value={authInput.identifier}
                  onChange={(e) => setAuthInput({ ...authInput, identifier: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-lime-400 text-xs"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authInput.password}
                  onChange={(e) => setAuthInput({ ...authInput, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-lime-400 text-xs"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  authRole === 'admin'
                    ? 'bg-lime-400 hover:bg-lime-300 text-black shadow-lime-400/20'
                    : authRole === 'trainer'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/20'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-cyan-400/20'
                }`}
              >
                {authMode === 'login' ? `Login to ${authRole.toUpperCase()} Dashboard` : `Complete ${authRole.toUpperCase()} Registration`}
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          </div>
        </main>

        <footer className="p-4 text-center text-xs text-zinc-600 border-t border-zinc-900">
          Iron Pulse Gym Management • Protected Single Facility Instance
        </footer>
      </div>
    );
  }

  // =============================================================
  // 4. AUTHENTICATED DASHBOARDS (ADMIN / TRAINER / MEMBER)
  // =============================================================
  const currentRole = currentUser?.role || 'admin';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-lime-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-lg shadow-lime-500/20">
            <Dumbbell className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white uppercase">IRON<span className="text-lime-400">PULSE</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {currentRole.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {currentRole === 'admin' ? 'Gym Owner Console' : currentRole === 'trainer' ? `Coach: ${currentUser.name}` : `Member: ${currentUser.fullName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-zinc-200">{currentUser.name || currentUser.fullName}</span>
            <span className="text-[10px] text-zinc-500 font-mono">{currentUser.email || currentUser.memberId}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-950 text-zinc-300 hover:text-rose-400 border border-zinc-700 text-xs font-bold transition-all"
            title="Log out of system"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <CheckCircle className="w-5 h-5 text-lime-400" />}
          <span className="text-sm font-medium">{toastMessage.msg}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-zinc-900/60 border-r border-zinc-800/80 p-4 hidden md:flex flex-col justify-between">
          <div className="space-y-6">
            <div className="px-3 py-2 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-lime-400 font-bold border border-zinc-700">
                {currentRole === 'admin' ? 'AD' : currentRole === 'trainer' ? 'TR' : 'MB'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-zinc-400 capitalize">{currentRole} Portal</p>
                <p className="text-sm font-bold truncate text-zinc-100">{currentUser.name || currentUser.fullName}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {currentRole === 'admin' && (
                <>
                  <NavItem icon={TrendingUp} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  <NavItem icon={Shield} label="Approvals & Requests" active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} badge={stats.totalPending > 0 ? `${stats.totalPending} New` : undefined} />
                  <NavItem icon={Users} label="Members" active={activeTab === 'members'} onClick={() => setActiveTab('members')} badge={members.length} />
                  <NavItem icon={Dumbbell} label="Trainers" active={activeTab === 'trainers'} onClick={() => setActiveTab('trainers')} badge={trainers.length} />
                  <NavItem icon={CreditCard} label="Payments & UPI" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                  <NavItem icon={QrCode} label="Desk Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                  <NavItem icon={DollarSign} label="Financials & Exp" active={activeTab === 'finances'} onClick={() => setActiveTab('finances')} />
                  <NavItem icon={Bell} label="Notices & News" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
                </>
              )}

              {currentRole === 'trainer' && (
                <>
                  <NavItem icon={TrendingUp} label="Coach Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  <NavItem icon={Users} label="Assigned Members" active={activeTab === 'members'} onClick={() => setActiveTab('members')} />
                  <NavItem icon={Dumbbell} label="Workout Regimens" active={activeTab === 'workouts'} onClick={() => setActiveTab('workouts')} />
                  <NavItem icon={Utensils} label="Diet & Nutrition" active={activeTab === 'diets'} onClick={() => setActiveTab('diets')} />
                  <NavItem icon={Bell} label="Notices" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
                </>
              )}

              {currentRole === 'member' && (
                <>
                  <NavItem icon={TrendingUp} label="My Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  <NavItem icon={QrCode} label="My Pass & QR" active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} />
                  <NavItem icon={Dumbbell} label="Workout Routine" active={activeTab === 'workout'} onClick={() => setActiveTab('workout')} />
                  <NavItem icon={Utensils} label="Nutrition Diet" active={activeTab === 'diet'} onClick={() => setActiveTab('diet')} />
                  <NavItem icon={TrendingUp} label="Body Metrics" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
                  <NavItem icon={CreditCard} label="Payment Records" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                  <NavItem icon={Bell} label="Notices" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
                </>
              )}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6">
          {currentRole === 'admin' && (
            <AdminView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              stats={stats}
              members={members}
              setMembers={setMembers}
              trainers={trainers}
              setTrainers={setTrainers}
              attendance={attendance}
              payments={payments}
              expenses={expenses}
              notices={notices}
              searchMember={searchMember}
              setSearchMember={setSearchMember}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              handleCheckIn={handleCheckIn}
              handleCheckOut={handleCheckOut}
              handleVerifyUPI={handleVerifyUPI}
              handleApproveMember={handleApproveMember}
              handleRejectMember={handleRejectMember}
              handleApproveTrainer={handleApproveTrainer}
              handleRejectTrainer={handleRejectTrainer}
              setActiveModal={setActiveModal}
              setSelectedItem={setSelectedItem}
              showToast={showToast}
            />
          )}

          {currentRole === 'trainer' && (
            <TrainerView
              activeTab={activeTab}
              trainer={currentUser}
              members={members}
              workoutPlans={workoutPlans}
              setWorkoutPlans={setWorkoutPlans}
              dietPlans={dietPlans}
              setDietPlans={setDietPlans}
              notices={notices}
              showToast={showToast}
            />
          )}

          {currentRole === 'member' && (
            <MemberView
              activeTab={activeTab}
              member={currentUser}
              trainer={trainers.find((t) => t.id === currentUser.trainerId)}
              attendance={attendance.filter((a) => a.memberId === currentUser.id)}
              payments={payments.filter((p) => p.memberId === currentUser.id)}
              workoutPlan={workoutPlans[currentUser.id] || []}
              dietPlan={dietPlans[currentUser.id]}
              progressRecords={progressRecords[currentUser.id] || []}
              setProgressRecords={(updater) => {
                setProgressRecords((prev) => ({
                  ...prev,
                  [currentUser.id]: typeof updater === 'function' ? updater(prev[currentUser.id] || []) : updater
                }));
              }}
              notices={notices}
              handleCheckIn={handleCheckIn}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {activeModal && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          {activeModal === 'addMember' && (
            <AddMemberModal
              trainers={trainers}
              onClose={() => setActiveModal(null)}
              onSave={(newM) => {
                setMembers([...members, newM]);
                showToast(`Member ${newM.fullName} enrolled!`);
                setActiveModal(null);
              }}
            />
          )}

          {activeModal === 'recordPayment' && (
            <RecordPaymentModal
              members={members}
              onClose={() => setActiveModal(null)}
              onSubmit={handleRecordPayment}
            />
          )}

          {activeModal === 'receipt' && selectedItem && (
            <ReceiptModal payment={selectedItem} onClose={() => setActiveModal(null)} />
          )}

          {activeModal === 'addTrainer' && (
            <AddTrainerModal
              onClose={() => setActiveModal(null)}
              onSave={(newT) => {
                setTrainers([...trainers, newT]);
                showToast(`Coach ${newT.name} registered!`);
                setActiveModal(null);
              }}
            />
          )}

          {activeModal === 'addExpense' && (
            <AddExpenseModal
              onClose={() => setActiveModal(null)}
              onSave={(newE) => {
                setExpenses([...expenses, newE]);
                showToast('Expense recorded successfully!');
                setActiveModal(null);
              }}
            />
          )}

          {activeModal === 'createNotice' && (
            <CreateNoticeModal
              author={currentRole === 'admin' ? 'Admin' : currentUser.name}
              onClose={() => setActiveModal(null)}
              onSave={(notice) => {
                setNotices([notice, ...notices]);
                showToast('Notice published!');
                setActiveModal(null);
              }}
            />
          )}
        </ModalContainer>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// NAV ITEM
// -------------------------------------------------------------
function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-zinc-800 text-lime-400 font-semibold shadow-inner' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-lime-400' : 'text-zinc-400'}`} />
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-950 font-bold text-zinc-300 border border-zinc-800">
          {badge}
        </span>
      )}
    </button>
  );
}

// =============================================================
// ADMIN VIEW
// =============================================================
function AdminView({
  activeTab,
  stats,
  members,
  setMembers,
  trainers,
  attendance,
  payments,
  expenses,
  notices,
  searchMember,
  setSearchMember,
  filterStatus,
  setFilterStatus,
  handleCheckIn,
  handleCheckOut,
  handleVerifyUPI,
  handleApproveMember,
  handleRejectMember,
  handleApproveTrainer,
  handleRejectTrainer,
  setActiveModal,
  setSelectedItem,
  showToast
}) {
  const [qrScanInput, setQrScanInput] = useState('');

  const pendingMembers = useMemo(() => members.filter((m) => m.status === 'Pending'), [members]);
  const pendingTrainers = useMemo(() => trainers.filter((t) => t.status === 'Pending'), [trainers]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(searchMember.toLowerCase()) ||
        m.memberId.toLowerCase().includes(searchMember.toLowerCase()) ||
        m.phone.includes(searchMember);
      const matchFilter = filterStatus === 'All' || m.status === filterStatus;
      return matchSearch && matchFilter;
    });
  }, [members, searchMember, filterStatus]);

  return (
    <div className="space-y-6">
      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Gym Owner Control Center</h1>
              <p className="text-sm text-zinc-400">Total single-gym overview, memberships, and cash flow.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModal('recordPayment')}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
              >
                <DollarSign className="w-4 h-4 text-lime-400" /> Record Payment
              </button>
              <button
                onClick={() => setActiveModal('addMember')}
                className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-lime-400/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Enroll Member
              </button>
            </div>
          </div>

          {/* Pending Approval Notice Banner */}
          {stats.totalPending > 0 && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Pending Approval Requests ({stats.totalPending})</h4>
                  <p className="text-xs text-amber-200/80">
                    {stats.pendingM} Member(s) and {stats.pendingT} Trainer(s) registration approvals pending.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('approvals')}
                className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-black px-4 py-2 rounded-xl"
              >
                Review Approvals
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Members" value={stats.totalM} subtitle={`${stats.activeM} active • ${stats.pendingM} pending`} icon={Users} color="lime" />
            <MetricCard title="Today's Attendance" value={stats.todayAtt} subtitle="Checked in today" icon={QrCode} color="emerald" />
            <MetricCard title="Gross Income" value={`₹${stats.totalIncome}`} subtitle={`₹${stats.totalCash} Cash • ₹${stats.totalUPI} UPI`} icon={CreditCard} color="cyan" />
            <MetricCard title="Net Profit / Loss" value={`₹${stats.netProfit}`} subtitle={`Overhead: ₹${stats.totalExp}`} icon={Activity} color={stats.netProfit >= 0 ? 'lime' : 'rose'} />
          </div>

          {/* Quick Desk Scanner & Floor Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-lime-400" /> Fast Desk Check-In
                </h3>
                <span className="text-[10px] uppercase font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">Scanner</span>
              </div>
              <p className="text-xs text-zinc-400">Scan or type Member ID (e.g. IP-1001) for instant check-in:</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (qrScanInput.trim()) {
                    handleCheckIn(qrScanInput.trim(), 'Staff Desk');
                    setQrScanInput('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Enter Member ID"
                  value={qrScanInput}
                  onChange={(e) => setQrScanInput(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                />
                <button type="submit" className="bg-lime-400 hover:bg-lime-300 text-black px-3.5 py-2 rounded-xl text-xs font-bold">
                  Check In
                </button>
              </form>

              <div className="border-t border-zinc-800 pt-3">
                <span className="text-xs font-semibold text-zinc-400 block mb-2">Live On-Floor ({attendance.filter((a) => !a.checkOutTime).length})</span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {attendance.filter((a) => !a.checkOutTime).length === 0 ? (
                    <div className="text-center py-5 text-xs text-zinc-600">No members checked-in right now.</div>
                  ) : (
                    attendance.filter((a) => !a.checkOutTime).map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-xs bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                        <div>
                          <p className="font-semibold text-zinc-200">{a.memberName}</p>
                          <p className="text-[11px] text-zinc-500">In at {a.checkInTime} • {a.method}</p>
                        </div>
                        <button
                          onClick={() => handleCheckOut(a.id)}
                          className="text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/30 px-2 py-1 rounded border border-rose-800/50"
                        >
                          Check Out
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Recent Transactions & Verification
                </h3>
                <span className="text-xs text-zinc-400">Cash & UPI QR Only</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="pb-2 font-medium">Receipt ID</th>
                      <th className="pb-2 font-medium">Member</th>
                      <th className="pb-2 font-medium">Method</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-zinc-600">No payment records yet.</td>
                      </tr>
                    ) : (
                      payments.slice(0, 4).map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-800/30">
                          <td className="py-2.5 font-mono text-zinc-300">{p.id}</td>
                          <td className="py-2.5 font-semibold text-zinc-200">{p.memberName}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.method === 'UPI' ? 'bg-cyan-950 text-cyan-400' : 'bg-emerald-950 text-emerald-400'}`}>
                              {p.method}
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-zinc-100">₹{p.amount}</td>
                          <td className="py-2.5">
                            {p.status === 'Verified' ? (
                              <span className="text-[10px] text-lime-400 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => handleVerifyUPI(p.id)}
                                className="bg-amber-400 hover:bg-amber-300 text-black px-2 py-0.5 rounded text-[10px] font-black"
                              >
                                Verify
                              </button>
                            )}
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => { setSelectedItem(p); setActiveModal('receipt'); }}
                              className="text-[11px] text-zinc-400 hover:text-white"
                            >
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FINANCIALS TAB */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Financial Statement & Expenses</h2>
              <p className="text-xs text-zinc-400">Track gym cash flow and overhead expenses.</p>
            </div>
            <button
              onClick={() => setActiveModal('addExpense')}
              className="bg-rose-500 hover:bg-rose-400 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Gym Expense
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs text-zinc-400 font-medium">Income Breakdown</span>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Cash Collections:</span>
                  <span className="font-mono font-bold text-emerald-400">₹{stats.totalCash}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">UPI Collections:</span>
                  <span className="font-mono font-bold text-cyan-400">₹{stats.totalUPI}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-xs font-bold text-white">
                  <span>Total Gross Income:</span>
                  <span className="font-mono text-lime-400">₹{stats.totalIncome}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs text-zinc-400 font-medium">Operating Overhead</span>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Logged Expenses:</span>
                  <span className="font-mono font-bold text-rose-400">₹{stats.totalExp}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Pending Dues:</span>
                  <span className="font-mono font-bold text-amber-400">₹{stats.pendingDues}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-xs font-bold text-white">
                  <span>Net Profit Margin:</span>
                  <span className={`font-mono ${stats.netProfit >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                    ₹{stats.netProfit}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-1">
              <span className="text-xs text-zinc-400">Gym Profit Margin</span>
              <span className="text-3xl font-black text-lime-400">
                {stats.totalIncome > 0 ? Math.round((stats.netProfit / stats.totalIncome) * 100) : 0}%
              </span>
              <p className="text-[11px] text-zinc-500">Based on cash/UPI receipts and expenses</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. NOTICES */}
      {activeTab === 'notices' && (
        <NoticeBoard notices={notices} onNewNotice={() => setActiveModal('createNotice')} />
      )}
    </div>
  );
}

// =============================================================
// TRAINER VIEW
// =============================================================
function TrainerView({ activeTab, trainer, members, workoutPlans, setWorkoutPlans, dietPlans, setDietPlans, notices, showToast }) {
  const assignedClients = members.filter((m) => m.trainerId === trainer.id);
  const [selectedClientId, setSelectedClientId] = useState(assignedClients[0]?.id || '');
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('4');
  const [newExReps, setNewExReps] = useState('10');

  const clientObj = members.find((m) => m.id === selectedClientId) || assignedClients[0];

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim() || !clientObj) return;

    const newEx = { name: newExName, sets: newExSets, reps: newExReps, rest: '60s' };
    const currentWorkouts = workoutPlans[clientObj.id] || [{ day: 'Workout Split', exercises: [] }];
    const updated = [...currentWorkouts];
    if (!updated[0]) updated[0] = { day: 'Workout Split', exercises: [] };
    updated[0].exercises.push(newEx);

    setWorkoutPlans({ ...workoutPlans, [clientObj.id]: updated });
    setNewExName('');
    showToast(`Added ${newEx.name} to ${clientObj.fullName}'s workout!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Coach Portal: {trainer.name}</h1>
          <p className="text-sm text-zinc-400">{trainer.specialty} • {assignedClients.length} Assigned Clients</p>
        </div>

        {assignedClients.length > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium">Selected Athlete:</span>
            <select
              value={selectedClientId || assignedClients[0]?.id}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              {assignedClients.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.memberId})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Assigned Clients" value={assignedClients.length} subtitle="Under your direct guidance" icon={Users} color="emerald" />
          <MetricCard title="Active Members" value={assignedClients.filter((c) => c.status === 'Active').length} subtitle="Valid membership status" icon={Calendar} color="lime" />
          <MetricCard title="Workout Plans" value={Object.keys(workoutPlans).length} subtitle="Custom routines generated" icon={Dumbbell} color="cyan" />
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base text-zinc-100">Workout Builder</h3>
          {!clientObj ? (
            <p className="text-xs text-zinc-600 py-6 text-center">No assigned client selected or available.</p>
          ) : (
            <>
              <p className="text-xs text-zinc-400">Editing regimen for <strong className="text-white">{clientObj.fullName}</strong>:</p>
              <form onSubmit={handleAddExercise} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Exercise Name (e.g. Barbell Squat)"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Sets (4)"
                  value={newExSets}
                  onChange={(e) => setNewExSets(e.target.value)}
                  className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Reps (10)"
                  value={newExReps}
                  onChange={(e) => setNewExReps(e.target.value)}
                  className="w-20 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                />
                <button type="submit" className="bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-black">
                  Add
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {(workoutPlans[clientObj.id] || []).map((day, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {day.exercises.map((ex, i) => (
                      <div key={i} className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-xs">
                        <span className="font-bold text-zinc-200">{ex.name}</span>
                        <span className="font-mono text-lime-400">{ex.sets} Sets × {ex.reps} Reps</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'diets' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base text-zinc-100">Nutrition Plan</h3>
          <p className="text-xs text-zinc-500">Meal split guidelines and calorie intake recommendations.</p>
        </div>
      )}

      {activeTab === 'notices' && <NoticeBoard notices={notices} readOnly />}
    </div>
  );
}

// =============================================================
// MEMBER VIEW
// =============================================================
function MemberView({ activeTab, member, trainer, attendance, payments, workoutPlan, dietPlan, progressRecords, setProgressRecords, notices, handleCheckIn, showToast }) {
  const [newWeight, setNewWeight] = useState('');
  const [newChest, setNewChest] = useState('');

  const daysRemaining = useMemo(() => {
    if (!member.expiryDate) return 0;
    const diff = new Date(member.expiryDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [member.expiryDate]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-black text-2xl flex items-center justify-center">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{member.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                {member.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">ID: {member.memberId} • Joined: {member.joinDate}</p>
            <p className="text-xs text-zinc-300 mt-1">
              Plan: <span className="font-bold text-lime-400">{member.planTitle || `${member.monthsEnrolled} Months`}</span> ({daysRemaining} days left)
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCheckIn(member.id, 'Self Digital Pass')}
          className="bg-lime-400 hover:bg-lime-300 text-black px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-lime-400/20"
        >
          <QrCode className="w-4 h-4 stroke-[2.5]" /> Instant Check-In
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Membership Status" value={member.status} subtitle={`Expires ${member.expiryDate}`} icon={Award} color="lime" />
          <MetricCard title="Gym Visits" value={attendance.length} subtitle="Recorded sessions" icon={Activity} color="emerald" />
          <MetricCard title="Assigned Coach" value={trainer ? trainer.name.split(' ')[0] : 'None'} subtitle={trainer?.specialty || 'General'} icon={Dumbbell} color="cyan" />
          <MetricCard title="Balance Due" value={`₹${member.balanceDue || 0}`} subtitle="Cash or Reception UPI" icon={CreditCard} color="amber" />
        </div>
      )}

      {activeTab === 'qr' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md mx-auto text-center space-y-6">
          <h2 className="text-xl font-black text-white">Digital Turnstile Pass</h2>
          <div className="bg-white p-6 rounded-3xl mx-auto w-fit shadow-2xl flex flex-col items-center">
            <QrCode className="w-44 h-44 text-black" />
            <span className="text-black font-black font-mono tracking-widest text-xs mt-3">{member.memberId}</span>
          </div>
          <p className="text-xs text-zinc-400">Present this QR at reception or the turnstile scanner for instant check-in.</p>
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-black text-white">Assigned Workout Routine</h2>
          {workoutPlan.length === 0 ? (
            <p className="text-xs text-zinc-600 py-6 text-center">No workout assigned yet by your trainer.</p>
          ) : (
            workoutPlan.map((d, i) => (
              <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-lime-400">{d.day}</span>
                {d.exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="flex justify-between items-center text-xs bg-zinc-900 p-2 rounded">
                    <span>{ex.name}</span>
                    <span className="font-mono text-zinc-400">{ex.sets} Sets × {ex.reps} Reps</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-black text-white">Your Payment Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Receipt</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-zinc-600">No payment records on file.</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono">{p.id}</td>
                      <td className="py-2.5 px-3">{p.method}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">₹{p.amount}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">{p.date}</td>
                      <td className="py-2.5 px-3 text-lime-400 font-bold">{p.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'notices' && <NoticeBoard notices={notices} readOnly />}
    </div>
  );
}

// =============================================================
// NOTICE BOARD COMPONENT
// =============================================================
function NoticeBoard({ notices, onNewNotice, readOnly }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Gym Notice Board</h2>
          <p className="text-xs text-zinc-400">Gym news, schedule alerts, and workshops.</p>
        </div>
        {!readOnly && onNewNotice && (
          <button
            onClick={onNewNotice}
            className="bg-lime-400 hover:bg-lime-300 text-black px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Post Notice
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div key={n.id} className="p-5 rounded-2xl border bg-zinc-900 border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">{n.tag}</span>
              <span className="text-[11px] font-mono text-zinc-500">{n.date}</span>
            </div>
            <h3 className="font-bold text-base text-zinc-100">{n.title}</h3>
            <p className="text-xs text-zinc-400">{n.content}</p>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              Author: <strong className="text-zinc-300">{n.author}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================
// KPI METRIC CARD
// =============================================================
function MetricCard({ title, value, subtitle, icon: Icon, color = 'lime' }) {
  const colorMap = {
    lime: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.lime}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-black text-white tracking-tight">{value}</span>
        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{subtitle}</p>
      </div>
    </div>
  );
}

// =============================================================
// MODALS
// =============================================================
function ModalContainer({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// 1. ADD MEMBER MODAL
function AddMemberModal({ trainers, onClose, onSave }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [months, setMonths] = useState(1);
  const [trainerId, setTrainerId] = useState(trainers[0]?.id || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const newId = 'm-' + Date.now();
    const memberCode = 'IP-' + Math.floor(1000 + Math.random() * 9000);
    const selectedMonths = parseInt(months) || 1;
    const price = DURATION_RATES[selectedMonths]?.price || (selectedMonths * 700);

    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + selectedMonths);

    const newMember = {
      id: newId,
      memberId: memberCode,
      fullName,
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@member.gym`,
      phone,
      password: '123',
      gender: 'Male',
      joinDate: today.toISOString().split('T')[0],
      monthsEnrolled: selectedMonths,
      planTitle: `${selectedMonths} Month${selectedMonths > 1 ? 's' : ''} Membership`,
      startDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      trainerId,
      status: 'Active',
      balanceDue: price
    };

    onSave(newMember);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-black text-white">Enroll New Gym Member</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="Athlete Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Phone Number *</label>
          <input
            type="text"
            required
            placeholder="+91 98765 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-zinc-400 font-semibold block mb-1">Duration (₹700/Month)</label>
            <select
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            >
              <option value={1}>1 Month (₹700)</option>
              <option value={3}>3 Months (₹2,100)</option>
              <option value={6}>6 Months (₹4,200)</option>
              <option value={12}>12 Months (₹8,400)</option>
            </select>
          </div>
          <div>
            <label className="text-zinc-400 font-semibold block mb-1">Assign Coach</label>
            <select
              value={trainerId || ''}
              onChange={(e) => setTrainerId(e.target.value || null)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="">None</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-3 flex gap-2">
          <button type="button" onClick={onClose} className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold">
            Cancel
          </button>
          <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-lime-400 text-black font-black">
            Enroll Member
          </button>
        </div>
      </form>
    </div>
  );
}

// 2. RECORD PAYMENT MODAL
function RecordPaymentModal({ members, onClose, onSubmit }) {
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [method, setMethod] = useState('Cash');
  const [amount, setAmount] = useState('700');
  const [upiRef, setUpiRef] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetMember = members.find((m) => m.id === memberId) || members[0];
    if (!targetMember) return;
    onSubmit({
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      amount: parseFloat(amount),
      method,
      upiRef: method === 'UPI' ? upiRef : ''
    });
  };

  if (members.length === 0) {
    return (
      <div className="space-y-4 text-center py-4">
        <h3 className="text-base font-bold text-white">No Members Available</h3>
        <p className="text-xs text-zinc-400">Enroll a member first.</p>
        <button onClick={onClose} className="px-4 py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white">Close</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-black text-white">Record Member Payment</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Select Member</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.fullName} ({m.memberId}) - Due: ₹{m.balanceDue || 0}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-zinc-400 font-semibold block mb-1">Method</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod('Cash')}
                className={`w-1/2 py-2 rounded-xl font-bold ${method === 'Cash' ? 'bg-emerald-400 text-black' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'}`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`w-1/2 py-2 rounded-xl font-bold ${method === 'UPI' ? 'bg-cyan-400 text-black' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'}`}
              >
                UPI QR
              </button>
            </div>
          </div>
          <div>
            <label className="text-zinc-400 font-semibold block mb-1">Amount Paid (₹)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
            />
          </div>
        </div>

        {method === 'UPI' && (
          <div>
            <label className="text-zinc-400 font-semibold block mb-1">UPI Transaction Ref (UTR)</label>
            <input
              type="text"
              required
              placeholder="e.g. 40291823901"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <button type="button" onClick={onClose} className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold">Cancel</button>
          <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-lime-400 text-black font-black">Save Receipt</button>
        </div>
      </form>
    </div>
  );
}

// 3. RECEIPT MODAL
function ReceiptModal({ payment, onClose }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-lime-400" /> Payment Receipt
        </h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3 text-xs">
        <div className="flex justify-between border-b border-zinc-800/80 pb-2">
          <span className="font-bold text-white">IRON PULSE FITNESS</span>
          <span className="font-mono text-lime-400">{payment.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Member:</span>
          <span className="font-semibold text-zinc-200">{payment.memberName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Method:</span>
          <span className="text-zinc-200">{payment.method} {payment.upiRef ? `(${payment.upiRef})` : ''}</span>
        </div>
        <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-sm font-bold text-white">
          <span>Amount Paid:</span>
          <span className="font-mono text-lime-400">₹{payment.amount}</span>
        </div>
      </div>

      <button onClick={() => window.print()} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center gap-2 text-xs">
        <Download className="w-4 h-4" /> Print / Save Receipt
      </button>
    </div>
  );
}

// 4. ADD TRAINER MODAL
function AddTrainerModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Strength & Conditioning');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSave({
      id: 't-' + Date.now(),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@ironpulse.gym`,
      phone,
      password: '123',
      specialty,
      photo: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80',
      bio: 'Certified strength and hypertrophy coach.',
      active: true,
      status: 'Active',
      monthlySalary: TRAINER_MONTHLY_FEE,
      experience: '2+ Years'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-black text-white">Add Gym Trainer</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Trainer Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Specialty</label>
          <input
            type="text"
            required
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Phone</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="pt-2 flex gap-2">
          <button type="button" onClick={onClose} className="w-1/2 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold">Cancel</button>
          <button type="submit" className="w-1/2 py-2 rounded-xl bg-emerald-400 text-black font-black">Save Coach</button>
        </div>
      </form>
    </div>
  );
}

// 5. ADD EXPENSE MODAL
function AddExpenseModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    onSave({
      id: 'exp-' + Date.now(),
      title,
      category: 'Utilities',
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-black text-white">Log Overhead Expense</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Expense Title</label>
          <input
            type="text"
            required
            placeholder="Electricity / Maintenance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Amount (₹)</label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>
        <div className="pt-2 flex gap-2">
          <button type="button" onClick={onClose} className="w-1/2 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold">Cancel</button>
          <button type="submit" className="w-1/2 py-2 rounded-xl bg-rose-500 text-white font-bold">Save Expense</button>
        </div>
      </form>
    </div>
  );
}

// 6. CREATE NOTICE MODAL
function CreateNoticeModal({ author, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    onSave({
      id: 'n-' + Date.now(),
      title,
      content,
      author,
      tag: 'Announcement',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-black text-white">Broadcast Notice</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="text-zinc-400 font-semibold block mb-1">Details</label>
          <textarea
            rows="3"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
          ></textarea>
        </div>
        <div className="pt-2 flex gap-2">
          <button type="button" onClick={onClose} className="w-1/2 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold">Cancel</button>
          <button type="submit" className="w-1/2 py-2 rounded-xl bg-lime-400 text-black font-black">Publish</button>
        </div>
      </form>
    </div>
  );
}