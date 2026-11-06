import Branch from '../ornaments/Branch';
import './ui.css';

/**
 * Fixed background layer: warm sunlight pools, leaf shadows drifting as if
 * cast by trees overhead, and a fine paper grain over everything.
 */
export default function Atmosphere({ variant = 'landing' }) {
  return (
    <div className={`atmosphere atmosphere--${variant}`} aria-hidden="true">
      <div className="atmosphere__sun atmosphere__sun--a" />
      <div className="atmosphere__sun atmosphere__sun--b" />
      <div className="atmosphere__shadow atmosphere__shadow--a">
        <Branch leaves={15} bend={50} color="var(--forest)" />
      </div>
      <div className="atmosphere__shadow atmosphere__shadow--b">
        <Branch leaves={12} bend={-40} color="var(--forest)" />
      </div>
      <div className="atmosphere__shadow atmosphere__shadow--c">
        <Branch leaves={9} bend={25} color="var(--moss)" />
      </div>
      <div className="atmosphere__grain" />
    </div>
  );
}
