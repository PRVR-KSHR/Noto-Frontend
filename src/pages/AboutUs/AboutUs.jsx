import React from "react";
import kaushal from "../../assets/kaushal.jpg";
import nitya from "../../assets/Nits.jpg";
import praveer from "../../assets/praveer.jpg";

const About = () => {
  const statsData = [
    { value: "1000+", label: "Materials" },
    { value: "50+", label: "Courses" },
    { value: "100k+", label: "Students" },
    { value: "15M+", label: "Downloads" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Boxed Container for entire page */}
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-cover bg-top-center">
          {/* Hero Section */}
          <div className="relative mb-8 sm:mb-10 md:mb-12 overflow-hidden bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] backdrop-blur-[1px] border border-white/8 p-4 sm:p-6 rounded-lg bg-cover bg-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 mt-4 leading-tight text-white">
                  About Us
                </h1>
                <p className="text-[#EBEBEB] mb-2 sm:mb-2 text-xs sm:text-sm md:text-base">
                  Bringing Simplicity In The Notes & Research Market
                </p>
                <button className="bg-[#EBEBEB] hover:bg-[#74B4D9] text-[#10367D] font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors w-fit text-xs sm:text-sm md:text-base">
                  Explore Resources
                </button>
              </div>
            </div>
          </div>

          {/* Stats + Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Liquid Glass Stats Card */}
            <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-white/40 p-px ring-4 ring-zinc-200/50 backdrop-blur-lg shadow-lg">
              {/* Border Details */}
              <div className="absolute inset-0 rounded-3xl border border-white mask-linear-135 mask-linear-from-0% mask-linear-to-20%"></div>
              <div className="absolute inset-0 rounded-3xl border border-white -mask-linear-45 mask-linear-from-10% mask-linear-to-20%"></div>
              <div className="absolute inset-0 rounded-3xl border border-white/90 mask-linear-40 mask-linear-from-0% mask-linear-to-10%"></div>
              <div className="absolute inset-0 rounded-3xl border border-white/90 -mask-linear-110 mask-linear-from-0% mask-linear-to-5%"></div>

              {/* Header */}
              <div className="relative rounded-3xl bg-white/20">
                <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-sky-600 ring-2 ring-white/50">
                      <svg
                        className="size-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-800">
                        OUR IMPACT
                      </h2>
                      <p className="text-sm text-zinc-700">
                        Platform Statistics
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  {statsData.map((stat, index) => (
                    <div
                      key={index}
                      className="relative rounded-2xl bg-white/30 p-6 shadow-lg shadow-zinc-500/5"
                    >
                      <div className="absolute inset-0 rounded-2xl border border-white mask-linear-135 mask-linear-from-0% mask-linear-to-20%"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 -mask-linear-45 mask-linear-from-10% mask-linear-to-20%"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 mask-linear-40 mask-linear-from-0% mask-linear-to-30%"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 -mask-linear-110 mask-linear-from-0% mask-linear-to-15%"></div>
                      <div className="relative">
                        <p className="text-sm text-zinc-700">{stat.label}</p>
                        <p className="text-2xl font-bold text-zinc-800">
                          {stat.value}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="lucide lucide-trending-up inline-block size-4 text-emerald-500"
                          >
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                          </svg>
                          <span className="text-sm font-medium text-emerald-600">
                            Growing
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Who We Are */}
            <div
              className="relative w-full lg:col-span-2 
  bg-white/40 backdrop-blur-[8px] border border-white/16 
  overflow-hidden rounded-3xl justify-center 
  p-px ring-4 ring-zinc-200/50 shadow-lg"
            >
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1b3d] mb-4">
                  Who We Are
                </h2>
                <p className="text-sm sm:text-base text-[#0a1b3d] mb-4 leading-relaxed">
                  At NOTO, we understand how challenging it can be to find
                  quality academic resources. That&apos;s why we bring
                  everything together in one platform—organized notes, research
                  papers, previous year questions, and assignments—so students
                  can learn smarter, save time, and achieve more.
                </p>
                <p className="text-sm sm:text-base text-[#0a1b3d] leading-relaxed">
                  "Founded by students, for students, NOTO is built on the
                  belief that quality education should be accessible to
                  everyone—no matter their background or financial situation."
                </p>
                <ul className="space-y-3 text-gray-700 mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✔</span>
                    Centralized hub of academic resources for quick access
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✔</span>
                    Built by students to solve real student problems
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✔</span>
                    Free and inclusive platform for learners everywhere
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Simplify */}
          <section
            className="relative w-full lg:col-span-2
    bg-white backdrop-blur-[8px] border border-white/16
    overflow-hidden rounded-3xl justify-center
    p-px ring-4 ring-zinc-200/50 shadow-lg"
          >
            <div className="bg-white/40 backdrop-blur-[1px] border border-white/8 overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10">
              <header className="mb-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0a1b3d] mb-2">
                  How We <span className="text-[#0a1b3d]">Simplify</span> Your
                  Study Experience
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#0a1b3d]">
                  At <span className="font-semibold text-[#0a1b3d]">NOTO</span>,
                  we take the stress out of studying by bringing all essential
                  resources into one place.
                </p>
              </header>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 p-4">
                {[
                  {
                    icon: "📘",
                    title: "Curated Notes",
                    desc: "Well-structured notes designed for quick learning.",
                  },
                  {
                    icon: "📂",
                    title: "Past Papers & Questions",
                    desc: "Practice with real exam questions.",
                  },
                  {
                    icon: "📝",
                    title: "Assignments & Research Papers",
                    desc: "Access reliable references for deeper understanding.",
                  },
                  {
                    icon: "⚡",
                    title: "Easy Access, Anytime",
                    desc: "Study materials available whenever you need them.",
                  },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 p-4">
                    <div className="flex-shrink-0 w-10 h-10 grid place-items-center bg-[#74b4d923] rounded-lg">
                      <span className="text-lg sm:text-2xl">{icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0a1b3d] text-sm sm:text-base">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#0a1b3d]">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Executive Team Section - keeping original border/background styling */}
          <section
            className="relative w-full lg:col-span-2
    bg-white backdrop-blur-[8px] border border-white/16
    overflow-hidden rounded-3xl justify-center
    p-px ring-4 ring-zinc-200/50 shadow-lg px-6 mt-8 py-6"
          >
            {/* Header Section */}
            <div className="container px-6 py-10 mx-auto">
              <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">
                The Executive Team
              </h1>
              <div className="flex justify-center mx-auto mt-6">
                <span className="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
                <span className="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
              </div>
              <p className="max-w-2xl mx-auto mt-6 text-center text-gray-500">
                Meet the innovative minds driving NOTO forward. Our executive
                team combines educational expertise with cutting-edge technology
                to revolutionize how students access and engage with academic
                resources.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={kaushal}
                  alt="Kaushal Mandal"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize">
                  Kaushal Mandal
                </h1>
                <p className="mt-2 text-gray-500 capitalize">
                  FUll stack Developer
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href="https://www.linkedin.com/in/kaushal-mandal--/"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-700"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.852-3.039-1.853 
    0-2.136 1.445-2.136 2.939v5.669h-3.554V9h3.414v1.561h.049c.476-.9 
    1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.451v6.292zM5.337 
    7.433c-1.144 0-2.068-.926-2.068-2.068 0-1.143.925-2.068 
    2.068-2.068s2.068.925 2.068 2.068c0 1.142-.925 2.068-2.068 
    2.068zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 
    0 0 .771 0 1.771v20.452C0 23.229.792 24 1.771 
    24h20.451C23.2 24 24 23.229 24 22.224V1.771C24 
    .771 23.2 0 22.225 0z"
                      />
                    </svg>
                  </a>

                  <a
                    href="#"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-pink-500"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2h-9zm0 2h9A3.5 3.5 0 0 1 20 7.5v9A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4zm9.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                  </a>

                  <a
                    href="https://github.com/Kaushal077"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500"
                    aria-label="Github"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={nitya}
                  alt="Nityanand Kumar"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize">
                  Nityanand Kumar
                </h1>
                <p className="mt-2 text-gray-500 capitalize">
                  Full Stack Developer (UI/UX designer)
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href="https://www.linkedin.com/in/nityanand-kumar-097040282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-700"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.852-3.039-1.853 
    0-2.136 1.445-2.136 2.939v5.669h-3.554V9h3.414v1.561h.049c.476-.9 
    1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.451v6.292zM5.337 
    7.433c-1.144 0-2.068-.926-2.068-2.068 0-1.143.925-2.068 
    2.068-2.068s2.068.925 2.068 2.068c0 1.142-.925 2.068-2.068 
    2.068zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 
    0 0 .771 0 1.771v20.452C0 23.229.792 24 1.771 
    24h20.451C23.2 24 24 23.229 24 22.224V1.771C24 
    .771 23.2 0 22.225 0z"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/ankushanand_?igsh=MXYwMTBvNjVhcWZkZg=="
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-pink-500"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2h-9zm0 2h9A3.5 3.5 0 0 1 20 7.5v9A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4zm9.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                  </a>

                  <a
                    href="https://github.com/anknity"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500"
                    aria-label="Github"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* Team Member 3 */}
              <div className="flex flex-col items-center p-4 border sm:p-6 rounded-xl">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={praveer}
                  alt="Parveer Kishore"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize">
                  Parveer Kishore
                </h1>
                <p className="mt-2 text-gray-500 capitalize">
                  Full Stack Developer
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href="#"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-700"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.852-3.039-1.853 
    0-2.136 1.445-2.136 2.939v5.669h-3.554V9h3.414v1.561h.049c.476-.9 
    1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.451v6.292zM5.337 
    7.433c-1.144 0-2.068-.926-2.068-2.068 0-1.143.925-2.068 
    2.068-2.068s2.068.925 2.068 2.068c0 1.142-.925 2.068-2.068 
    2.068zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 
    0 0 .771 0 1.771v20.452C0 23.229.792 24 1.771 
    24h20.451C23.2 24 24 23.229 24 22.224V1.771C24 
    .771 23.2 0 22.225 0z"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/gooluukr"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-pink-500"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M7.5 2A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2h-9zm0 2h9A3.5 3.5 0 0 1 20 7.5v9A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4zm9.25 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500"
                    aria-label="Github"
                  >
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;