// Example code to generate a png receipt from a JSON object received from an API

import { Box, Button, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

function Receipts() {
  const [orderId, setOrderId] = useState("66a3617e604bc555b031c5ef");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://development-dot-cardcafe-webhooks.uc.r.appspot.com/v1/api/orders/${orderId}`
      );

      const data = await res.json();

      console.log("--->", data);

      if (jsonData) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Destructure data from jsonData
        const { orderDate, orderNumber, shipTo, products } = jsonData;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set basic styles
        ctx.fillStyle = "#000";
        ctx.font = "18px Arial";

        // Title
        ctx.font = "bold 24px Arial";
        ctx.fillText("Packing Slip", 140, 50); // Center title

        // Order Info
        ctx.font = "18px Arial";
        ctx.fillText(`Order Date: ${orderDate}`, 50, 100);
        ctx.fillText(`Order Number: ${orderNumber}`, 50, 130);
        ctx.fillText(`Ship To: ${shipTo.name}`, 50, 160);
        ctx.fillText(`Address: ${shipTo.address}`, 50, 190);
        ctx.fillText("Ship Service: USPS Ground Advantage", 50, 220);

        // Table Headers
        ctx.font = "bold 16px Arial";
        ctx.fillText("Product", 50, 260);
        ctx.fillText("QTY", 200, 260);
        ctx.fillText("Card ID", 260, 260);
        ctx.fillText("Price", 350, 260);

        // Draw line under headers
        ctx.beginPath();
        ctx.moveTo(50, 270);
        ctx.lineTo(370, 270);
        ctx.stroke();

        // List of Products
        ctx.font = "14px Arial";
        let yPosition = 300; // Starting position for products

        products.forEach((product) => {
          ctx.fillText(product.name, 50, yPosition);
          ctx.fillText(product.qty.toString(), 200, yPosition);
          ctx.fillText(product.cardId, 260, yPosition);
          ctx.fillText(`$${product.price.toFixed(2)}`, 350, yPosition);
          yPosition += 30;

          if (product.gifts && product.gifts.length > 0) {
            product.gifts.forEach((gift, index) => {
              ctx.fillText(`Gift ${index + 1}: ${gift}`, 70, yPosition);
              yPosition += 20;
            });
          }

          yPosition += 10;
        });
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "generated-image.png";
    downloadLink.click();
  };

  return (
    <div className="seal-main">
      <h2>Receipts</h2>
      <Box
        style={{
          width: "500px",
          display: "flex",
          alignItems: "baseline",
          "@media (maxWidth: 600px)": {
            display: "block",
          },
        }}
      >
        <TextField
          size="small"
          fullWidth
          type="text"
          variant="outlined"
          label="Order Id"
          sx={{ marginRight: 1, marginTop: 1 }}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button
          variant="filled"
          style={{
            margin: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#3f6161",
            color: "white",
          }}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </Box>

      <div>
        <canvas ref={canvasRef} width={400} height={600}></canvas>
        {/* <button onClick={downloadImage}>Download PNG</button> */}
      </div>
    </div>
  );
}

export default Receipts;
