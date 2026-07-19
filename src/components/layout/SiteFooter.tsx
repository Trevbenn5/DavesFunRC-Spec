import './SiteFooter.css';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer class="site-footer">
      <div class="site-footer__inner">
        <p>&copy; {year} DavesFunRC. Fun with RC planes, on a shoestring budget.</p>
      </div>
    </footer>
  );
}
