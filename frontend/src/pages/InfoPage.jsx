import { useParams, Link } from "react-router-dom";

const CONTENT = {
  "shipping-returns": {
    title: "Shipping & Returns",
    body: [
      "We ship across India, with delivery typically taking 3-5 business days. Orders over ₹999 qualify for free shipping.",
      "Not the right fit? Returns are accepted within 7 days of delivery, provided the item is unused, unwashed, and in its original packaging.",
      "Once we receive your return, refunds are processed to your original payment method within 5-7 business days.",
    ],
  },
  "size-guide": {
    title: "Size Guide",
    body: [
      "Measurements are in centimetres. If you're between sizes, we generally recommend sizing up for a relaxed fit.",
      "S — Chest 92-97 · Length 68",
      "M — Chest 98-103 · Length 70",
      "L — Chest 104-109 · Length 72",
      "XL — Chest 110-115 · Length 74",
    ],
  },
  contact: {
    title: "Contact Us",
    body: [
      "Questions about an order, a product, or anything else? We're a small team and read every message.",
      "Email us at hello@lastseen.example and we'll get back to you within 1-2 business days.",
    ],
  },
  "our-story": {
    title: "Our Story",
    body: [
      "Last Seen started with a simple frustration: most clothing is designed to be looked at once, in a photo, and never again.",
      "We wanted to make things worth noticing the second, third, and hundredth time you wear them — considered fabrics, considered fit, considered everything.",
    ],
  },
  sustainability: {
    title: "Sustainability",
    body: [
      "We're early in this journey and won't pretend otherwise. We're working toward responsibly sourced materials and manufacturing partners who treat people fairly.",
      "As we grow, we'll share real progress here — not just intentions.",
    ],
  },
  careers: {
    title: "Careers",
    body: [
      "We're not actively hiring right now, but we're a small team building something we care about, and that changes.",
      "If you'd like to be considered for future openings, feel free to reach out via our Contact page.",
    ],
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const page = CONTENT[slug];

  if (!page) {
    return (
      <div className="page">
        <p className="error">Page not found.</p>
        <Link to="/">Back home</Link>
      </div>
    );
  }

  return (
    <div className="page info-page">
      <Link to="/" className="back-link">
        &larr; Home
      </Link>
      <h1>{page.title}</h1>
      {page.body.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
