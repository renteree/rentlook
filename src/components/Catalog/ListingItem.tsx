import React from 'react';
import Card from '@material-ui/core/Card';
import { FormattedMessage } from 'react-intl';

import PortraitIcon from '@material-ui/icons/AccountCircle';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import messages from './messages';

type Props = {
  item: Models.Renter;
};

const ListingItem = React.forwardRef<HTMLElement, Props>(({ item }, ref) => (
  <Card className="item-container" ref={ref}>
    {!item.image && <PortraitIcon className="photo-unknown" color="disabled" />}
    {item.image && <Avatar src={item.image?.url} className="photo-preview" alt={item.user.name} />}
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
));

export default ListingItem;
