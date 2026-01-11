
import React, { useState } from 'react';
import { CITIES } from './constants.tsx';
import { generateTravelItinerary } from './services/geminiService.ts';
import { TravelItinerary } from './types.ts';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    kakao: '',
    phone: ''
  });

  const handleCreateItinerary = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await generateTravelItinerary(searchQuery);
      setItinerary(data);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("꿈의 조각을 모으는 데 잠시 문제가 생겼어요. 다시 시도해볼까요?");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch("https://formspree.io/f/xreezjvd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "성함": formData.name,
          "이메일": formData.email,
          "카카오톡": formData.kakao,
          "연락처": formData.phone,
          "_subject": `[아름다운 여행] ${formData.name}님의 상담 신청`
        })
      });

      if (response.ok) {
        alert(`${formData.name}님, 상담 신청이 성공적으로 전달되었습니다! 여행 전문가가 곧 무지개 너머 소식을 들고 찾아갈게요. ✨`);
        setFormData({ name: '', email: '', kakao: '', phone: '' });
      } else {
        alert("앗! 꿈의 편지가 중간에 길을 잃었나 봐요. 잠시 후 다시 시도해 주시겠어요?");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("네트워크 연결이 불안정해요. 인터넷 확인 후 다시 보내주세요!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/60 backdrop-blur-lg z-50 border-b border-yellow-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-jua text-rose-500 cursor-pointer hover:scale-105 transition-transform">
            아름다운 여행
          </div>
          <div className="hidden md:flex gap-6 items-center text-lg font-gaegu font-bold text-blue-600">
            <a href="#cities" className="hover:text-rose-400 transition-colors">도시 조각들</a>
            <a href="#planner" className="hover:text-amber-500 transition-colors">꿈의 일기장</a>
            <a href="#checklist" className="hover:text-emerald-500 transition-colors">준비물 꾸러미</a>
            <div className="flex gap-3 ml-4">
              <button className="text-blue-500 border-2 border-blue-400 px-5 py-1 rounded-full hover:bg-blue-50 transition-all font-jua text-base">
                로그인
              </button>
              <a href="#contact-form" className="bg-rose-500 text-white px-6 py-1 rounded-full shadow-lg hover:bg-rose-600 transition-all transform hover:-rotate-2 font-jua text-base text-center">
                상담 신청하기
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex flex-col md:flex-row items-center">
        {/* Background Spline */}
        <div className="absolute inset-0 z-0 transition-transform duration-700 md:translate-x-[15%]">
          <iframe 
            src='https://my.spline.design/interactivecharactergirl-MVNUAdogrsMEuxlLKVnsyyZB/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            title="Spline 3D Character"
            className="opacity-90 grayscale-[0.2] brightness-105"
          ></iframe>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start pointer-events-none">
          <div className="bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border-4 border-white/50 shadow-2xl pointer-events-auto max-w-xl animate-float">
            <h1 className="text-6xl md:text-7xl font-jua text-blue-600 leading-tight mb-4 drop-shadow-sm">
              당신만의<br />
              <span className="text-rose-500">유럽 이야기</span>를<br />
              꽃피워 보세요
            </h1>
            <p className="text-2xl font-gaegu font-bold text-gray-700 mb-8">
              지루한 계획은 잊고, 설렘만 담아갈 시간
            </p>
            <div className="w-full relative flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateItinerary()}
                placeholder="어디로 떠나고 싶나요? (예: 파리 로맨틱 4일)"
                className="w-full pl-8 pr-20 py-5 text-xl rounded-full border-4 border-yellow-300 focus:border-rose-400 outline-none shadow-xl text-gray-800 placeholder-gray-400 font-gaegu"
              />
              <button 
                onClick={handleCreateItinerary}
                className="absolute right-3 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section id="cities" className="py-24 px-6 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#FDFCF0] to-white"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-jua text-amber-500 mb-4">인기 유럽 도시 조각</h2>
            <div className="w-24 h-2 bg-rose-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CITIES.map((city) => (
              <div 
                key={city.id} 
                className="group relative h-96 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:-translate-y-3 cursor-pointer"
              >
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className={`inline-block px-4 py-1 ${city.color} text-white font-jua rounded-full text-sm mb-2`}>
                    {city.engName}
                  </div>
                  <h3 className="text-3xl font-jua text-white mb-1">{city.name}</h3>
                  <p className="text-white/80 font-gaegu text-xl">{city.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planner CTA Section */}
      <section id="planner" className="py-32 bg-amber-50 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-rose-200 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-jua text-rose-500 mb-8 leading-snug">
            마음이 시키는 대로,<br />
            <span className="text-blue-600">나만의 여행 일기장</span>
          </h2>
          <p className="text-2xl font-gaegu font-bold text-gray-600 mb-12">
            가고 싶은 곳과 스타일을 말해주면, 당신만을 위한 동화를 써드릴게요.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
            <input 
              type="text" 
              placeholder="예: '스위스 기차 여행' 혹은 '런던 갤러리 투어'"
              className="w-full md:w-[500px] px-8 py-5 text-xl rounded-[2rem] border-4 border-blue-400 focus:border-rose-400 outline-none shadow-xl font-gaegu"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              disabled={loading}
              onClick={handleCreateItinerary}
              className={`px-10 py-5 bg-rose-500 text-white text-2xl font-jua rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-rose-600'}`}
            >
              {loading ? '마법을 부리는 중...' : '이야기 만들기 ✨'}
            </button>
          </div>

          {/* Itinerary Result */}
          {itinerary && (
            <div id="itinerary-result" className="mt-20 bg-white p-10 md:p-16 rounded-[4rem] border-8 border-yellow-200 shadow-2xl text-left animate-float">
              <h3 className="text-4xl font-jua text-blue-600 mb-10 text-center">
                🎈 {itinerary.title}
              </h3>
              
              <div className="space-y-12 mb-12">
                {itinerary.days.map((d) => (
                  <div key={d.day} className="flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-white font-jua text-3xl shadow-lg border-4 border-white">
                      {d.day}
                    </div>
                    <div>
                      <h4 className="text-2xl font-jua text-gray-800 mb-2">{d.activity}</h4>
                      <p className="text-xl font-gaegu text-gray-600 leading-relaxed">{d.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 p-8 rounded-[2rem] border-2 border-emerald-200">
                <h4 className="text-2xl font-jua text-emerald-600 mb-4 inline-flex items-center gap-2">
                  <span className="text-3xl">🎒</span> 잊지 말아요! 여행자의 꿀팁
                </h4>
                <ul className="space-y-3">
                  {itinerary.tips.map((tip, idx) => (
                    <li key={idx} className="font-gaegu text-xl text-gray-700 flex items-start gap-2">
                      <span className="text-emerald-500">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Checklist Section */}
      <section id="checklist" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-jua text-blue-600 mb-4">떠나기 전 꾸러미</h2>
            <p className="text-2xl font-gaegu font-bold text-gray-500">이것만큼은 꼭 챙겨주세요!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-rose-50 p-10 rounded-[3rem] border-b-8 border-rose-200 transform -rotate-1 hover:rotate-0 transition-all cursor-default">
              <div className="text-5xl mb-6">🎫</div>
              <h4 className="text-2xl font-jua text-rose-500 mb-4">ETIAS & 입국</h4>
              <p className="font-gaegu text-lg text-gray-600">
                2026년부터 유럽 입국 시 필수! 미리 온라인 신청하는 것 잊지 마세요.
              </p>
            </div>
            
            <div className="bg-amber-50 p-10 rounded-[3rem] border-b-8 border-amber-200 transform rotate-1 hover:rotate-0 transition-all cursor-default">
              <div className="text-5xl mb-6">🗓️</div>
              <h4 className="text-2xl font-jua text-amber-600 mb-4">Schengen 90일 룰</h4>
              <p className="font-gaegu text-lg text-gray-600">
                무비자로 최대 90일! 일정 짤 때 날짜 계산은 꼼꼼하게 해야 해요.
              </p>
            </div>
            
            <div className="bg-blue-50 p-10 rounded-[3rem] border-b-8 border-blue-200 transform -rotate-1 hover:rotate-0 transition-all cursor-default">
              <div className="text-5xl mb-6">🚂</div>
              <h4 className="text-2xl font-jua text-blue-500 mb-4">기차 vs 항공</h4>
              <p className="font-gaegu text-lg text-gray-600">
                가까운 곳은 기차 패스로, 먼 곳은 저가항공으로 영리하게 이동해요!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Request Form Section */}
      <section id="contact-form" className="py-24 bg-[#FFF9E6] relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border-4 border-rose-100 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-jua text-rose-500 mb-4">특별한 상담 신청하기</h2>
              <p className="text-2xl font-gaegu font-bold text-gray-500 leading-relaxed">
                당신의 꿈을 현실로 만들어줄<br /> 여행 전문가가 기다리고 있어요!
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-jua text-xl text-blue-500 ml-4">성함</label>
                  <input 
                    required
                    type="text" 
                    placeholder="홍길동"
                    className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 focus:border-blue-400 outline-none font-gaegu text-lg shadow-inner bg-gray-50 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-jua text-xl text-amber-500 ml-4">연락처</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="010-0000-0000"
                    className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 focus:border-amber-400 outline-none font-gaegu text-lg shadow-inner bg-gray-50 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-jua text-xl text-emerald-500 ml-4">이메일</label>
                <input 
                  required
                  type="email" 
                  placeholder="example@travel.com"
                  className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 focus:border-emerald-400 outline-none font-gaegu text-lg shadow-inner bg-gray-50 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-jua text-xl text-rose-400 ml-4">카카오톡 ID</label>
                <input 
                  type="text" 
                  placeholder="kakao_id"
                  className="w-full px-6 py-4 rounded-3xl border-2 border-gray-100 focus:border-rose-400 outline-none font-gaegu text-lg shadow-inner bg-gray-50 transition-colors"
                  value={formData.kakao}
                  onChange={(e) => setFormData({...formData, kakao: e.target.value})}
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-6 text-white text-3xl font-jua rounded-[2.5rem] shadow-xl transition-all transform flex items-center justify-center gap-3 ${submitting ? 'bg-gray-400 cursor-wait' : 'bg-rose-500 hover:bg-rose-600 hover:scale-[1.02] active:scale-95'}`}
                >
                  {submitting ? '우체부 비둘기가 날아가는 중...🕊️' : '반짝이는 여행 시작하기 ✨'}
                </button>
                <p className="text-center mt-6 font-gaegu text-gray-400 text-lg">
                  보내주신 소중한 정보는 상담 목적으로만 안전하게 사용됩니다.
                </p>
              </div>
            </form>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[120px] -z-10 opacity-60"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-4xl font-jua text-rose-500 mb-6">아름다운 여행</div>
          <p className="font-gaegu text-xl text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            유럽의 모든 골목이 당신의 무대가 되고,<br /> 모든 순간이 반짝이는 추억이 되기를 바랍니다.
          </p>
          <div className="flex justify-center gap-6 mb-12">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-500 transition-colors">
              <span className="text-xl">📷</span>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
              <span className="text-xl">💬</span>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors">
              <span className="text-xl">📍</span>
            </div>
          </div>
          <div className="text-gray-500 font-gaegu text-lg">
            © 2026 아름다운 여행 · 당신의 발걸음을 응원합니다
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Kakao-style) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-yellow-400 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-4 border-white">
          <span className="text-3xl">👋</span>
        </button>
      </div>
    </div>
  );
};

export default App;
