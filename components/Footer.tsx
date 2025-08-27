const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-2 md:py-2 bg-blue-400 m-4 md:rounded-2xl">
      <div className="flex flex-col md:justify-center text-center ">
        <h6 className="text-sm text-red-500 mb-0.5 font-semibold">Magyar Rögbi Szövetség</h6>
        <h6 className="text-xs text-white mb-0.5">Játékvezetői Bizottság</h6>
      </div>
      <div className="flex text-center text-green-800 justify-center">
        <p className="text-xs">{`© ${year} Developed by BG`}</p>
      </div>
    </footer>
  );
};

export default Footer;
