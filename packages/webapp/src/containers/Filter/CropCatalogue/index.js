import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PureFilterPage from '../../../components/FilterPage';
import { cropLocationsSelector } from '../../locationSlice';
import { useSelector, useDispatch } from 'react-redux';
import {
  STATUS,
  ACTIVE,
  ABANDONED,
  PLANNED,
  COMPLETE,
  NEEDS_PLAN,
  LOCATION,
  SUPPLIERS,
} from './constants';
import { cropCatalogueFilterSelector, setCropCatalogueFilter } from '../../filterSlice';

const statuses = [ACTIVE, ABANDONED, PLANNED, COMPLETE, NEEDS_PLAN];

const CropCatalogueFilterPage = () => {
  const { t } = useTranslation();
  const cropEnabledLocations = useSelector(cropLocationsSelector);
  const cropCatalogueFilter = useSelector(cropCatalogueFilterSelector);
  const dispatch = useDispatch();

  const handleApply = () => {
    dispatch(setCropCatalogueFilter(filterRef.current));
  };
  const filterRef = useRef({});

  const filters = [
    {
      subject: t('CROP_CATALOGUE.FILTER.STATUS.SUBJECT'),
      filterKey: STATUS,
      options: statuses.map((status) => ({
        value: status,
        default: cropCatalogueFilter[STATUS][status] ?? false,
        label: t(`CROP_CATALOGUE.FILTER.STATUS.${status}`),
      })),
    },
    {
      subject: t('CROP_CATALOGUE.FILTER.LOCATION'),
      filterKey: LOCATION,
      options: cropEnabledLocations.map((location) => ({
        value: location.location_id,
        default: cropCatalogueFilter[LOCATION][location.location_id] ?? false,
        label: location.name,
      })),
    },
    {
      subject: t('CROP_CATALOGUE.FILTER.SUPPLIERS'),
      filterKey: SUPPLIERS,
      options: [],
    },
  ];

  return (
    <PureFilterPage
      title={t('CROP_CATALOGUE.FILTER.TITLE')}
      filters={filters}
      onApply={handleApply}
      filterRef={filterRef}
    />
  );
};

CropCatalogueFilterPage.prototype = {
  subject: PropTypes.string,
  items: PropTypes.array,
};

export default CropCatalogueFilterPage;