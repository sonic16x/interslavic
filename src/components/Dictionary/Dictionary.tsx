import { Controls } from 'components/Controls';
import { Results } from 'components/Results';

import './Dictionary.scss';

export const Dictionary =
    () => (
        <div className="dictionary">
            <Controls/>
            <Results/>
        </div>
    );
