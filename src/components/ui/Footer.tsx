export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>
          🇮🇳 Made with ❤️ for India · Jeevan-Rakshak © {new Date().getFullYear()}
        </p>

        <div className="flex gap-6">
          <a href="/about" className="hover:text-red-600">About</a>
          <a href="/contact" className="hover:text-red-600">Contact</a>
          <a href="/privacy" className="hover:text-red-600">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
