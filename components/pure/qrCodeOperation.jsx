import { useQRCode } from "next-qrcode";

const QrCodeOperation = (props) => {
  const { Canvas, Image } = useQRCode();

  let image = (
    <Image
      className="qrcode"
      text={`https://system-qr-inventory.vercel.app/reports/operations/detail/${props.id}`}
      options={{
        type: "image/png",
        quality: 0.9,
        level: "H",
        margin: 1,
        scale: 100,
        width: props.width,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }}
    />
  );

  return <>{image}</>;
};

export default QrCodeOperation;
