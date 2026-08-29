import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';

export default function NotFoundPage() {
  return (
    <section className="section bg-ink-950 bg-tech-grid">
      <SEO title="Page Not Found" description="The page you're looking for could not be found." />
      <div className="container-cf text-center">
        <p className="kicker justify-center">404</p>
        <h1 className="mt-4 text-4xl sm:text-5xl text-balance">Page not found.</h1>
        <p className="mt-4 text-lg text-steel-300">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary btn-lg mt-8 inline-flex">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
