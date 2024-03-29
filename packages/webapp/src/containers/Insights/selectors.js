/*
 *  Copyright 2019, 2020, 2021, 2022 LiteFarm.org
 *  This file is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import { createSelector } from 'reselect/es';

const insightSelector = (state) => state.insightReducer || {};

const cropsNutritionSelector = createSelector(insightSelector, (state) => state.cropNutritionData);

const soilOMSelector = createSelector(insightSelector, (state) => state.soilOMData);

const labourHappinessSelector = createSelector(
  insightSelector,
  (state) => state.labourHappinessData,
);

const biodiversitySelector = createSelector(insightSelector, (state) => state.biodiversityData);

const biodiversityLoadingSelector = createSelector(
  insightSelector,
  (state) => state.biodiversityLoading,
);

const biodiversityErrorSelector = createSelector(
  insightSelector,
  (state) => state.biodiversityError,
);

const pricesSelector = createSelector(insightSelector, (state) => state.pricesData);

const pricesDistanceSelector = createSelector(insightSelector, (state) => state.pricesDistance);

const waterBalanceSelector = createSelector(insightSelector, (state) => state.waterBalanceData);

const waterBalanceScheduleSelector = createSelector(
  insightSelector,
  (state) => state.waterBalanceSchedule,
);

const nitrogenBalanceSelector = createSelector(
  insightSelector,
  (state) => state.nitrogenBalanceData,
);

const nitrogenFrequencySelector = createSelector(
  insightSelector,
  (state) => state.nitrogenFrequencyData,
);

export {
  cropsNutritionSelector,
  soilOMSelector,
  labourHappinessSelector,
  biodiversitySelector,
  biodiversityLoadingSelector,
  biodiversityErrorSelector,
  pricesSelector,
  pricesDistanceSelector,
  waterBalanceSelector,
  waterBalanceScheduleSelector,
  nitrogenBalanceSelector,
  nitrogenFrequencySelector,
};
