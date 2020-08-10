import React, { PropsWithChildren } from 'react';
import { RouteComponentProps } from 'react-router';

interface MatchParams {
  id: string;
}

type Props = RouteComponentProps<MatchParams>;

const Renter: React.FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  return <div>Here will be advertisement details for the ad #{id}</div>;
};

export default Renter;
