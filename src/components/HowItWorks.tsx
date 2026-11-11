import {
  Search,
  CalendarCheck,
  Handshake,
  ArrowRight,
} from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find what you need",
      description:
        "Search your community for tools, appliances, books, sports equipment and more.",
    },
    {
      number: "02",
      icon: CalendarCheck,
      title: "Request to borrow",
      description:
        "Choose when you need the item and send a simple borrowing request to its owner.",
    },
    {
      number: "03",
      icon: Handshake,
      title: "Share & return",
      description:
        "Pick up the item, use it responsibly and return it on time to keep sharing going.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Simple by design
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Sharing should be{" "}
            <span className="text-emerald-600">easy.</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            ShareNest makes borrowing and sharing resources within your
            community simple, trusted and convenient.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60"
              >

                {/* Number */}
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Icon size={26} />
                  </div>

                  <span className="text-sm font-bold text-slate-300">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                      <ArrowRight
                        size={17}
                        className="text-emerald-600"
                      />
                    </div>
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;