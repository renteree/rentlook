import { createAction } from 'typesafe-actions';
import { Language } from '~/redux/locale/types';

const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';

/*
 * Each action invokes corresponding reducer with passed props in payload
 * A type of a payload is specified during an action creation
 */

export const changeLanguageAction = createAction(CHANGE_LANGUAGE)<Language>();

export default { changeLanguageAction };
