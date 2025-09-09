const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="p-2 md:py-2 bg-blue-100 m-4 md:rounded-2xl text-indigo-800">
      <div className="flex flex-col md:justify-center text-center ">
        <h6 className="text-sm mb-0.5 font-semibold">Magyar Rögbi Szövetség</h6>
        <h6 className="text-xs mb-0.5">Játékvezetői Bizottság</h6>
      </div>
      <div className="flex text-center justify-center">
        <p className="text-xs">{`© ${year} Developed by BG`}</p>
      </div>
    </footer>
  );
};

export default Footer;
