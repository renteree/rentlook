import React from 'react';
import { useHistory } from 'react-router-dom';
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
  Snackbar,
} from '@material-ui/core';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import { useIntl, FormattedMessage } from 'react-intl';
import phone from 'phone';

// Locale
import messages from './messages';

// Internal
import { postTenants } from '~/api/coreApi';
import GoogleAutocomplete from './GoogleAutocomplete';
import { currency } from '~/common/enums';

import Renter = Models.Renter;
import PlaceType = Models.PlaceType;

const defaultValidationForm = {
  phone: '',
};

const CreateRenter: React.FunctionComponent = () => {
  const intl = useIntl();
  const [
    validationForm,
    setValidationForm,
  ] = React.useState<{phone: string}>(defaultValidationForm);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(null);
  const [isSendingForm, setIsSendingForm] = React.useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const history = useHistory();

  const validateForm = (formData: FormData): boolean => {
    let isValid = true;
    const phoneNumberData = phone(formData.get('phone') as string);
    if (!phoneNumberData.length) {
      setValidationForm({ ...validationForm, phone: intl.formatMessage(messages.notValidNumber) });
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSendingForm(true);

    const formData = new FormData(event.currentTarget);

    const isValid = validateForm(formData);
    if (!isValid) return;

    const phoneNumberData = phone(formData.get('phone') as string);
    const body: Renter = {
      name: formData.get('name') as string,
      phone: phoneNumberData[0],
      title: formData.get('title') as string,
      country: locationValue?.structured_formatting.secondary_text as string,
      city: locationValue?.structured_formatting.main_text as string,
      cityId: locationValue?.place_id as string,
      minBudget: Number(formData.get('minBudget') as string),
      maxBudget: Number(formData.get('maxBudget') as string),
      willPayFee: (formData.get('willPayFee') as string) !== null,
      housingType: formData.get('housingType') as string,
      currency: formData.get('currency') as string,
    };

    if (formData.get('social')) {
      body.social = formData.get('social') as string;
    }
    if (formData.get('description')) {
      body.description = formData.get('description') as string;
    }
    if (formData.get('tenantsDescription')) {
      body.tenantsDescription = formData.get('tenantsDescription') as string;
    }

    try {
      const response = await postTenants(body);
      if (response) {
        history.push(`/ad/${response.data.id}`);
      } else {
        setOpenAlert(true);
        setIsSendingForm(false);
      }
    } catch (e) {
      setOpenAlert(true);
      setIsSendingForm(false);
    }
  };

  return (
    <Container maxWidth="sm" id="new-renter-page">
      <form onSubmit={handleSubmit} onChange={(): void => setValidationForm(defaultValidationForm)}>
        <TextField name="title" label={intl.formatMessage(messages.title)} fullWidth required />
        <Box display="flex" justifyContent="space-between">
          <TextField name="name" label={intl.formatMessage(messages.userName)} required fullWidth />
          <TextField
            error={!!validationForm.phone}
            name="phone"
            label={intl.formatMessage(messages.userPhone)}
            required
            helperText={validationForm.phone}
            className="phone-input"
            fullWidth
          />
          <TextField name="social" label={intl.formatMessage(messages.social)} fullWidth />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <GoogleAutocomplete
            onChange={(value): void => setLocationValue(value)}
            renderInput={(params: AutocompleteRenderInputParams): React.ReactNode => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label={intl.formatMessage(messages.city)} fullWidth required />
            )}
          />
          <FormControl className="form-control" fullWidth>
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
          <TextField name="minBudget" label={intl.formatMessage(messages.budgetFrom)} type="number" required fullWidth />
          <TextField
            name="maxBudget"
            label={intl.formatMessage(messages.budgetTo)}
            type="number"
            required
            fullWidth
            className="budget-to-input"
          />
          <FormControl className="form-control" fullWidth>
            <InputLabel id="select-currency-label"><FormattedMessage {...messages.currency} /></InputLabel>
            <Select
              name="currency"
              labelId="select-currency-label"
              defaultValue="USD"
            >
              {(Object.values(currency)).map(item => <MenuItem value={item}>{item}</MenuItem>)}
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
          <Button variant="contained" onClick={(): void => history.push('/')}>
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            disabled={isSendingForm}
            className="submit-button"
            variant="contained"
            color="primary"
            type="submit"
          >
            <FormattedMessage {...messages.submit} />
          </Button>
        </Box>
      </form>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={(): void => setOpenAlert(false)}
      >
        <Alert onClose={(): void => setOpenAlert(false)} severity="error">
          <FormattedMessage {...messages.error} />
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateRenter;
