import { createAction } from 'typesafe-actions';

const ADD_RENTER = 'ADD_RENTER';

/*
 * Each action invokes corresponding reducer with passed props in payload
 * A type of a payload is specified during an action creation
 */

export const addRenterAction = createAction(ADD_RENTER)<Models.Renter[]>();

export default { addRenterAction };
