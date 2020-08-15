import React from 'react';
import Card from '@material-ui/core/Card';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PortraitIcon from '@material-ui/icons/AccountCircle';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';
import messages from './messages';

type Props = {
  item: Models.Renter;
};

const ListingItem = React.forwardRef<HTMLDivElement, Props>(({ item }, ref) => (
  <RootRef rootRef={ref || undefined}>
    <Box className="item-container">
      <Link to={`/ad/${item.id}`}>
        <Card className="card">
          {item.avatar ? (
            <Avatar src={item.avatar} className="photo-preview" alt={item.user.name} />
          ) : (
            <PortraitIcon className="photo-unknown" color="disabled" />
          )}
          <Box display="flex" justifyContent="space-between" flexDirection="row" width="100%">
            <Box display="flex" flexDirection="column" justifyContent="center" ml={2}>
              <Typography variant="subtitle2">{item.user.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                <FormattedMessage {...messages[item.housingType]} />
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="button">
                {item.minBudget} {item.currency}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Link>
    </Box>
  </RootRef>
));

export default ListingItem;
