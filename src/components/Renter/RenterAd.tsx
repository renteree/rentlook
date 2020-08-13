import React, { PropsWithChildren } from 'react';
import { RouteComponentProps } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { Container, CardMedia, Card, Box, Typography, SvgIcon, Tooltip, Link } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { getTenant } from '~/api/coreApi';
import messages from '~/components/Renter/messages';
import commonMessages from '~/common/messages';

import Renter = Models.Renter;

interface MatchParams {
  id: string;
}

type Props = RouteComponentProps<MatchParams>;

const DESCRIPTION_LINE_HEIGHT = 24;

type housingType = 'room' | 'flat' | 'house';

const RenterAd: React.FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const intl = useIntl();
  const [tenantAd, setTenantAd] = React.useState<Renter | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const {
    match: {
      params: { id },
    },
  } = props;

  const downloadTenantAd = async () => {
    const result = await getTenant(id);
    if (result && result.status === 200 && result.data) {
      setTenantAd(result.data);
    }
    setIsLoading(false);
  };

  let budgetDiff = 0;
  if (tenantAd) {
    const diff = tenantAd.maxBudget - tenantAd.minBudget;
    budgetDiff = diff > 0 ? diff : budgetDiff;
  }

  React.useEffect(() => {
    downloadTenantAd();
  }, []);

  const housing: housingType = tenantAd?.housingType || 'flat';

  return (
    <Container id="renter-page">
      <Box mt={2}>
        <Typography variant="h4">{isLoading ? <Skeleton width={400} /> : tenantAd?.title}</Typography>
      </Box>
      <Box mt={2}>
        <Card>
          <Box display="flex">
            {isLoading ? (
              <Skeleton variant="rect" width={150} height={150} />
            ) : (
              <>
                {tenantAd?.image?.url ? (
                  <Box maxWidth={150} maxHeight={200}>
                    <CardMedia
                      component="img"
                      alt="Tenant social avatar"
                      image={tenantAd?.image?.url}
                      title="Tenant social avatar"
                    />
                  </Box>
                ) : (
                  <AccountCircle color="disabled" className="avatar-icon" />
                )}
              </>
            )}
            <Box ml={2} mt={2} display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Typography variant="h5" paragraph>
                  {isLoading ? <Skeleton width={200} /> : tenantAd?.user.name}
                </Typography>
                <Typography variant="subtitle2" paragraph>
                  {isLoading ? (
                    <Skeleton width={150} />
                  ) : (
                    <Link href={`tel:${tenantAd?.user.phone}`}>{tenantAd?.user.phone}</Link>
                  )}
                </Typography>
              </Box>
              <Box mb={1}>
                <>
                  {isLoading && <Skeleton width={150} />}
                  {!!tenantAd?.user?.social && (
                    <Typography variant="subtitle2">
                      <Link href={tenantAd.user.social} target="_blank" rel="noopener noreferrer">
                        {tenantAd.user.social}
                      </Link>
                    </Typography>
                  )}
                </>
              </Box>
            </Box>
          </Box>
        </Card>
        <Box p={2}>
          <Box display="flex" alignItems="center" pb={1}>
            <Box flex={2}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.where} />
              </Typography>
            </Box>
            <Box flex={8}>
              <Typography variant="subtitle1">
                {isLoading ? <Skeleton width={200} /> : `${tenantAd?.location.city}, ${tenantAd?.location.country}`}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" pb={1}>
            <Box flex={2}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.what} />
              </Typography>
            </Box>
            <Box flex={8}>
              <Typography variant="subtitle1">
                {isLoading ? <Skeleton width={50} /> : <FormattedMessage {...commonMessages[housing]} />}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" pb={1}>
            <Box flex={2}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.howMuch} />
              </Typography>
            </Box>
            <Box flex={8}>
              <Typography variant="subtitle1">
                {isLoading ? (
                  <Skeleton width={200} />
                ) : (
                  `${tenantAd?.minBudget} ${tenantAd?.currency} (${budgetDiff} ${tenantAd?.currency})`
                )}
                {tenantAd?.willPayFee && (
                  <Tooltip title={intl.formatMessage(messages.feeTooltip)} placement="top">
                    <SvgIcon htmlColor="green" className="icon-fee">
                      {' '}
                      <HowToRegIcon />
                    </SvgIcon>
                  </Tooltip>
                )}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" pb={1}>
            <Box flex={2}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.who} />
              </Typography>
            </Box>
            <Box flex={8}>
              <Typography variant="subtitle1">
                <Box p={1} border={1} borderRadius={5} borderColor="grey.500" minHeight={DESCRIPTION_LINE_HEIGHT * 3}>
                  {isLoading ? [...Array(3)].map(() => <Skeleton key={uuidv4()} />) : tenantAd?.tenantsDescription}
                </Box>
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" pb={1}>
            <Box flex={2}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.details} />
              </Typography>
            </Box>
            <Box flex={8}>
              <Typography variant="subtitle1">
                <Box p={1} border={1} borderRadius={5} borderColor="grey.500" minHeight={DESCRIPTION_LINE_HEIGHT * 3}>
                  {isLoading ? [...Array(3)].map(() => <Skeleton key={uuidv4()} />) : tenantAd?.description}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RenterAd;
