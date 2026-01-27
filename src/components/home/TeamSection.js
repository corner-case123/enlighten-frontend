"use client";
import Image from 'next/image';

const people = [
  {
    name: 'Irma',
    nativeLanguage: 'German',
    learningLanguage: 'English',
    imageSrc: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&crop=face&auto=format&q=80',
  },
  {
    name: 'Jane',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    imageSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face&auto=format&q=80',
  },
];

const TeamSection = () => {
  return (
    <div className="mt-20 sm:mt-28 md:mt-32 flex flex-col items-center px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 py-16 relative">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-[#074C77]/10 to-[#0a6ba8]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-[#407023]/8 to-[#5a9e32]/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-[#407023] to-[#5a9e32] rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">About Us</span>
          </div>
          
          <h2 className="section-heading mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              What is 
            </span>
            <span className="bg-gradient-to-r from-[#074C77] via-[#0a6ba8] to-[#074C77] bg-clip-text text-transparent animate-shimmer">
              {" "}Enlighten
            </span>
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              ?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
            The language learning app where people teach each other languages while kindling a shared commitment to safeguarding our environment.
          </p>
          
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#407023]/20 to-[#5a9e32]/20 backdrop-blur-sm border border-[#5a9e32]/30 px-6 py-4 rounded-full">
            <div className="w-3 h-3 bg-gradient-to-r from-[#407023] to-[#5a9e32] rounded-full animate-pulse"></div>
            <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#407023] to-[#5a9e32] bg-clip-text text-transparent">
              Join us as we learn from each other and unite in our mission to protect our planet!
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full justify-center gap-8 lg:gap-12">
          {people.map((person, index) => (
            <div 
              key={index} 
              className="relative max-w-[380px] mx-auto md:mx-0 w-full group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-elevated bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 overflow-hidden hover:border-[#074C77]/50 hover:shadow-[0_0_40px_rgba(7,76,119,0.2)] transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Image
                    src={person.imageSrc}
                    alt={person.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-[350px] sm:h-[400px] transition-all duration-300 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    onError={(e) => {
                      console.log(`Team member image not found: ${person.imageSrc}`)
                      e.target.src = '/default-avatar.png' // fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300"></div>
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    Teacher
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 group-hover:text-[#0a6ba8] transition-colors duration-200">
                      {person.name}
                    </h3>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gradient-to-r from-[#407023] to-[#5a9e32] rounded-full animate-pulse"></span>
                          <span className="text-gray-300 text-sm">Native:</span>
                        </div>
                        <span className="font-semibold text-white bg-gradient-to-r from-[#407023] to-[#5a9e32] bg-clip-text text-transparent">
                          {person.nativeLanguage}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-pulse"></span>
                          <span className="text-gray-300 text-sm">Learning:</span>
                        </div>
                        <span className="font-semibold text-white bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent">
                          {person.learningLanguage}
                        </span>
                      </div>
                    </div>
                    
                    {/* Connect button */}
                    <button className="w-full mt-4 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] hover:from-[#0a6ba8] hover:to-[#074C77] text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                      Connect
                    </button>
                  </div>
                  
                  {/* Glow effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#074C77]/0 via-transparent to-[#074C77]/0 group-hover:from-[#074C77]/5 group-hover:to-[#074C77]/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gray-800/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/30">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Ready to join our community?</h3>
              <p className="text-gray-400">Connect with native speakers and start your learning journey</p>
            </div>
            <button className="btn-primary py-3 px-8 hover:scale-105 transition-transform duration-200">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
