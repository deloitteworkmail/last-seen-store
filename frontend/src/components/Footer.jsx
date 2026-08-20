export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">Last Seen</div>
      <div>&copy; {new Date().getFullYear()} Last Seen. All prices in INR.</div>
    </footer>
  );
}
