// This is a placeholder for a real hero background image
// In a real implementation, you would use an actual high-quality image file
// For now, we'll create a canvas-based gradient for the background

document.addEventListener("DOMContentLoaded", function () {
  const heroSection = document.querySelector("header");
  if (!heroSection) return;

  // Remove the background image class if it exists
  heroSection.classList.remove("bg-[url('/hero-bg.jpg')]");

  // Create a canvas element for the background
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = heroSection.offsetHeight;

  // Style the canvas
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "0";

  // Insert the canvas before the first child of the hero section
  heroSection.insertBefore(canvas, heroSection.firstChild);

  // Get the canvas context
  const ctx = canvas.getContext("2d");

  // Function to draw the background
  const drawBackground = () => {
    // Create a gradient background that looks like a professional trading interface
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#065f46"); // Emerald
    gradient.addColorStop(0.5, "#064e3b"); // Dark emerald
    gradient.addColorStop(1, "#047857"); // Another shade of emerald

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some subtle texture
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1.0;

    // Add some "data visualization" elements to make it look like a trading interface
    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }

    // Add some candlestick-like elements
    ctx.fillStyle = "rgba(16, 185, 129, 0.3)"; // Emerald for up candles
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 60 + 20;
      ctx.fillRect(x, y, width, height);
    }

    ctx.fillStyle = "rgba(239, 68, 68, 0.3)"; // Red for down candles
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 60 + 20;
      ctx.fillRect(x, y, width, height);
    }

    // Add some line charts
    ctx.strokeStyle = "rgba(16, 185, 129, 0.6)"; // Emerald line
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let i = 0; i < canvas.width; i += 5) {
      ctx.lineTo(
        i,
        canvas.height / 2 + Math.sin(i / 30) * 50 + Math.random() * 20
      );
    }
    ctx.stroke();

    // Add a different color line
    ctx.strokeStyle = "rgba(5, 150, 105, 0.5)"; // Green line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 3);

    for (let i = 0; i < canvas.width; i += 5) {
      ctx.lineTo(
        i,
        canvas.height / 3 + Math.cos(i / 20) * 40 + Math.random() * 15
      );
    }
    ctx.stroke();

    // Add a semi-transparent radial gradient in the center for a spotlight effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.max(canvas.width, canvas.height) / 2;

    const radialGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );

    radialGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    radialGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
    radialGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Initial draw
  drawBackground();

  // Handle window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = heroSection.offsetHeight;
    drawBackground();
  });
});
