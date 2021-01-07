import React from "react";
import QRCode from "qrcode.react";
import { Card, Button } from "@material-ui/core";

// App
import { convertQR } from "../../helpers/qr";

// Styles
import "./QR.scss";

type QRTypes = {
  qrTitle: string;
  imageName: string;
};

const QR = ({ qrTitle, imageName }: QRTypes) => {
  const downloadQR = () => {
    const canvas = document.getElementById("profile-qr");
    convertQR(canvas, imageName);
  };
  return (
    <Card>
      <div className="qr">
        <h3 className="qr__title">{qrTitle}</h3>
        <QRCode id="profile-qr" value={window.location.href} />
        <Button variant="outlined" onClick={downloadQR}>
          Download QR
        </Button>
      </div>
    </Card>
  );
};

export default QR;
