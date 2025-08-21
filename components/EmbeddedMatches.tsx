const EmbeddedMatches = () => {
  return (
    <div className="bg-white relative h-auto w-full">
      <iframe
        src="https://www.rugbystat.hu/enaptar/index.php"
        width="100%"
        height="750"
        allowFullScreen
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};
export default EmbeddedMatches;
