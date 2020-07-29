import { ActionType } from 'typesafe-actions';
import * as Actions from '~/redux/renters/actions';

/*
 * Used for typing each action
 */

export type ActionTypes = ActionType<typeof Actions>;
