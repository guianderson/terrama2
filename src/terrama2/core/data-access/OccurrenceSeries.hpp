/*
 Copyright (C) 2007 National Institute For Space Research (INPE) - Brazil.

 This file is part of TerraMA2 - a free and open source computational
 platform for analysis, monitoring, and alert of geo-environmental extremes.

 TerraMA2 is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License,
 or (at your option) any later version.

 TerraMA2 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with TerraMA2. See LICENSE. If not, write to
 TerraMA2 Team at <terrama2-team@dpi.inpe.br>.
 */

/*!
  \file terrama2/core/data-access/DcpSeries.hpp

  \brief

  \author Jano Simas
 */

#ifndef __TERRAMA2_CORE_DATA_ACCESS_OCCURRENCE_SERIES_HPP__
#define __TERRAMA2_CORE_DATA_ACCESS_OCCURRENCE_SERIES_HPP__

#include <memory>
#include <unordered_map>

#include "../Config.hpp"
#include "../Shared.hpp"
//TerraMA2
#include "../data-model/DataSetOccurrence.hpp"
#include "DataSetSeries.hpp"
#include "SeriesAggregation.hpp"

namespace terrama2 {
namespace core {
struct DataSetSeries;
}  // namespace core
}  // namespace terrama2

namespace terrama2
{
  namespace core
  {
    /*!
      \class OccurrenceSeries
      \brief A OccurrenceSeries represents a set of Occurrences of a phenomena.
    */
    class TMCOREEXPORT OccurrenceSeries : public SeriesAggregation
    {
      public:
        //! Add a group of DataSet data to the OccurrenceSeries.
        void addOccurrences(std::unordered_map<DataSetPtr,DataSetSeries> seriesMap);
        //! Returns a map of DataSetOccurrence data.
        const std::unordered_map<DataSetOccurrencePtr,DataSetSeries >& occurrencesMap();

      private:
        std::unordered_map<DataSetOccurrencePtr,DataSetSeries > occurrenceMap;//!< Map of DataSetOccurrence data.

    };
  }
}

#endif // __TERRAMA2_CORE_DATA_ACCESS_OCCURRENCE_SERIES_HPP__
