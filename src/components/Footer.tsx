import {
  Mail,
  Send,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
                S
              </div>

              <span className="text-2xl font-bold text-slate-900">
                Share<span className="text-emerald-600">Nest</span>
              </span>
            </div>

            <p className="mt-5 max-w-md leading-7 text-slate-500">
              A community sharing platform that helps people borrow,
              share and make better use of everyday resources.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">

              <button
                aria-label="Website"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-600 hover:text-white"
              >
                <Globe size={18} />
              </button>

              <button
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-600 hover:text-white"
              >
                <Send size={18} />
              </button>

              <button
                aria-label="Community"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-600 hover:text-white"
              >
                <MessageCircle size={18} />
              </button>

              <button
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-600 hover:text-white"
              >
                <Mail size={18} />
              </button>

            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-slate-900">
              Platform
            </h3>

            <div className="mt-5 space-y-3 text-sm text-slate-500">
              <Link
                to="/#how-it-works"
                className="block transition hover:text-emerald-600"
              >
                How It Works
              </Link>

              <Link
                to="/explore"
                className="block transition hover:text-emerald-600"
              >
                Explore Items
              </Link>

              <Link
                to="/community"
                className="block transition hover:text-emerald-600"
              >
                Community
              </Link>

              <Link
                to="/signup"
                className="block transition hover:text-emerald-600"
              >
                Join ShareNest
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-900">
              Company
            </h3>

            <div className="mt-5 space-y-3 text-sm text-slate-500">
              <a
                href="#"
                className="block transition hover:text-emerald-600"
              >
                About Us
              </a>

              <a
                href="#"
                className="block transition hover:text-emerald-600"
              >
                Contact
              </a>

              <a
                href="#"
                className="block transition hover:text-emerald-600"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="block transition hover:text-emerald-600"
              >
                Terms of Service
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 ShareNest. All rights reserved.
          </p>

          <p>
            Share More. Buy Less. Live Together.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;