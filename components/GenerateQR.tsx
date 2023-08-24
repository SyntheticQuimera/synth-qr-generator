import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import { QRCode, EyeColor } from "react-qrcode-logo";
import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { saveQRCode } from "@/utils/firebaseFunctions";

interface GenerateProps {}

export const GenerateQR: React.FC<GenerateProps> = () => {
  const [logoImage, setLogoImage] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [qrStyle, setQrStyle] = useState<string>("squares");
  const [logoPaddingStyle, setLogoPaddingStyle] = useState<string>("square");
  const [logoPadding, setLogoPadding] = useState<number>(0);
  const [eyeRadius, setEyeRadius] = useState<number>(0);
  const [quietZone, setQuietZone] = useState<number>(10);
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [eyeColor, setEyeColor] = useState<
    EyeColor | [EyeColor, EyeColor, EyeColor] | undefined
  >(undefined);
  const [logoWidth, setLogoWidth] = useState<number>(100);
  const [logoHeight, setLogoHeight] = useState<number>(100);
  const [removeQrCodeBehindLogo, setRemoveQrCodeBehindLogo] =
    useState<boolean>(false);

  const [downloadURL, setDownloadURL] = useState<string>("");
  const [canvasImage, setCanvasImage] = useState<string>("");

  const canvasStates = [
    logoImage,
    qrCode,
    qrStyle,
    logoPaddingStyle,
    logoPadding,
    eyeRadius,
    quietZone,
    fgColor,
    bgColor,
    logoWidth,
    logoHeight,
    removeQrCodeBehindLogo,
    eyeColor,
  ];

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);
      reader.onload = () => {
        setLogoImage(reader.result as string);
      };
    } else {
      setLogoImage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    setTimeout(() => {
      if (qrCode) {
        const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
        const dataUrl = canvas.toDataURL();
        setCanvasImage(dataUrl);
      }
    }, 1000);
  }, [...canvasStates]);

  useEffect(() => {
    if (downloadURL) {
      const data = {
        id: `${Date.now()}`,
        createAt: Date.now(),
        qrCode: downloadURL,
      };
      saveQRCode(data);
    }
  }, [downloadURL]);

  const handleDownload = () => {
    const qrCodeEl = document.getElementById("qr-code");
    if (qrCodeEl) {
      html2canvas(qrCodeEl).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${Date.now()}-qrcode.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const uploadImage = async () => {
    const storageRef = ref(storage, `Images/${Date.now()}-qrcode.png`);
    await uploadString(storageRef, canvasImage, "data_url")
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setDownloadURL(url);
          console.log("File available at", url);
        });
        console.log("Uploaded a data_url string!");
      })
      .catch((error) => {
        console.error("Error uploading file: ", error);
      });
  };
  return (
    <>
      <div className="flex justify-center py-8 px-6">
        <h1 className="md:text-6xl uppercase font-black text-4xl">
          QR Code Generator
        </h1>
      </div>
      <div className="flex w-full md:flex-row flex-col justify-center gap-4 p-4">
        <div className="flex space-y-4 flex-col w-full md:max-w-md">
          <Form className="space-y-4 d-grid" onSubmit={handleSubmit}>
            <FloatingLabel label="Please enter a URL here">
              <Form.Control
                value={qrCode}
                type="text"
                placeholder="Please enter a URL here:"
                onChange={(event) => setQrCode(event.target.value)}
              />
            </FloatingLabel>
            {logoImage.length > 0 ? (
              <div
                onClick={() => setLogoImage("")}
                className="w-full h-14 active:ring-4 uppercase ring-[#0d6efd] ring-opacity-30 cursor-pointer rounded-md flex font-semibold items-center justify-center bg-red-500"
              >
                Remove logo
              </div>
            ) : (
              <Form.Label htmlFor="file-input">
                <div className="w-full h-14 text-black uppercase border active:ring-4 ring-[#0d6efd] ring-opacity-30 border-[#ced4da] cursor-pointer rounded-md flex font-semibold items-center justify-center bg-white">
                  Select a logo
                </div>
                <Form.Control
                  id="file-input"
                  className="visually-hidden"
                  type="file"
                  onChange={handleLogoChange}
                />
              </Form.Label>
            )}
            <FloatingLabel label="Style of the QR Code modules">
              <Form.Select onChange={(event) => setQrStyle(event.target.value)}>
                <option value="squares">Squares</option>
                <option value="dots">Dots</option>
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel label="Padding area around the logo">
              <Form.Select
                onChange={(event) => setLogoPaddingStyle(event.target.value)}
              >
                <option value="square">Square</option>
                <option value="circle">Circle</option>
              </Form.Select>
            </FloatingLabel>
            <Form.Label className=" font-semibold">
              Eye Radius {eyeRadius?.toString()}
            </Form.Label>
            <Form.Range
              min={0}
              max={100}
              value={eyeRadius}
              onChange={(event) => setEyeRadius(parseInt(event.target.value))}
            />
            {/* <Form.Label className=" font-semibold">
              Quiet Zone {quietZone?.toString()}
            </Form.Label>
            <Form.Range
              min={0}
              max={60}
              value={quietZone}
              onChange={(event) => setQuietZone(event.target.valueAsNumber)}
            /> */}
            <div className="grid grid-flow-col gap-12 place-items-center">
              <Form.Label className="grid w-full place-items-start gap-2  font-semibold">
                Logo background
                <Form.Check
                  label={removeQrCodeBehindLogo === false ? "Off" : "On"}
                  type="switch"
                  onChange={(event) => {
                    setRemoveQrCodeBehindLogo(event.target.checked);
                    removeQrCodeBehindLogo !== false && setLogoPadding(0);
                  }}
                />
              </Form.Label>
              <Form.Label className="grid w-full place-items-start gap-2  font-semibold">
                Logo Padding {logoPadding?.toString()}
                <Form.Range
                  disabled={!removeQrCodeBehindLogo}
                  min={0}
                  max={40}
                  value={logoPadding}
                  onChange={(event) =>
                    setLogoPadding(event.target.valueAsNumber)
                  }
                />
              </Form.Label>
            </div>

            <div className="grid grid-flow-col gap-12 place-items-center">
              <Form.Label className="grid w-full place-items-start gap-2  font-semibold">
                Logo Width {(logoWidth / 100)?.toString()}
                <Form.Range
                  min={100}
                  max={150}
                  value={logoWidth}
                  onChange={(event) => setLogoWidth(event.target.valueAsNumber)}
                />
              </Form.Label>
              <Form.Label className="grid w-full place-items-start gap-2  font-semibold">
                Logo Height {(logoHeight / 100)?.toString()}
                <Form.Range
                  min={100}
                  max={150}
                  value={logoHeight}
                  onChange={(event) =>
                    setLogoHeight(event.target.valueAsNumber)
                  }
                />
              </Form.Label>
            </div>
            <div className="flex gap-6 justify-between">
              <Form.Label
                className="grid place-items-center gap-3  font-semibold"
                htmlFor="fgColor"
              >
                Code color
                <Form.Control
                  type="color"
                  id="fgColor"
                  defaultValue="#000000"
                  title="Choose your color"
                  onChange={(event) => setFgColor(event.target.value)}
                />
              </Form.Label>
              <Form.Label
                className="grid place-items-center gap-3  font-semibold"
                htmlFor="bgColor"
              >
                Background
                <Form.Control
                  type="color"
                  id="bgColor"
                  defaultValue="#FFFFFF"
                  title="Choose your color"
                  onChange={(event) => setBgColor(event.target.value)}
                />
              </Form.Label>
              <Form.Label
                className="grid place-items-center gap-3  font-semibold"
                htmlFor="bgColor"
              >
                Eye color
                <Form.Control
                  type="color"
                  id="eyeColor"
                  defaultValue=""
                  title="Choose your color"
                  onChange={(event) => setEyeColor(event.target.value)}
                />
              </Form.Label>
            </div>
          </Form>
        </div>
        <div className="flex justify-center">
          <div className="space-y-4 flex-col flex w-full items-center">
            {qrCode ? (
              <>
                <QRCode
                  id="qr-code"
                  value={qrCode}
                  removeQrCodeBehindLogo={removeQrCodeBehindLogo}
                  size={300}
                  logoImage={logoImage}
                  logoPaddingStyle={
                    logoPaddingStyle === "circle" ? "circle" : "square"
                  }
                  logoPadding={logoPadding}
                  eyeRadius={
                    Array.isArray(eyeRadius)
                      ? eyeRadius
                      : typeof eyeRadius === "number"
                      ? [eyeRadius, eyeRadius, eyeRadius]
                      : undefined
                  }
                  eyeColor={eyeColor}
                  quietZone={20}
                  ecLevel="H"
                  fgColor={fgColor}
                  bgColor={bgColor}
                  qrStyle={qrStyle === "dots" ? "dots" : "squares"}
                  logoWidth={logoWidth}
                  logoHeight={logoHeight}
                />
              </>
            ) : (
              <div className=" w-full md:w-[340px] h-[340px]  border rounded-lg uppercase text-4xl items-center justify-center flex text-white/60">
                <h1>Empty URL</h1>
              </div>
            )}
            <Button
              disabled={!qrCode}
              className="w-full uppercase"
              size="lg"
              onClick={() => {
                handleDownload();
                uploadImage();
              }}
            >
              Save and Download
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
