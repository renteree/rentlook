import React from 'react';
import {
  Container,
  TextField,
  Box,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
  Button,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useIntl, FormattedMessage } from 'react-intl';

// Locale
import messages from './messages';

// Internal
import { postTenants } from '~/api/coreApi';

const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    minWidth: 100,
  },
  submitButton: {
    marginLeft: theme.spacing(1),
  },
}));

const CreateRenter: React.FunctionComponent = () => {
  const intl = useIntl();
  const classes = useStyles();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const object = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      social: formData.get('social') as string,
      title: formData.get('title') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string,
      description: formData.get('description') as string,
      tenantsDescription: formData.get('tenantsDescription') as string,
      minBudget: Number(formData.get('minBudget') as string),
      maxBudget: Number(formData.get('maxBudget') as string),
      willPayFee: (formData.get('willPayFee') as string) !== null,
      housingType: formData.get('housingType') as string,
      currency: formData.get('currency') as string,
    };

    postTenants(object);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField name="title" label={intl.formatMessage(messages.title)} fullWidth />
        <Box display="flex" justifyContent="space-between">
          <TextField name="name" label={intl.formatMessage(messages.userName)} required />
          <TextField name="phone" label={intl.formatMessage(messages.userPhone)} required />
          <TextField name="social" label={intl.formatMessage(messages.social)} />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <TextField name="country" label={intl.formatMessage(messages.country)} required />
          <TextField name="city" label={intl.formatMessage(messages.city)} />
          <FormControl className={classes.formControl}>
            <InputLabel id="select-housing-type-label"><FormattedMessage {...messages.housingType} /></InputLabel>
            <Select
              name="housingType"
              labelId="select-housing-type-label"
              id="select-housing-type"
              defaultValue="flat"
            >
              <MenuItem value="flat"><FormattedMessage {...messages.flat} /></MenuItem>
              <MenuItem value="house"><FormattedMessage {...messages.house} /></MenuItem>
              <MenuItem value="room"><FormattedMessage {...messages.room} /></MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <TextField name="minBudget" label={intl.formatMessage(messages.budgetFrom)} type="number" />
          <TextField name="maxBudget" label={intl.formatMessage(messages.budgetTo)} type="number" />
          <FormControl className={classes.formControl}>
            <InputLabel id="select-currency-label"><FormattedMessage {...messages.currency} /></InputLabel>
            <Select
              name="currency"
              labelId="select-currency-label"
              defaultValue="USD"
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="UAH">UAH</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="RUB">EUR</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <TextField
            name="description"
            label={intl.formatMessage(messages.description)}
            multiline
            fullWidth
            rows={4}
          />
        </Box>
        <Box>
          <TextField
            name="tenantsDescription"
            label={intl.formatMessage(messages.tenantsDescription)}
            multiline
            fullWidth
            rows={4}
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox name="willPayFee" />
            }
            label={intl.formatMessage(messages.willPayFee)}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained">
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            type="submit"
          >
            <FormattedMessage {...messages.submit} />
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateRenter;
