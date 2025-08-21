const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-4 md:py-3 bg-gray-300 text-gray-600">
      <div className="flex flex-col md:flex-row md:justify-center text-center">
        <h6 className="text-sm font-semibold">Magyar Rögbi Szövetség</h6>
        <div className="hidden md:inline-block md:mx-2">-</div>
        <h6 className="text-sm">Játékvezetői Bizottság</h6>
      </div>
      <div className="flex text-center justify-center">
        <p className="text-xs">{`© ${year} Developed by BG`}</p>
      </div>
    </footer>
  );
};

export default Footer;
