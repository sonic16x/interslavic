import { Controls } from 'components/Controls';
import { Results } from 'components/Results';

import './DictionaryPage.scss';

export const DictionaryPage =
    () => (
        <div className="dictionary-page">
            <Controls/>
            <Results/>
        </div>
    );
