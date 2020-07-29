import { ActionType } from 'typesafe-actions';
import * as Actions from '~/redux/locale/actions';

/*
 * Used for typing each action
 */

export type ActionTypes = ActionType<typeof Actions>;

/*
 * Type of locale options
 */

export const arrayWithAllLanguages = ['en', 'ru'] as const;

export type Language = typeof arrayWithAllLanguages[number];
