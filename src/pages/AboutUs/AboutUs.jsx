import React from "react";
import kaushal from "../../assets/kaushal.jpg";
import apurv from "../../assets/apurv.jpg";
import praveer from "../../assets/praveer.jpg";

const About = () => {
  const statsData = [
    { value: "1000+", label: "Materials" },
    { value: "50+", label: "Courses" },
    { value: "100k+", label: "Students" },
    { value: "15M+", label: "Downloads" },
  ];

  const heroHighlights = [
    {
      title: "Curated by students",
      description: "Every upload is checked by campus mentors before it reaches the community feed.",
    },
    {
      title: "Trusted by campuses",
      description: "Learners from 40+ colleges rely on NOTO every semester to stay exam ready.",
    },
    {
      title: "Built to scale",
      description: "Fast previews, smart search, and secure storage keep browsing effortless.",
    },
  ];

  const valuesData = [
    {
      icon: "🤝",
      title: "Community-first",
      description: "Students drive contributions, reviews, and feedback loops for every resource.",
    },
    {
      icon: "🚀",
      title: "Learn fast, build faster",
      description: "We ship improvements weekly and adapt to what classrooms ask for next.",
    },
    {
      icon: "🛡️",
      title: "Trust & transparency",
      description: "Moderation dashboards, clear credits, and report flows keep content safe.",
    },
    {
      icon: "🌍",
      title: "Access for all",
      description: "Zero-paywall resources so every learner can thrive regardless of background.",
    },
  ];

  const journeyMilestones = [
    {
      year: "2021",
      title: "Idea sparked",
      description:
        "A study group struggled to locate reliable semester notes and decided to build a shared archive.",
    },
    {
      year: "2022",
      title: "Beta launched",
      description:
        "The first 200 students uploaded resources, shaping curation rules and the tagging system.",
    },
    {
      year: "2023",
      title: "Scaling up",
      description:
        "Cloud storage, lightning-fast previews, and moderation dashboards rolled out for new campuses.",
    },
    {
      year: "2024",
      title: "Community impact",
      description:
        "Chatbots, donation drives, and accessibility upgrades joined the toolkit to support every learner.",
    },
  ];

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Boxed Container for entire page */}
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-cover bg-top-center">
          {/* Hero Section */}
          <div className="relative mb-8 sm:mb-10 md:mb-12 overflow-hidden rounded-2xl border border-white/10 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center shadow-[0_40px_80px_-40px_rgba(16,54,125,0.55)] transition-colors duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1b3d]/85 via-[#0a1b3d]/60 to-transparent dark:from-gray-950/95 dark:via-gray-900/70 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 gap-0 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12 text-white">
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80">
                  Since 2025
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                  Student-led
                </div>
                <h1 className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-blue-300 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                  Building the most trusted academic resource hub for students
                </h1>
                <p className="mt-4 text-xs sm:text-sm md:text-base text-white/85 max-w-xl">
                  NOTO connects learners with curated notes, research papers, and past exam material in seconds—so every study session starts with quality.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/materials"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#10367D] transition-colors hover:bg-[#74B4D9] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#0a1b3d]"
                  >
                    Explore Resources
                  </a>
                  <a
                    href="#team"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#0a1b3d]"
                  >
                    Meet the Team
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex flex-col justify-center gap-4 p-8">
                {heroHighlights.map(({ title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/20 bg-white/15 p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/8"
                  >
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm text-white/80">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats + Who We Are */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Liquid Glass Stats Card */}
            <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-white/40 dark:bg-gray-900/55 p-px ring-4 ring-zinc-200/50 dark:ring-gray-800/60 backdrop-blur-lg shadow-lg transition-colors duration-300">
              {/* Border Details */}
              <div className="absolute inset-0 rounded-3xl border border-white dark:border-gray-700/40 mask-linear-135 mask-linear-from-0% mask-linear-to-20% transition-colors duration-300"></div>
              <div className="absolute inset-0 rounded-3xl border border-white dark:border-gray-700/40 -mask-linear-45 mask-linear-from-10% mask-linear-to-20% transition-colors duration-300"></div>
              <div className="absolute inset-0 rounded-3xl border border-white/90 dark:border-gray-600/60 mask-linear-40 mask-linear-from-0% mask-linear-to-10% transition-colors duration-300"></div>
              <div className="absolute inset-0 rounded-3xl border border-white/90 dark:border-gray-600/60 -mask-linear-110 mask-linear-from-0% mask-linear-to-5% transition-colors duration-300"></div>

              {/* Header */}
              <div className="relative rounded-3xl bg-white/20 dark:bg-gray-900/40 transition-colors duration-300">
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
                      <h2 className="text-xl font-bold text-zinc-800 dark:text-white transition-colors duration-300">
                        OUR IMPACT
                      </h2>
                      <p className="text-sm text-zinc-700 dark:text-gray-200 transition-colors duration-300">
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
                      className="relative rounded-2xl bg-white/30 dark:bg-gray-900/45 p-6 shadow-lg shadow-zinc-500/5 dark:shadow-gray-900/20 transition-colors duration-300"
                    >
                      <div className="absolute inset-0 rounded-2xl border border-white dark:border-gray-700/40 mask-linear-135 mask-linear-from-0% mask-linear-to-20% transition-colors duration-300"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 dark:border-gray-700/35 -mask-linear-45 mask-linear-from-10% mask-linear-to-20% transition-colors duration-300"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 dark:border-gray-700/35 mask-linear-40 mask-linear-from-0% mask-linear-to-30% transition-colors duration-300"></div>
                      <div className="absolute inset-0 rounded-2xl border border-white/75 dark:border-gray-700/35 -mask-linear-110 mask-linear-from-0% mask-linear-to-15% transition-colors duration-300"></div>
                      <div className="relative">
                        <p className="text-sm text-zinc-700 dark:text-gray-200 transition-colors duration-300">{stat.label}</p>
                        <p className="text-2xl font-bold text-zinc-800 dark:text-white transition-colors duration-300">
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
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
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
  bg-white/40 dark:bg-gray-900/55 backdrop-blur-[8px] border border-white/16 dark:border-gray-800/50
  overflow-hidden rounded-3xl justify-center 
  p-px ring-4 ring-zinc-200/50 dark:ring-gray-800/60 shadow-lg transition-colors duration-300"
            >
              <div className="p-6 sm:p-8 bg-white/70 dark:bg-gray-900/70 rounded-[30px] transition-colors duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1b3d] dark:text-white mb-4 transition-colors duration-300">
                  Who We Are
                </h2>
                <p className="text-sm sm:text-base text-[#0a1b3d] dark:text-gray-100 mb-4 leading-relaxed transition-colors duration-300">
                  At NOTO, we understand how challenging it can be to find
                  quality academic resources. That&apos;s why we bring
                  everything together in one platform—organized notes, research
                  papers, previous year questions, and assignments—so students
                  can learn smarter, save time, and achieve more.
                </p>
                <p className="text-sm sm:text-base text-[#0a1b3d] dark:text-gray-100 leading-relaxed transition-colors duration-300">
                  "Founded by students, for students, NOTO is built on the
                  belief that quality education should be accessible to
                  everyone—no matter their background or financial situation."
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-200/90 mt-4 transition-colors duration-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors duration-300">✔</span>
                    Centralized hub of academic resources for quick access
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors duration-300">✔</span>
                    Built by students to solve real student problems
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors duration-300">✔</span>
                    Free and inclusive platform for learners everywhere
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Simplify */}
          <section
            id="team"
            className="relative w-full lg:col-span-2
    bg-white dark:bg-gray-900/60 backdrop-blur-[8px] border border-white/16 dark:border-gray-800/50
    overflow-hidden rounded-3xl justify-center
    p-px ring-4 ring-zinc-200/50 dark:ring-gray-800/60 shadow-lg transition-colors duration-300"
          >
            <div className="bg-white/45 dark:bg-gray-900/70 backdrop-blur-[1px] border border-white/8 dark:border-gray-700/40 overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10 transition-colors duration-300">
              <header className="mb-6 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0a1b3d] dark:text-white mb-2 transition-colors duration-300">
                  How We <span className="text-[#0a1b3d] dark:text-white">Simplify</span> Your
                  Study Experience
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#0a1b3d] dark:text-gray-100 transition-colors duration-300">
                  At <span className="font-semibold text-[#0a1b3d] dark:text-white">NOTO</span>,
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
                    <div key={i} className="flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-white/0 dark:bg-gray-800/60 transition-colors duration-300">
                    <div className="flex-shrink-0 w-10 h-10 grid place-items-center bg-[#74b4d923] dark:bg-gray-700/60 rounded-lg transition-colors duration-300">
                      <span className="text-lg sm:text-2xl">{icon}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0a1b3d] dark:text-white text-sm sm:text-base transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#0a1b3d] dark:text-gray-100 transition-colors duration-300">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="relative mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-white/16 bg-white/50 p-px shadow-lg ring-4 ring-zinc-200/40 backdrop-blur-xl transition-colors duration-300 dark:border-gray-800/50 dark:bg-gray-900/60 dark:ring-gray-800/60">
              <div className="relative rounded-3xl bg-white/95 p-6 sm:p-8 md:p-10 dark:bg-gray-900/70">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0a1b3d] dark:text-white">
                    Our Core Values
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#0a1b3d] dark:text-gray-100 max-w-2xl mx-auto">
                    Four principles guide how we build NOTO, support our community, and keep resources accessible for every learner.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {valuesData.map(({ icon, title, description }) => (
                    <div
                      key={title}
                      className="group relative h-full rounded-2xl border border-white/40 bg-white/85 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#74B4D9] hover:shadow-xl dark:border-gray-700/40 dark:bg-gray-800/70 dark:hover:border-gray-500/70"
                    >
                      <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#74B4D9]/20 text-xl text-[#0a1b3d] dark:bg-gray-700/60 dark:text-white">
                        {icon}
                      </span>
                      <h3 className="text-lg font-semibold text-[#0a1b3d] dark:text-white">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm text-[#0a1b3d]/80 dark:text-gray-100">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Journey Timeline */}
          {/* <section className="relative mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-white/16 bg-white/45 p-px shadow-lg ring-4 ring-zinc-200/40 backdrop-blur-xl transition-colors duration-300 dark:border-gray-800/50 dark:bg-gray-900/55 dark:ring-gray-800/60">
              <div className="relative grid gap-8 rounded-3xl bg-white/95 p-6 sm:p-8 md:p-10 lg:grid-cols-2 dark:bg-gray-900/70">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0a1b3d] dark:text-white">
                    The NOTO Journey
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#0a1b3d] dark:text-gray-100">
                    From a scrappy idea in a dorm room to a fast-growing library empowering thousands of students every month.
                  </p>
                  <p className="mt-4 text-sm text-[#0a1b3d]/70 dark:text-gray-200/80">
                    Each milestone is co-created with feedback from classrooms, mentors, and the community that calls NOTO home.
                  </p>
                </div>

                <div className="relative border-l border-dashed border-[#10367D]/20 pl-6 dark:border-gray-600/50">
                  {journeyMilestones.map(({ year, title, description }, index) => (
                    <div key={year} className={`relative pb-8 ${index === journeyMilestones.length - 1 ? 'pb-0' : ''}`}>
                      <span className="absolute -left-[11px] top-2 h-2.5 w-2.5 rounded-full bg-[#10367D] shadow-[0_0_0_6px_rgba(16,54,125,0.15)] dark:bg-blue-200 dark:shadow-[0_0_0_6px_rgba(30,64,175,0.3)]" />
                      <h3 className="text-base font-semibold text-[#0a1b3d] dark:text-white">
                        {year} · {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#0a1b3d]/80 dark:text-gray-100">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section> */}

          {/* Community Callout */}
          <section className="relative mt-10">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#10367D] via-[#0f52ba] to-[#74B4D9] p-8 sm:p-10 text-white shadow-[0_35px_85px_-45px_rgba(16,54,125,0.8)]">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    Community Impact
                  </div>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-semibold leading-tight">
                    24/7 access to verified learning materials for every student
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-white/85">
                    We review uploads within hours, respond to community feedback, and extend support to colleges that need it the most.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                    {[{
                      value: '98%',
                      label: 'Student satisfaction'
                    }, {
                      value: '4.9/5',
                      label: 'Average resource rating'
                    }, {
                      value: '12k+',
                      label: 'Downloads each week'
                    }].map(({ value, label }) => (
                      <div key={label} className="rounded-2xl bg-white/10 px-5 py-3">
                        <p className="text-xl font-semibold">{value}</p>
                        <p className="text-xs uppercase tracking-wide text-white/80">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
                  <p className="text-sm sm:text-base text-white/85">
                    Want to collaborate with NOTO or onboard your campus? Share a note, suggest a feature, or partner with us for the next big academic drive.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:hello@notoplatform.com"
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#10367D] transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#10367D]"
                    >
                      Contact Us
                    </a>
                    <a
                      href="https://forms.gle/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#10367D]"
                    >
                      Share Resources
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Executive Team Section - keeping original border/background styling */}
          <section
            className="relative w-full lg:col-span-2
    bg-white dark:bg-gray-900/60 backdrop-blur-[8px] border border-white/16 dark:border-gray-800/50
    overflow-hidden rounded-3xl justify-center
    p-px ring-4 ring-zinc-200/50 dark:ring-gray-800/60 shadow-lg px-6 mt-8 py-6 transition-colors duration-300"
          >
            {/* Header Section */}
            <div className="container px-6 py-10 mx-auto">
              <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white capitalize lg:text-3xl transition-colors duration-300">
                The Executive Team
              </h1>
              <div className="flex justify-center mx-auto mt-6">
                <span className="inline-block w-40 h-1 bg-blue-500 dark:bg-blue-300 rounded-full transition-colors duration-300"></span>
                <span className="inline-block w-3 h-1 mx-1 bg-blue-500 dark:bg-blue-300 rounded-full transition-colors duration-300"></span>
                <span className="inline-block w-1 h-1 bg-blue-500 dark:bg-blue-300 rounded-full transition-colors duration-300"></span>
              </div>
              <p className="max-w-2xl mx-auto mt-6 text-center text-gray-500 dark:text-gray-100 transition-colors duration-300">
                Meet the innovative minds driving NOTO forward. Our executive
                team combines educational expertise with cutting-edge technology
                to revolutionize how students access and engage with academic
                resources.
              </p>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center p-4 border border-blue-100/60 dark:border-gray-700/60 sm:p-6 rounded-xl bg-white/30 dark:bg-gray-900/70 transition-colors duration-300">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={kaushal}
                  alt="Kaushal Mandal"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-white capitalize transition-colors duration-300">
                  Kaushal Mandal
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-200 capitalize transition-colors duration-300">
                  Full stack Developer
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href="https://www.linkedin.com/in/kaushal-mandal--/"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400"
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
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-pink-500 dark:hover:text-pink-400"
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
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
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
              <div className="flex flex-col items-center p-4 border border-blue-100/60 dark:border-gray-700/60 sm:p-6 rounded-xl bg-white/30 dark:bg-gray-900/70 transition-colors duration-300">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={apurv}
                  alt="Apurv Anupam"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-white capitalize transition-colors duration-300">
                  Apurv Anupam
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-200 capitalize transition-colors duration-300">
                  Full Stack Developer
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href=""
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400"
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
                    href="https://www.instagram.com/c_yclo"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-pink-500 dark:hover:text-pink-400"
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
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
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
              <div className="flex flex-col items-center p-4 border border-blue-100/60 dark:border-gray-700/60 sm:p-6 rounded-xl bg-white/30 dark:bg-gray-900/70 transition-colors duration-300">
                <img
                  className="object-cover w-full rounded-xl aspect-square"
                  src={praveer}
                  alt="Parveer Kishore"
                />
                <h1 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-white capitalize transition-colors duration-300">
                  Parveer Kishore
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-200 capitalize transition-colors duration-300">
                  Full Stack Developer
                </p>
                <div className="flex mt-3 -mx-2">
                  <a
                    href="#"
                    target="_blank"
  rel="noopener noreferrer"
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-700 dark:hover:text-blue-400"
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
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-pink-500 dark:hover:text-pink-400"
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
                    className="mx-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
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