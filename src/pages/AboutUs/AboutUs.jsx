import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px", background: "#e6edf7", color: "#0f172a" }}>
      <h1 style={{ marginTop: 0 }}>About Us</h1>
      <p>
        AGAP (Automated Geospatial Alert Platform) provides location-based flood risk updates to help
        communities stay informed and safe.
      </p>
      <p>
        Our goal is to deliver timely flood information through an easy-to-use interface so users can
        make better decisions before and during severe weather events.
      </p>
      <p>
        <Link to="/welcome">Back to Welcome</Link>
      </p>
    </main>
  );
}
