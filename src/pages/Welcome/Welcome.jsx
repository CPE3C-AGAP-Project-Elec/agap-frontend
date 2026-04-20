import { Link } from "react-router-dom";
import { User } from "lucide-react";
import backgroundImage from "../../assets/philippines-map-bg.svg";

export default function Welcome() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          background: "#2565A8",
          color: "#fff",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ lineHeight: 1.1, fontWeight: 700, letterSpacing: "0.06em" }}>
          <div>AUTOMATED GEOSPATIAL</div>
          <div>ALERT PLATFORM</div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Link to="/welcome" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
            Home
          </Link>
          <Link to="/about" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
            About Us
          </Link>
          <Link to="/about#contact" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
            Contact
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <User aria-hidden />
          </Link>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "relative", padding: "64px 32px", color: "#fff" }}>
          <h1 style={{ margin: 0, fontSize: 44, fontWeight: 800 }}>WELCOME</h1>
          <p style={{ marginTop: 12, maxWidth: 520, opacity: 0.95 }}>
            Click the profile icon to open Account Settings.
          </p>
        </div>
      </main>

      <footer style={{ background: "#2565A8", color: "#fff", padding: "12px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ lineHeight: 1.1, letterSpacing: "0.06em", fontWeight: 700 }}>
            <div style={{ fontSize: 14 }}>AUTOMATED GEOSPATIAL</div>
            <div style={{ fontSize: 14 }}>ALERT PLATFORM</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 14 }}>
            <p style={{ margin: "0 0 6px" }}>
              <strong>Email:</strong> agap.system@gmail.com
            </p>
            <p style={{ margin: "0 0 6px" }}>
              <strong>Phone:</strong> +63 912 345 6789
            </p>
            <p style={{ margin: 0 }}>
              <strong>Location:</strong> Malolos, Bulacan, Philippines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
