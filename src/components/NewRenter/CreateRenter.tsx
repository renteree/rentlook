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
  Avatar,
} from '@material-ui/core';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import { useIntl, FormattedMessage } from 'react-intl';
import phone from 'phone';
import { v4 as uuidv4 } from 'uuid';
import AccountCircle from '@material-ui/icons/AccountCircle';

// Locale
import messages from './messages';

// Internal
import { postTenants } from '~/api/coreApi';
import GoogleAutocomplete from './GoogleAutocomplete';
import { currency } from '~/common/enums';

import PlaceType = Models.PlaceType;

type ValidationType = {
  phone: string;
  social: string;
};

const defaultValidationForm: ValidationType = {
  phone: '',
  social: '',
};

const CreateRenter: React.FunctionComponent = () => {
  const intl = useIntl();
  const [validationForm, setValidationForm] = React.useState<ValidationType>(defaultValidationForm);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(null);
  const [isSendingForm, setIsSendingForm] = React.useState<boolean>(false);
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string>('');

  const history = useHistory();

  const validateForm = (formData: FormData): boolean => {
    let isValid = true;
    const reg = /^(?:https?:\/\/)(?:www\.)?(?:vk\.com\/.|facebook\.com\/.|instagram\.com\/.|linkedin\.com\/.)/;

    const phoneNumberData = phone(formData.get('phone') as string);
    if (!phoneNumberData.length) {
      setValidationForm({ ...validationForm, phone: intl.formatMessage(messages.notValidNumber) });
      isValid = false;
    }

    const social = formData.get('social') as string;
    if (social && !social.match(reg)) {
      setValidationForm({ ...validationForm, social: intl.formatMessage(messages.notValidSocial) });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSendingForm(true);

    const formData = new FormData(event.currentTarget);

    const isValid = validateForm(formData);
    if (!isValid) {
      setIsSendingForm(false);
      return;
    }

    formData.set('phone', phone(formData.get('phone') as string)[0]);
    formData.append('country', locationValue?.structured_formatting.secondary_text as string);
    formData.append('city', locationValue?.structured_formatting.main_text as string);
    formData.append('cityId', locationValue?.place_id as string);
    formData.set('willPayFee', (formData.get('willPayFee') as string) !== null ? 'true' : 'false');

    try {
      const response = await postTenants(formData);
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

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event?.target?.files?.length) {
      const file = event.target.files[0];
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container id="new-renter-page">
      <form onSubmit={handleSubmit} onChange={(): void => setValidationForm(defaultValidationForm)}>
        <TextField
          name="title"
          label={intl.formatMessage(messages.title)}
          fullWidth
          required
          inputProps={{ maxLength: 70, minLength: 5 }}
        />
        <Box display="flex" justifyContent="space-between">
          <label htmlFor="contained-button-file">
            <input
              name="file"
              className="input-avatar"
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleImage}
            />
            <Button component="span">
              {avatarUrl ? (
                <Avatar className="avatar" alt="Tenant social avatar" src={avatarUrl} title="Tenant social avatar" />
              ) : (
                <AccountCircle color="disabled" className="avatar-icon" />
              )}
            </Button>
          </label>
          <Box>
            <TextField
              name="name"
              label={intl.formatMessage(messages.userName)}
              required
              fullWidth
              autoComplete="name"
              inputProps={{ minLength: 2 }}
            />
            <TextField
              error={!!validationForm.phone}
              name="phone"
              label={intl.formatMessage(messages.userPhone)}
              required
              helperText={validationForm.phone}
              fullWidth
              autoComplete="tel"
            />
            <TextField
              name="social"
              label={intl.formatMessage(messages.social)}
              fullWidth
              helperText={validationForm.social || 'Fb, In, Vk or Instagram'}
              error={!!validationForm.social}
              autoComplete="url"
            />
          </Box>
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
            <InputLabel id="select-housing-type-label">
              <FormattedMessage {...messages.housingType} />
            </InputLabel>
            <Select name="housingType" labelId="select-housing-type-label" id="select-housing-type" defaultValue="flat">
              <MenuItem value="flat">
                <FormattedMessage {...messages.flat} />
              </MenuItem>
              <MenuItem value="house">
                <FormattedMessage {...messages.house} />
              </MenuItem>
              <MenuItem value="room">
                <FormattedMessage {...messages.room} />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <TextField
            name="minBudget"
            label={intl.formatMessage(messages.budgetFrom)}
            type="number"
            required
            fullWidth
          />
          <TextField
            name="maxBudget"
            label={intl.formatMessage(messages.budgetTo)}
            type="number"
            required
            fullWidth
            className="budget-to-input"
          />
          <FormControl className="form-control" fullWidth>
            <InputLabel id="select-currency-label">
              <FormattedMessage {...messages.currency} />
            </InputLabel>
            <Select name="currency" labelId="select-currency-label" defaultValue="USD">
              {Object.values(currency).map(item => (
                <MenuItem key={uuidv4()} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <TextField name="description" label={intl.formatMessage(messages.description)} multiline fullWidth rows={4} />
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
          <FormControlLabel control={<Checkbox name="willPayFee" />} label={intl.formatMessage(messages.willPayFee)} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={(): void => history.push('/')}>
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button disabled={isSendingForm} className="submit-button" variant="contained" color="primary" type="submit">
            <FormattedMessage {...messages.submit} />
          </Button>
        </Box>
      </form>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={(): void => setOpenAlert(false)}>
        <Alert onClose={(): void => setOpenAlert(false)} severity="error">
          <FormattedMessage {...messages.error} />
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateRenter;
