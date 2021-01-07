import React from "react";

// App
import QRCode from "qrcode.react";
import { convertQR } from "../../helpers";

// Styles
import { Card, Button } from "@material-ui/core";
import "./QR.scss";

function QR(props) {
  const downloadQR = () => {
    const canvas = document.getElementById("profile-qr");
    convertQR(canvas, props.imageName);
  };
  return (
    <Card>
      <div className="qr">
        <h3 className="qr__title">{props.qrTitle}</h3>
        <QRCode id="profile-qr" value={window.location.href} />
        <Button variant="outlined" onClick={downloadQR}>
          Download QR
        </Button>
      </div>
    </Card>
  );
}

export default QR;
