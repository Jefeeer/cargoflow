import { Link } from 'react-router-dom';
import { ABOUT } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';

export function AboutTeaser() {
  return (
    <section className="section bg-ink-900">
      <div className="container-cf">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="kicker">{ABOUT.kicker}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl text-balance">{ABOUT.headline}</h2>
            <p className="mt-5 text-lg text-steel-300 text-pretty">{ABOUT.body[0]}</p>
            <Link to="/about" className="btn-secondary btn-lg mt-8 inline-flex">
              About CargoFlow
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
