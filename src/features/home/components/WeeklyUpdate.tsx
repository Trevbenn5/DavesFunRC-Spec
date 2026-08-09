import './WeeklyUpdate.css';
import foamSheetConstructionImage from '../../../assets/home/foam-sheet-construction.jpg';
import davesWorkbenchImage from '../../../assets/home/daves-workbench.jpg';
import { homeWeeklyUpdate } from '../../../data/home-weekly-update';

export function WeeklyUpdate() {
  return (
    <aside className="weekly-update" aria-labelledby="weekly-update-heading">
      <div className="weekly-update__images">
        <img
          className="weekly-update__image"
          src={foamSheetConstructionImage}
          alt="A scratch-built foam sheet RC plane, painted blue and yellow, with a toy pilot figure sitting on top"
        />
        <img
          className="weekly-update__image"
          src={davesWorkbenchImage}
          alt="Dave's workbench, with a part-built RC plane in blue foam with a yellow tail, paper build templates and a shaped foam offcut laid out beside it"
        />
      </div>
      <h2 id="weekly-update-heading">{homeWeeklyUpdate.heading}</h2>
      <div
        className="weekly-update__scroll"
        tabIndex={0}
        role="region"
        aria-labelledby="weekly-update-heading"
      >
        {homeWeeklyUpdate.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </aside>
  );
}
