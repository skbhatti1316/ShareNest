import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-600 px-8 py-16 text-center sm:px-12">
          
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Users size={27} />
            </div>

            <h2 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start sharing with your community.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Join ShareNest and discover useful things around you,
              save money and help your community share more.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Join ShareNest
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/explore")}
                className="rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore items
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;