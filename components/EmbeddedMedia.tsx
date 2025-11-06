type Props = {
  url: string;
};

const EmbeddedMedia = ({ url }: Props) => {
  return (
    <div className="bg-white relative h-auto w-full aspect-video">
      <iframe
        src={url}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};
export default EmbeddedMedia;
