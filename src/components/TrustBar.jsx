import "../styles/trustbar.css";

const items = [
  { icon: "🚚", title: "Free Delivery", sub: "Free delivery on all orders" },
  { icon: "✅", title: "100% Authentic", sub: "Genuine luxury watches only" },
  { icon: "💵", title: "Cash on Delivery", sub: "Available across Pakistan" },
  { icon: "🔄", title: "7-Day Returns", sub: "No questions asked" },
];

function TrustBar() {
  return (
    <section className="trust-bar">
      {items.map((item, i) => (
        <div key={i} className="trust-item">
          <span className="trust-icon">{item.icon}</span>
          <div>
            <p className="trust-title">{item.title}</p>
            <p className="trust-sub">{item.sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default TrustBar;