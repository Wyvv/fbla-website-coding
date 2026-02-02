import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "📦",
      title: "Report Found Items",
      description:
          "Found something? Submit a report with details and photos to help the owner find it quickly.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description:
          "Lost something? Use our powerful search and filtering system to find your item instantly.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "✅",
      title: "Easy Claims",
      description:
          "Found your item? Submit a claim request and our staff will verify and arrange pickup.",
      color: "from-green-500 to-green-600",
    },
  ];

  const stats = [
    { value: "250+", label: "Items Found", icon: "📦" },
    { value: "180+", label: "Items Returned", icon: "🎉" },
    { value: "72%", label: "Success Rate", icon: "📈" },
    { value: "500+", label: "Happy Students", icon: "😊" },
  ];

  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-block mb-4">
              <span className="badge bg-primary-100 text-primary-700 text-sm px-4 py-2">
                🎓 School Community Platform
              </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-dark-900 mb-6 leading-tight">
                Find What You've{" "}
                <span className="text-gradient">Lost</span>
              </h1>

              <p className="text-xl md:text-2xl text-dark-600 mb-10 leading-relaxed">
                A modern platform helping students and staff reunite with their
                lost belongings quickly and efficiently.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                    href="/items"
                    className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2"
                >
                  <span>🔍</span>
                  <span>Search Lost Items</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
                </Link>

                <Link
                    href="/report"
                    className="px-8 py-4 bg-white text-dark-800 rounded-2xl font-semibold border-2 border-dark-200 hover:border-primary-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2"
                >
                  <span>📝</span>
                  <span>Report Found Item</span>
                </Link>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                  <div
                      key={index}
                      className="card-modern p-6 text-center animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-dark-600">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">How It Works</h2>
              <p className="text-dark-600 text-lg max-w-2xl mx-auto">
                Three simple steps to reunite with your belongings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className="card-modern p-8 text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div
                        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <span className="text-4xl">{feature.icon}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-dark-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-dark-600 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6">
                  <span className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                    Learn more<svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-20 px-4 bg-gradient-to-br from-dark-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">Simple Process</h2>
              <p className="text-dark-600 text-lg">
                From reporting to claiming, we've made it effortless
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Report or Search",
                  desc: "Submit found items with photos or search our database",
                },
                {
                  step: "02",
                  title: "Admin Review",
                  desc: "Our staff quickly reviews and approves submissions",
                },
                {
                  step: "03",
                  title: "Claim & Retrieve",
                  desc: "Submit a claim and arrange pickup at the main office",
                },
              ].map((item, index) => (
                  <div
                      key={index}
                      className="flex items-start gap-6 card-modern p-6"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-dark-600">{item.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="card-modern p-12 text-center bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

              <div className="relative z-10">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Found Something?
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  Help a fellow student or staff member by reporting it now. Every
                  item counts!
                </p>

                <Link
                    href="/report"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span>📝</span>
                  <span>Report a Found Item</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
