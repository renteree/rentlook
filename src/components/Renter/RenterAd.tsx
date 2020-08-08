import React, { PropsWithChildren } from 'react';
import { RouteComponentProps } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Container,
  CardMedia,
  Card,
  Box,
  Typography,
  SvgIcon,
  Grid,
  Tooltip,
  Link,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { getTenant } from '~/api/coreApi';
import messages from '~/components/Renter/messages';

import Renter = Models.Renter;

interface MatchParams {
  id: string;
}

type Props = RouteComponentProps<MatchParams>;

const DESCRIPTION_LINE_HEIGHT = 24;

const RenterAd: React.FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const intl = useIntl();
  const [tenantAd, setTenantAd] = React.useState<Renter | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const { match: { params: { id } } } = props;

  const downloadTenantAd = async () => {
    const result = await getTenant(id);
    if (result && result.status === 200 && result.data) {
      setTenantAd(result.data);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    downloadTenantAd();
  }, []);

  return (
    <Container id="renter-page">
      <Box>
        <Typography variant="h4">
          {isLoading ? <Skeleton width={400} /> : tenantAd?.title}
        </Typography>
      </Box>
      <Box mt={2}>
        <Box display="flex">
          <Card className="main-card">
            {isLoading ? <Skeleton variant="rect" width={150} height={150} /> : (
              <CardMedia
                component="img"
                alt="Tenant social avatar"
                image={tenantAd?.image?.url}
                title="Tenant social avatar"
              />
            )}
          </Card>
          <Box ml={2} mt={2}>
            <Typography variant="h5" paragraph>
              {isLoading ? <Skeleton width={200} /> : tenantAd?.user.name}
            </Typography>
            <Typography variant="subtitle2" paragraph>
              {isLoading ? <Skeleton width={150} /> : tenantAd?.user.phone}
            </Typography>
            {isLoading && <Skeleton width={150} />}
            {!!tenantAd?.user?.social && (
              <Typography variant="subtitle2" paragraph>
                <Link href={tenantAd.user.social}>
                  {tenantAd.user.social}
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
        <Grid container>
          <Grid container direction="row" className="row-grid">
            <Grid item xs={1}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.where} />
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle1">
                {isLoading ? <Skeleton width={200} /> : `${tenantAd?.location.city}, ${tenantAd?.location.country}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" className="row-grid">
            <Grid item xs={1}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.what} />
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle1">
                {isLoading ? <Skeleton width={50} /> : tenantAd?.housingType}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" className="row-grid">
            <Grid item xs={1}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.howMuch} />
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="subtitle1">
                {isLoading ? <Skeleton width={200} /> : `${tenantAd?.minBudget} - ${tenantAd?.maxBudget} ${tenantAd?.currency}`}
                {tenantAd?.willPayFee && (
                  <Tooltip title={intl.formatMessage(messages.feeTooltip)} placement="top">
                    <SvgIcon htmlColor="green" className="icon-fee"> <HowToRegIcon /></SvgIcon>
                  </Tooltip>
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" className="row-grid">
            <Grid item xs={1}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.who} />
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1">
                <Box
                  p={1}
                  border={1}
                  borderRadius={5}
                  maxWidth={500}
                  minHeight={DESCRIPTION_LINE_HEIGHT * 3}
                >
                  {isLoading ? (
                    <>
                      <Skeleton width={500} />
                      <Skeleton width={500} />
                      <Skeleton width={500} />
                    </>
                  ) : tenantAd?.tenantsDescription}
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" className="row-grid">
            <Grid item xs={1}>
              <Typography variant="subtitle2">
                <FormattedMessage {...messages.details} />
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1">
                <Box
                  p={1}
                  border={1}
                  borderRadius={5}
                  minHeight={DESCRIPTION_LINE_HEIGHT * 3}
                  maxWidth={500}
                >
                  {isLoading ? (
                    <>
                      <Skeleton width={500} />
                      <Skeleton width={500} />
                      <Skeleton width={500} />
                    </>
                  ) : tenantAd?.description}
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RenterAd;
