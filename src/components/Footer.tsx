import SannvaraLogo from './Common/SannvaraLogo';

export default function Footer() {
  return (
    <footer className="bg-bg-dark pt-[100px] pb-6 flex flex-col items-center">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-[60px]">
        {/* Huge Logo Part */}
        <div className="w-full flex justify-center items-center pb-12 md:pb-20 pl-1 md:pl-4 lg:pl-6">
          <SannvaraLogo className="w-full h-auto text-bg-light" />
        </div>

        {/* Bottom Bar items inline */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[12px] md:text-[14px] text-bg-light/60 font-body font-normal">
          {/* Left Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-bg-light transition-colors">Instagram</a>
            <a href="#" className="hover:text-bg-light transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-bg-light transition-colors">X</a>
            <a href="#" className="hover:text-bg-light transition-colors">Facebook</a>
            <a href="#" className="hover:text-bg-light transition-colors">Threads</a>
            <a href="#" className="hover:text-bg-light transition-colors">The Gather</a>
          </div>

          {/* Right Links & Copyright */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-bg-light transition-colors">Copyright</a>
            <span>© 2026 Sannvara</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
