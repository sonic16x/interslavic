import './Dictionary.scss';

import { Controls } from 'components/Controls';
import { Results } from 'components/Results';

export const Dictionary =
    () => (
        <div className={'dictionary'}>
            <Controls/>
            <Results/>
        </div>
    );
