import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

/*
 * Wrapper for more graceful creation an action in a functional component
 */

export default (action: Function): Function => {
  const dispatch = useDispatch();
  return (...props: any): Dispatch<any> => dispatch(action(...props));
};
