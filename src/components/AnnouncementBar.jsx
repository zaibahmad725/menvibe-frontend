import "../styles/announcement.css";

const messages = [
  "Free shipping on orders above PKR 5,000",
  "Authentic luxury watches — guaranteed",
  "Cash on Delivery available across Pakistan",
  "7-day easy returns — no questions asked",
  "Gift wrapping available on all orders",
  "New arrivals every week — stay tuned",
];

function AnnouncementBar() {
  const repeated = [...messages, ...messages];

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {repeated.map((msg, i) => (
          <span key={i} className="announcement-item">
            {msg}
            <span className="announcement-divider">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementBar;