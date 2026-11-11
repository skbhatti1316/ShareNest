import {
  IndianRupee,
  Leaf,
  ShieldCheck,
  Users,
  Clock3,
  PackageOpen,
} from "lucide-react";

function WhyShareNest() {
  const benefits = [
    {
      icon: IndianRupee,
      title: "Save Money",
      description:
        "Don't spend money on things you may only use a few times. Borrow them from your community instead.",
    },
    {
      icon: PackageOpen,
      title: "Use More, Own Less",
      description:
        "Give useful items a second life instead of letting them sit unused at home.",
    },
    {
      icon: ShieldCheck,
      title: "Built on Trust",
      description:
        "Share within verified communities where members know they are dealing with real people nearby.",
    },
    {
      icon: Users,
      title: "Stronger Communities",
      description:
        "Turn neighbors, classmates and hostel residents into a connected sharing network.",
    },
    {
      icon: Clock3,
      title: "Available Nearby",
      description:
        "Find useful resources close to you without spending hours searching online or traveling far.",
    },
    {
      icon: Leaf,
      title: "Reduce Waste",
      description:
        "Sharing more means buying less, reducing unnecessary consumption and making better use of existing resources.",
    },
  ];

  return (
    <section
      id="community"
      className="overflow-hidden bg-slate-900 px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            Why ShareNest?
          </span>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your community has more resources than you{" "}
            <span className="text-emerald-400">think.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Millions of useful items sit unused while people nearby buy the
            same things again. ShareNest connects the two.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-3xl border border-slate-800 bg-slate-800/50 p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-slate-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom statement */}
        <div className="mt-16 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-bold text-white">
                One community. More possibilities.
              </p>

              <p className="mt-2 text-slate-300">
                Share what you have. Borrow what you need.
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-emerald-400">
                  342
                </p>
                <p className="text-sm text-slate-400">
                  Members
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-emerald-400">
                  87
                </p>
                <p className="text-sm text-slate-400">
                  Shared items
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-emerald-400">
                  4.9★
                </p>
                <p className="text-sm text-slate-400">
                  Trust rating
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default WhyShareNest;