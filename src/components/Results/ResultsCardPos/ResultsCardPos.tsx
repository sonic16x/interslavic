import { memo } from 'react'

import { t } from 'translations'

import { eachLemma, expandAbbr, translateAbbr } from 'utils'

import { Hint } from 'components/Hint'

interface IResultsCardPosProps {
    details: string
}

export const ResultsCardPos = memo<IResultsCardPosProps>(({ details }) => (
    <Hint
        title={eachLemma(details).map((item) => expandAbbr(t, item)).join(' / ')}
        shortTitle={eachLemma(details).map((item) => translateAbbr(t, item)).join(' / ')}
    />
))

ResultsCardPos.displayName = 'ResultsCardPos'
