import React, { useState } from 'react';
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
  Grid,
  Typography,
  Snackbar,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert, { Color } from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useIntl, FormattedMessage } from 'react-intl';
import phone from 'phone';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

// Locale
import messages from './messages';

// Internal
import { postTenants } from '~/api/coreApi';
import config from '~/config';

import Renter = Models.Renter;

function loadScript(src: string, position: HTMLElement | null, id: string): void {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    minWidth: 100,
  },
  submitButton: {
    marginLeft: theme.spacing(1),
  },
}));

const autocompleteService = { current: null };

const defaultValidationForm = {
  phone: '',
};

interface PlaceType {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}

const CreateRenter: React.FunctionComponent = () => {
  const intl = useIntl();
  const classes = useStyles();
  const [validationForm, setValidationForm] = useState(defaultValidationForm);
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(null);
  const [inputLocationValue, setInputLocationValue] = React.useState('');
  const [locationOptions, setLocationOptions] = React.useState<PlaceType[]>([]);
  const [isSendingForm, setIsSendingForm] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState<Color>();
  const loaded = React.useRef(false);

  const history = useHistory();

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${config.google.placeApi}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () => throttle((
      request: { input: string; types: string[] },
      callback: (results?: PlaceType[]) => void,
    ) => {
      (autocompleteService.current as any).getPlacePredictions(request, callback);
    }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputLocationValue === '') {
      setLocationOptions(locationValue ? [locationValue] : []);
      return undefined;
    }

    fetch({ input: inputLocationValue, types: ['(cities)'] }, (results?: PlaceType[]) => {
      if (active) {
        let newOptions = [] as PlaceType[];

        if (locationValue) {
          newOptions = [locationValue];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setLocationOptions(newOptions);
      }
    });

    return (): void => {
      active = false;
    };
  }, [locationValue, inputLocationValue, fetch]);

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
        setOpenAlert('error');
        setIsSendingForm(false);
      }
    } catch (e) {
      setOpenAlert('error');
      setIsSendingForm(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit} onChange={(): void => setValidationForm(defaultValidationForm)}>
        <TextField name="title" label={intl.formatMessage(messages.title)} fullWidth required />
        <Box display="flex" justifyContent="space-between">
          <TextField name="name" label={intl.formatMessage(messages.userName)} required />
          <TextField
            error={!!validationForm.phone}
            name="phone"
            label={intl.formatMessage(messages.userPhone)}
            required
            helperText={validationForm.phone}
          />
          <TextField name="social" label={intl.formatMessage(messages.social)} />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Autocomplete
            id="google-map"
            autoHighlight
            getOptionLabel={(option): string => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x): PlaceType[] => x}
            style={{
              maxWidth: 409,
              flex: 1,
            }}
            options={locationOptions}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={locationValue}
            onChange={(event: any, newValue: PlaceType | null): void => {
              setLocationOptions(newValue ? [newValue, ...locationOptions] : locationOptions);
              setLocationValue(newValue);
            }}
            onInputChange={(event, newInputValue): void => {
              setInputLocationValue(newInputValue);
            }}
            renderInput={(params): React.ReactNode => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label={intl.formatMessage(messages.city)} fullWidth required />
            )}
            renderOption={(option): React.ReactNode => {
              const matches = option.structured_formatting.main_text_matched_substrings;
              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match: any) => [match.offset, match.offset + match.length]),
              );

              return (
                <Grid container alignItems="center">
                  <Grid item xs>
                    {parts.map((part, index) => (
                      <span
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                    <Typography variant="body2" color="textSecondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
          />
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
          <TextField name="minBudget" label={intl.formatMessage(messages.budgetFrom)} type="number" required />
          <TextField name="maxBudget" label={intl.formatMessage(messages.budgetTo)} type="number" required />
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
            className={classes.submitButton}
            variant="contained"
            color="primary"
            type="submit"
          >
            <FormattedMessage {...messages.submit} />
          </Button>
        </Box>
      </form>
      <Snackbar
        open={!!openAlert}
        autoHideDuration={6000}
        onClose={(): void => setOpenAlert(undefined)}
      >
        <Alert onClose={(): void => setOpenAlert(undefined)} severity={openAlert}>
          <FormattedMessage {...messages.error} />
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateRenter;
