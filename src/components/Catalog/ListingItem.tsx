import React from 'react';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import PortraitIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Grid } from '@material-ui/core';

type Props = {
  item: Models.Renter;
};

const ListingItem = React.forwardRef<HTMLElement, Props>(({ item }, ref) => (
  <Card className="item-container" ref={ref}>
    {!item.image && <PortraitIcon className="photo-preview" color="disabled" />}
    <Grid container spacing={2} className="item-content">
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2">
            <FormattedMessage {...messages.name} />
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">
            {item.user.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2">
            <FormattedMessage {...messages.city} />
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">
            {item.location.city}, {item.location.country}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body2">
            <FormattedMessage {...messages.budget} />
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">
            {item.minBudget} - {item.maxBudget}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  </Card>
));

export default ListingItem;
