import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import throttle from 'lodash/throttle';
import { v4 as uuidv4 } from 'uuid';
import config from '~/config';
import { getLanguage } from '~/redux/locale/selectors';

import PlaceType = Models.PlaceType;


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

const autocompleteService = { current: null };

type GoogleAutocompleteTypes = {
  onChange: (prop: PlaceType | null) => void;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
  className?: string;
};

const GoogleAutocomplete: React.FC<GoogleAutocompleteTypes> = ({
  renderInput,
  onChange,
  className,
}) => {
  const [locationValue, setLocationValue] = React.useState<PlaceType | null>(null);
  const [inputLocationValue, setInputLocationValue] = React.useState<string>('');
  const [locationOptions, setLocationOptions] = React.useState<PlaceType[]>([]);
  const loaded = React.useRef(false);
  const usersLocale = useSelector(getLanguage);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${config.googleApi}&libraries=places&language=${usersLocale}`,
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
    onChange(locationValue);
  }, [locationValue]);

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

  return (
    <Autocomplete
      id="google-map"
      autoHighlight
      getOptionLabel={(option): string => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x): PlaceType[] => x}
      className={className}
      fullWidth
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
      renderInput={renderInput}
      renderOption={(option): React.ReactNode => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [match.offset, match.offset + match.length]),
        );

        return (
          <Grid container alignItems="center">
            <Grid item xs>
              {parts.map(part => (
                <span
                  key={uuidv4()}
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
  );
};

export default GoogleAutocomplete;
