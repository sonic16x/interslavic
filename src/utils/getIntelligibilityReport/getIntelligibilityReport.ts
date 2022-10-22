import { t } from "translations";

export function getIntelligibilityReport(lang: string, sameInLanguages: string) {
    const record = sameInLanguages.split(' ').find(w => w.replace(/[^a-z]+/g, '') === lang);

    const result = {
        emoji: '⚪',
        status: t('unknownStatus'),
        verified: false,
    };

    if (record) {
        if (record.endsWith('+') || record.endsWith('?')) {
            result.emoji = '🟢'
            result.status = t('intelligibleStatus')
        } else if (record.endsWith('*') || record.endsWith('~')) {
            result.emoji = '🟡'
            result.status = t('quasiIntelligibleStatus')
        } else if (record.endsWith('-')) {
            result.emoji = '🔴';
            result.status = `${t('nonIntelligibleStatus')}`;
        } else {
            result.emoji = '🐍';
            result.status = `${t('falseFriend')}`;
        }

        if (record.endsWith('?') || record.endsWith('~')) {
            result.emoji += '🐍';
            result.status += ` + ${t('falseFriend')}`;
        }

        result.verified = !record.startsWith('!');
        if (!result.verified) {
            result.status = `(${t('notVerified')}) ${result.status}`;
        }
    }

    return result;
}
