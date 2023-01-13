import { useQRCode } from "next-qrcode";

export default function QrCode(props) {
  const { Canvas, Image } = useQRCode();

  let canvas = (
    <Canvas
      text={`
        Nombre:${props.name}, 
        Ubicacion ${props.ubication}
        Existencia: ${props.stock}
        `}
      options={{
        level: "H",
        margin: 1,
        scale: 30,
        width: 85,
        color: {
          dark: "#000000ff",
          light: "#ffffffff",
        },
      }}
    />
  );

  let image = (
    <Image
      className="qrcode"
      text={`
        Nombre:${props.name}, 
        Ubicacion ${props.ubication}
        Existencia: ${props.stock}
        `}
      options={{
        type: "image/jpeg",
        quality: 0.9,
        level: "H",
        margin: 1,
        scale: 30,
        width: 80,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }}
    />
  );

  return <>{props.type === "canvas" ? canvas : image}</>;
}
